namespace KobNeti.Components.Support;

public static class SupportLiveChatUiHelper
{
    public static string BuildChatGridClass(bool showKbPanel, bool hasSelectedSession)
    {
        var classes = new List<string> { "kn-s3-chat" };
        if (showKbPanel)
            classes.Add("kn-s3-chat--kb-open");
        if (hasSelectedSession)
            classes.Add("kn-s3-chat--thread-open");
        return string.Join(' ', classes);
    }
}
