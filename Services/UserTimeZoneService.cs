using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using KobNeti.Services.Support;
using Microsoft.JSInterop;

namespace KobNeti.Services;

public sealed class BrowserTimeZoneInfo
{
    public string Id { get; set; } = "UTC";
    public string Abbreviation { get; set; } = "UTC";
    public string OffsetLabel { get; set; } = "UTC";
    public int OffsetMinutes { get; set; }
    public string NowTime { get; set; } = "";
}

/// <summary>API timestamps are UTC; force Kind=Utc on JSON deserialize.</summary>
public sealed class UtcDateTimeConverter : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            var text = reader.GetString();
            if (string.IsNullOrWhiteSpace(text))
                return default;
            if (DateTimeOffset.TryParse(text, out var dto))
                return dto.UtcDateTime;
        }

        return DateTime.SpecifyKind(reader.GetDateTime(), DateTimeKind.Utc);
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options) =>
        writer.WriteStringValue(value.ToUniversalTime().ToString("o"));
}

public sealed class UtcNullableDateTimeConverter : JsonConverter<DateTime?>
{
    public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null)
            return null;
        return new UtcDateTimeConverter().Read(ref reader, typeof(DateTime), options);
    }

    public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
    {
        if (value is null) { writer.WriteNullValue(); return; }
        new UtcDateTimeConverter().Write(writer, value.Value, options);
    }
}

public sealed class UserTimeZoneService
{
    private const string TagPattern = @"@tz:([^@]+)@";

    private readonly IJSRuntime _js;
    private BrowserTimeZoneInfo? _browser;
    private string _todayKey = "";
    private bool _ready;

    public UserTimeZoneService(IJSRuntime js) => _js = js;

    public string TimeZoneId => _browser?.Id ?? "UTC";
    public string Abbreviation => _browser?.Abbreviation ?? "UTC";
    public string OffsetLabel => _browser?.OffsetLabel ?? "UTC";
    public string DisplayLabel => $"{Abbreviation} ({OffsetLabel})";
    public string NowTime => _browser?.NowTime ?? "";

    public async Task EnsureAsync()
    {
        if (_ready) return;
        try
        {
            _browser = await _js.InvokeAsync<BrowserTimeZoneInfo>("kobnetiTimeZone.getInfo");
            _todayKey = await _js.InvokeAsync<string>(
                "kobnetiTimeZone.formatUtc",
                DateTime.UtcNow.ToString("o"),
                TimeZoneId,
                "datekey");
        }
        catch
        {
            _browser = new BrowserTimeZoneInfo
            {
                Id = TimeZoneInfo.Local.Id,
                Abbreviation = TimeZoneInfo.Local.IsDaylightSavingTime(DateTime.Now)
                    ? TimeZoneInfo.Local.DaylightName
                    : TimeZoneInfo.Local.StandardName,
                OffsetLabel = FormatOffset(TimeZoneInfo.Local.GetUtcOffset(DateTime.Now)),
                NowTime = DateTime.Now.ToString("h:mm tt")
            };
            _todayKey = DateOnly.FromDateTime(DateTime.Now).ToString("yyyy-MM-dd");
        }

        _ready = true;
    }

