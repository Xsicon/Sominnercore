namespace KobNeti.Components.Support;

public static class SupportLiveChatUiHelper
{
    public static string BuildTabShellClass(bool showKbPanel, bool hasSelectedSession)
    {
        var classes = new List<string> { "cs-tab-shell", "cs-live-chat" };
        if (showKbPanel)
            classes.Add("cs-tab-shell--kb-open");
        if (hasSelectedSession)
            classes.Add("cs-tab-shell--chat-open");
        return string.Join(' ', classes);
    }
}
