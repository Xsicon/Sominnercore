using System.Text.RegularExpressions;

namespace SominnercoreNew.Services;

public static partial class InputSanitizer
{
    private static readonly HashSet<string> AllowedStatuses =
        new(StringComparer.OrdinalIgnoreCase) { "active", "upcoming", "deprecated" };

    private static readonly HashSet<string> AllowedVisibilities =
        new(StringComparer.OrdinalIgnoreCase) { "public", "hidden" };

    public static string? SanitizeText(string? input, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(input))
            return null;

        var trimmed = input.Trim();
        var stripped = StripHtmlTags(trimmed);
        return stripped.Length > maxLength ? stripped[..maxLength] : stripped;
    }

    public static string SanitizeRequired(string? input, int maxLength)
    {
        return SanitizeText(input, maxLength) ?? "";
    }

    public static string SanitizeSlug(string? input, int maxLength = 100)
    {
        var raw = SanitizeRequired(input, maxLength).ToLowerInvariant().Replace(' ', '-');
        var slug = SlugRegex().Replace(raw, "");
        slug = Regex.Replace(slug, "-{2,}", "-").Trim('-');
        if (slug.Length > maxLength)
            slug = slug[..maxLength].TrimEnd('-');
        return slug;
    }

    public static string SanitizeHexColor(string? input, string fallback = "#3b82f6")
    {
        if (string.IsNullOrWhiteSpace(input))
            return fallback;

        var trimmed = input.Trim();
        return HexColorRegex().IsMatch(trimmed) ? trimmed.ToLowerInvariant() : fallback;
    }

    public static string SanitizeStatus(string? input, string fallback = "active")
    {
        if (!string.IsNullOrWhiteSpace(input) && AllowedStatuses.Contains(input.Trim()))
            return input.Trim().ToLowerInvariant();
        return fallback;
    }

    public static string SanitizeVisibility(string? input, string fallback = "public")
    {
        if (!string.IsNullOrWhiteSpace(input) && AllowedVisibilities.Contains(input.Trim()))
            return input.Trim().ToLowerInvariant();
        return fallback;
    }

    public static string? SanitizeReleaseDate(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return null;

        if (DateTime.TryParse(input, System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.AssumeUniversal |
                System.Globalization.DateTimeStyles.AdjustToUniversal, out var parsed))
        {
            return parsed.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
        }

        return null;
    }

    public static int ClampInt(int value, int min, int max)
    {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    private static string StripHtmlTags(string input)
    {
        return HtmlTagRegex().Replace(input, "");
    }

    [GeneratedRegex("<[^>]*>", RegexOptions.Compiled)]
    private static partial Regex HtmlTagRegex();

    [GeneratedRegex("^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$", RegexOptions.Compiled)]
    private static partial Regex HexColorRegex();

    [GeneratedRegex("[^a-z0-9-]", RegexOptions.Compiled)]
    private static partial Regex SlugRegex();
}
