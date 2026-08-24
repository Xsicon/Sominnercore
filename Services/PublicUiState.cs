namespace KobNeti.Services;

/// <summary>Shared UI state for public marketing chrome (chat + get-started modals).</summary>
public class PublicUiState
{
    public bool ChatOpen { get; private set; }
    public bool GetStartedOpen { get; private set; }
    public bool GetStartedSubmitted { get; private set; }
    public string GetStartedEmail { get; set; } = "";

    public event Action? Changed;

    public void OpenChat()
    {
        ChatOpen = true;
        Notify();
    }

    public void CloseChat()
    {
        ChatOpen = false;
        Notify();
    }

    public void ToggleChat()
    {
        ChatOpen = !ChatOpen;
        Notify();
    }

    public void OpenGetStarted()
    {
        GetStartedOpen = true;
        GetStartedSubmitted = false;
        Notify();
    }

    public void CloseGetStarted()
    {
        GetStartedOpen = false;
        GetStartedSubmitted = false;
        Notify();
    }

    public void MarkGetStartedSubmitted()
    {
        GetStartedSubmitted = true;
        Notify();
    }

    private void Notify() => Changed?.Invoke();
}
