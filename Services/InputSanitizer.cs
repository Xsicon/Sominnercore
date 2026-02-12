using System.Text.RegularExpressions;

namespace SominnercoreNew.Services;

public static partial class InputSanitizer
{
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
}
