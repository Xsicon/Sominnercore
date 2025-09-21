using MudBlazor;

public class CustomMudTheme : MudTheme
{
    public CustomMudTheme()
    {
        PaletteLight = new PaletteLight()
        {
            Primary = "#0d9488",
            Secondary = "#f97316",
            Background = "#FFFFFF",
            AppbarBackground = "#252525",
            AppbarText = "#FFFFFF"
        };

        Typography = new Typography()
        {
            Default = new DefaultTypography()
            {
                FontFamily = new[] { "FONT_FROM_FIGMA", "sans-serif" }
            },
            H1 = new H1Typography { FontFamily = new[] { "FONT_FROM_FIGMA", "sans-serif" } },
            H2 = new H2Typography { FontFamily = new[] { "FONT_FROM_FIGMA", "sans-serif" } },
            H3 = new H3Typography { FontFamily = new[] { "FONT_FROM_FIGMA", "sans-serif" } },
            H4 = new H4Typography { FontFamily = new[] { "FONT_FROM_FIGMA", "sans-serif" } },
            H5 = new H5Typography { FontFamily = new[] { "FONT_FROM_FIGMA", "sans-serif" } },
            H6 = new H6Typography { FontFamily = new[] { "FONT_FROM_FIGMA", "sans-serif" } },
            Button = new ButtonTypography { FontFamily = new[] { "FONT_FROM_FIGMA", "sans-serif" } },
            Subtitle1 = new Subtitle1Typography { FontFamily = new[] { "FONT_FROM_FIGMA", "sans-serif" } },
            Subtitle2 = new Subtitle2Typography { FontFamily = new[] { "FONT_FROM_FIGMA", "sans-serif" } }
        };
    }
}