    public static string ToIsoUtc(DateTime value)
    {
        var utc = value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
        };
        return utc.ToString("o");
    }

    public static DateTime AsUtc(DateTime value) =>
        DateTime.Parse(ToIsoUtc(value), null, System.Globalization.DateTimeStyles.RoundtripKind);

    public async Task<string> FormatTimeAsync(DateTime value, string? timeZoneId = null) =>
        await _js.InvokeAsync<string>(
            "kobnetiTimeZone.formatUtc",
            ToIsoUtc(value),
            timeZoneId ?? TimeZoneId,
            "time");

    public async Task<string> FormatDateAsync(DateTime value, string? timeZoneId = null) =>
        await _js.InvokeAsync<string>(
            "kobnetiTimeZone.formatUtc",
            ToIsoUtc(value),
            timeZoneId ?? TimeZoneId,
            "date");

    public async Task<string> FormatDateTimeAsync(DateTime value, string? timeZoneId = null) =>
        await _js.InvokeAsync<string>(
            "kobnetiTimeZone.formatUtc",
            ToIsoUtc(value),
            timeZoneId ?? TimeZoneId,
            "datetime");

    public async Task<string> FormatTimeWithZoneAsync(DateTime value, string? timeZoneId = null)
    {
        var tz = timeZoneId ?? TimeZoneId;
        return await _js.InvokeAsync<string>(
            "kobnetiTimeZone.formatTimeWithZone",
            ToIsoUtc(value),
            tz);
    }

    public async Task<string> LocalDateKeyAsync(DateTime value, string? timeZoneId = null) =>
        await _js.InvokeAsync<string>(
            "kobnetiTimeZone.formatUtc",
            ToIsoUtc(value),
            timeZoneId ?? TimeZoneId,
            "datekey");

    public async Task RefreshNowAsync()
    {
        try
        {
            _browser = await _js.InvokeAsync<BrowserTimeZoneInfo>("kobnetiTimeZone.getInfo");
            _todayKey = await _js.InvokeAsync<string>(
                "kobnetiTimeZone.formatUtc",
                DateTime.UtcNow.ToString("o"),
                TimeZoneId,
                "datekey");
            _ready = true;
        }
        catch { /* keep previous */ }
    }

    /// <summary>Re-read browser timezone before clock-in so each punch uses this device's location.</summary>
    public async Task RefreshForClockInAsync() => await RefreshNowAsync();

    public async Task<string> AbbreviationForAsync(string timeZoneId) =>
        await _js.InvokeAsync<string>("kobnetiTimeZone.abbreviationFor", timeZoneId);

    public async Task<string> EntryZoneLabelAsync(string? notes)
    {
        var id = ParseEntryTimeZone(notes);
        if (string.IsNullOrWhiteSpace(id))
            return $"{Abbreviation} (this device)";
        return await AbbreviationForAsync(id);
    }

    public bool EntryUsesDifferentZone(string? notes)
    {
        var id = ParseEntryTimeZone(notes);
        return !string.IsNullOrWhiteSpace(id)
               && !string.Equals(id, TimeZoneId, StringComparison.OrdinalIgnoreCase);
    }

    public async Task<bool> IsTodayAsync(DateTime utcInstant, string? timeZoneId = null)
    {
        var key = await LocalDateKeyAsync(utcInstant, timeZoneId);
        return string.Equals(key, _todayKey, StringComparison.Ordinal);
    }

    public string BuildClockInNotes(string? userNotes = null)
    {
        var tag = $"@tz:{TimeZoneId}@";
        return string.IsNullOrWhiteSpace(userNotes) ? tag : $"{tag} {userNotes.Trim()}";
    }

    public static string? ParseEntryTimeZone(string? notes)
    {
        if (string.IsNullOrWhiteSpace(notes)) return null;
        var m = Regex.Match(notes, TagPattern);
        return m.Success ? m.Groups[1].Value : null;
    }

    public static string DisplayNotes(string? notes)
    {
        if (string.IsNullOrWhiteSpace(notes)) return "";
        return Regex.Replace(notes, TagPattern, "").Trim();
    }

    public string EntryZoneLabel(string? notes)
    {
        var id = ParseEntryTimeZone(notes) ?? TimeZoneId;
        if (string.Equals(id, TimeZoneId, StringComparison.OrdinalIgnoreCase))
            return Abbreviation;
        var city = id.Contains('/') ? id[(id.LastIndexOf('/') + 1)..] : id;
        return city.Replace('_', ' ');
    }

    private static string FormatOffset(TimeSpan offset)
    {
        var total = (int)offset.TotalMinutes;
        var sign = total >= 0 ? "+" : "-";
        var abs = Math.Abs(total);
        var h = abs / 60;
        var m = abs % 60;
        return m == 0 ? $"UTC{sign}{h}" : $"UTC{sign}{h}:{m:D2}";
    }
}

public sealed class TimeEntryDisplayRow
{
    public TimeEntryDto Entry { get; init; } = null!;
    public string DateLabel { get; set; } = "";
    public string ClockInLabel { get; set; } = "";
    public string ClockOutLabel { get; set; } = "";
    public string ZoneId { get; set; } = "";
    public string ZoneLabel { get; set; } = "";
    public string Notes { get; set; } = "";
}
