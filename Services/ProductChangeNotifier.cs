namespace SominnercoreNew.Services;

public class ProductChangeNotifier
{
    public event Action? OnChange;

    public void NotifyChanged() => OnChange?.Invoke();
}
