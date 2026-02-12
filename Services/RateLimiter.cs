namespace SominnercoreNew.Services;

public class RateLimiter
{
    private readonly Dictionary<string, List<DateTime>> _attempts = new();
    private const int MaxAttempts = 5;
    private static readonly TimeSpan Window = TimeSpan.FromSeconds(60);

    public bool IsAllowed(string key)
    {
        CleanExpired(key);

        if (!_attempts.TryGetValue(key, out var list))
            return true;

        return list.Count < MaxAttempts;
    }

    public void RecordAttempt(string key)
    {
        if (!_attempts.ContainsKey(key))
            _attempts[key] = new List<DateTime>();

        _attempts[key].Add(DateTime.UtcNow);
    }

    private void CleanExpired(string key)
    {
        if (!_attempts.TryGetValue(key, out var list))
            return;

        var cutoff = DateTime.UtcNow - Window;
        list.RemoveAll(t => t < cutoff);
    }
}
