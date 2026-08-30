namespace KobNeti.Components.Support;

public sealed class StickyNoteColorOption
{
    public string Id { get; init; } = "";
    public string Name { get; init; } = "";
    public string Hex { get; init; } = "";
    public string TextHex { get; init; } = "";
    public string SubtextHex { get; init; } = "";
}

public static class SupportStickyNoteTheme
{
    public const string DefaultHex = "#F29D68";
    public const string StorageKey = "kobneti_sticky_color";

    public static readonly IReadOnlyList<StickyNoteColorOption> Palette =
    [
        new() { Id = "apricot-orange", Name = "Apricot Orange", Hex = "#F29D68", TextHex = "#1E1B18", SubtextHex = "#5C4E43" },
        new() { Id = "amber-yellow", Name = "Amber Yellow", Hex = "#F8CF66", TextHex = "#1E1B18", SubtextHex = "#5C4E43" },
        new() { Id = "peach-salmon", Name = "Peach Salmon", Hex = "#ED9566", TextHex = "#1E1B18", SubtextHex = "#5C4E43" },
        new() { Id = "lavender-purple", Name = "Lavender Purple", Hex = "#9D80F5", TextHex = "#181424", SubtextHex = "#423860" },
        new() { Id = "chartreuse-lime", Name = "Chartreuse Lime", Hex = "#D2EA7B", TextHex = "#1A210F", SubtextHex = "#4A5B2B" },
        new() { Id = "sky-cyan", Name = "Sky Cyan", Hex = "#56CCF2", TextHex = "#0C2738", SubtextHex = "#255875" },
    ];

    public static StickyNoteColorOption Resolve(string? hexOrId)
    {
        if (string.IsNullOrWhiteSpace(hexOrId))
            return Palette[0];

        var value = hexOrId.Trim();
        return Palette.FirstOrDefault(c =>
                   c.Hex.Equals(value, StringComparison.OrdinalIgnoreCase) ||
                   c.Id.Equals(value, StringComparison.OrdinalIgnoreCase))
               ?? Palette[0];
    }
}
