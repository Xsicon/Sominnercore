using Newtonsoft.Json;
using Supabase.Gotrue;
using Supabase.Gotrue.Interfaces;

namespace SominnercoreNew.Services;

/// <summary>
/// Sync persistence adapter required by supabase-csharp.
/// Backed by an in-memory cache that <see cref="AuthSessionStore"/> keeps in sync with localStorage.
/// </summary>
public class LocalStorageSessionHandler : IGotrueSessionPersistence<Session>
{
    private static string? _cachedJson;

    internal static void SetCache(string? json) => _cachedJson = json;

    internal static string? GetCache() => _cachedJson;

    public void SaveSession(Session session)
    {
        try
        {
            _cachedJson = JsonConvert.SerializeObject(session);
        }
        catch
        {
            // Ignore
        }
    }

    public void DestroySession()
    {
        _cachedJson = null;
    }

    public Session? LoadSession()
    {
        try
        {
            if (string.IsNullOrWhiteSpace(_cachedJson))
                return null;

            return JsonConvert.DeserializeObject<Session>(_cachedJson);
        }
        catch
        {
            return null;
        }
    }
}
