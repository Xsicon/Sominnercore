using System.Globalization;
using System.Text.Json;
using Microsoft.JSInterop;

namespace KobNeti.Services;

/// <summary>
/// Browser-persisted rate limiter. Soft client-side control only — Supabase Auth still enforces server limits.
/// </summary>
public class RateLimiter
{
    private readonly IJSRuntime _js;
    private readonly Dictionary<string, List<DateTime>> _memory = new();
    private const int MaxAttempts = 5;
    private static readonly TimeSpan Window = TimeSpan.FromSeconds(60);
    private const string StoragePrefix = "sominnercore-rl-";

    public RateLimiter(IJSRuntime js)
    {
        _js = js;
    }

    public async Task<bool> IsAllowedAsync(string key)
    {
        var list = await LoadAsync(key);
        CleanExpired(list);
        await SaveAsync(key, list);
        return list.Count < MaxAttempts;
    }

    public async Task RecordAttemptAsync(string key)
    {
        var list = await LoadAsync(key);
        CleanExpired(list);
        list.Add(DateTime.UtcNow);
        await SaveAsync(key, list);
    }

    private async Task<List<DateTime>> LoadAsync(string key)
    {
        if (_memory.TryGetValue(key, out var cached))
            return cached;

        try
        {
            var raw = await _js.InvokeAsync<string?>("sominnercoreStorage.get", StoragePrefix + key);
            if (!string.IsNullOrWhiteSpace(raw))
            {
                var parsed = JsonSerializer.Deserialize<List<string>>(raw) ?? new List<string>();
                var list = parsed
                    .Select(s => DateTime.TryParse(s, CultureInfo.InvariantCulture,
                        DateTimeStyles.RoundtripKind, out var dt) ? dt : (DateTime?)null)
                    .Where(dt => dt.HasValue)
                    .Select(dt => dt!.Value.ToUniversalTime())
                    .ToList();
                _memory[key] = list;
                return list;
            }
        }
        catch
        {
            // Fall back to in-memory if JS/localStorage unavailable
        }

        var fresh = new List<DateTime>();
        _memory[key] = fresh;
        return fresh;
    }

    private async Task SaveAsync(string key, List<DateTime> list)
    {
        _memory[key] = list;
        try
        {
            var payload = JsonSerializer.Serialize(list.Select(t => t.ToUniversalTime().ToString("o")));
            await _js.InvokeVoidAsync("sominnercoreStorage.set", StoragePrefix + key, payload);
        }
        catch
        {
            // Ignore persistence failures
        }
    }

    private static void CleanExpired(List<DateTime> list)
    {
        var cutoff = DateTime.UtcNow - Window;
        list.RemoveAll(t => t < cutoff);
    }
}
