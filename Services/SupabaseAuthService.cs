using Microsoft.Extensions.Configuration;
using Supabase.Gotrue;

namespace SominnercoreNew.Services;

public class SupabaseAuthService
{
    private readonly Supabase.Client _client;
    private readonly AuthSessionStore _sessionStore;
    private readonly HashSet<string> _adminEmails;
    private readonly SemaphoreSlim _initLock = new(1, 1);
    private bool _initialized;

    public SupabaseAuthService(
        Supabase.Client client,
        AuthSessionStore sessionStore,
        IConfiguration configuration)
    {
        _client = client;
        _sessionStore = sessionStore;
        _adminEmails = configuration.GetSection("Supabase:AdminEmails")
            .GetChildren()
            .Select(c => c.Value?.Trim().ToLowerInvariant())
            .Where(e => !string.IsNullOrWhiteSpace(e))
            .Cast<string>()
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    public async Task EnsureInitializedAsync()
    {
        if (_initialized)
            return;

        await _initLock.WaitAsync();
        try
        {
            if (_initialized)
                return;

            await _client.InitializeAsync();
            await RestoreSessionFromStorageAsync();
            _initialized = true;
        }
        finally
        {
            _initLock.Release();
        }
    }

    private async Task RestoreSessionFromStorageAsync()
    {
        // Already have an in-memory session (e.g. just signed in).
        if (GetCurrentSession()?.User != null)
            return;

        Session? stored;
        try
        {
            stored = await _sessionStore.LoadAsync();
        }
        catch
        {
            return;
        }

        if (stored == null ||
            string.IsNullOrWhiteSpace(stored.AccessToken) ||
            string.IsNullOrWhiteSpace(stored.RefreshToken))
        {
            return;
        }

        LocalStorageSessionHandler.SetCache(
            Newtonsoft.Json.JsonConvert.SerializeObject(stored));

        try
        {
            // Force refresh so we get a current user + app_metadata from the server.
            await _client.Auth.SetSession(
                stored.AccessToken,
                stored.RefreshToken,
                forceAccessTokenRefresh: true);

            var restored = GetCurrentSession();
            if (restored != null)
                await PersistSessionAsync(restored);
        }
        catch
        {
            await _sessionStore.ClearAsync();
            LocalStorageSessionHandler.SetCache(null);
        }
    }

    private async Task PersistSessionAsync(Session session)
    {
        try
        {
            LocalStorageSessionHandler.SetCache(
                Newtonsoft.Json.JsonConvert.SerializeObject(session));
            await _sessionStore.SaveAsync(session);
        }
        catch
        {
            // Ignore persistence failures
        }
    }

    public async Task<(bool Success, string? Error, User? User)> SignInAsync(string email, string password)
    {
        try
        {
            await EnsureInitializedAsync();
            var session = await _client.Auth.SignIn(email, password);

            if (session?.User == null)
                return (false, "Login failed. Please check your credentials.", null);

            if (!IsAdmin(session.User, session))
            {
                await _client.Auth.SignOut();
                await _sessionStore.ClearAsync();
                LocalStorageSessionHandler.SetCache(null);
                return (false, "not_authorized", null);
            }

            await PersistSessionAsync(session);
            return (true, null, session.User);
        }
        catch (Exception ex)
        {
            return (false, ex.Message, null);
        }
    }

    public async Task SignOutAsync()
    {
        try
        {
            await EnsureInitializedAsync();
            await _client.Auth.SignOut();
        }
        catch
        {
            // Ignore errors on sign out
        }
        finally
        {
            try { await _sessionStore.ClearAsync(); } catch { /* ignore */ }
            LocalStorageSessionHandler.SetCache(null);
        }
    }

    public async Task<string?> GetAccessTokenAsync()
    {
        await EnsureInitializedAsync();
        var session = GetCurrentSession();
        return session?.AccessToken;
    }

    /// <summary>
    /// Display name for support agent actions (assign-to-me, agent filters).
    /// Prefers FullName/name metadata, else email local-part, else "Admin".
    /// </summary>
    public async Task<string> GetAgentDisplayNameAsync()
    {
        await EnsureInitializedAsync();
        var user = GetCurrentUser() ?? GetCurrentSession()?.User;
        if (user == null)
            return "Admin";

        if (user.UserMetadata != null)
        {
            if (TryGetMetadataString(user.UserMetadata, "full_name", out var fullName) &&
                !string.IsNullOrWhiteSpace(fullName))
                return fullName.Trim();

            if (TryGetMetadataString(user.UserMetadata, "FullName", out var fullNameAlt) &&
                !string.IsNullOrWhiteSpace(fullNameAlt))
                return fullNameAlt.Trim();

            if (TryGetMetadataString(user.UserMetadata, "name", out var name) &&
                !string.IsNullOrWhiteSpace(name))
                return name.Trim();
        }

        var email = user.Email?.Trim();
        if (!string.IsNullOrWhiteSpace(email))
        {
            var at = email.IndexOf('@');
            if (at > 0)
                return email[..at];
            return email;
        }

        return "Admin";
    }

    /// <summary>
    /// Restores persisted session (if any) and returns the user only when they are an admin.
    /// </summary>
    public async Task<(User? User, Session? Session)> GetAuthenticatedAdminAsync()
    {
        await EnsureInitializedAsync();

        var session = GetCurrentSession();
        var user = GetCurrentUser() ?? session?.User;

        if (session != null &&
            (user == null || IsAccessTokenExpired(session)) &&
            !string.IsNullOrEmpty(session.RefreshToken))
        {
            try
            {
                session = await _client.Auth.RefreshSession();
                user = session?.User ?? GetCurrentUser();
                if (session != null)
                    await PersistSessionAsync(session);
            }
            catch
            {
                await SignOutAsync();
                return (null, null);
            }
        }

        if (user == null || session == null)
            return (null, null);

        // Refresh once so JWT/app_metadata is current after admin grants.
        if (!IsAdmin(user, session))
        {
            try
            {
                session = await _client.Auth.RefreshSession();
                user = session?.User ?? user;
                if (session != null)
                    await PersistSessionAsync(session);
            }
            catch
            {
                // Fall through to authorization check
            }
        }

        if (user == null || session == null || !IsAdmin(user, session))
        {
            // Keep storage cleared so refresh doesn't loop a non-admin session.
            await SignOutAsync();
            return (null, null);
        }

        return (user, session);
    }

    public bool IsAdmin(User user, Session? session = null)
    {
        if (HasAdminAppMetadata(user))
            return true;

        if (session != null && HasAdminRoleInAccessToken(session.AccessToken))
            return true;

        var email = user.Email?.Trim();
        return !string.IsNullOrEmpty(email) && _adminEmails.Contains(email);
    }

    private static bool IsAccessTokenExpired(Session session)
    {
        try
        {
            var expiresAt = session.ExpiresAt();
            return expiresAt <= DateTime.UtcNow.AddSeconds(30);
        }
        catch
        {
            return false;
        }
    }

    private static bool HasAdminAppMetadata(User user)
    {
        if (user.AppMetadata == null || user.AppMetadata.Count == 0)
            return false;

        if (TryGetMetadataString(user.AppMetadata, "role", out var role) &&
            string.Equals(role, "admin", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (TryGetMetadataString(user.AppMetadata, "is_admin", out var isAdmin) &&
            (string.Equals(isAdmin, "true", StringComparison.OrdinalIgnoreCase) || isAdmin == "1"))
        {
            return true;
        }

        return false;
    }

    private static bool TryGetMetadataString(
        Dictionary<string, object> metadata,
        string key,
        out string? value)
    {
        value = null;
        if (!metadata.TryGetValue(key, out var raw) || raw == null)
            return false;

        value = raw switch
        {
            string s => s,
            bool b => b ? "true" : "false",
            System.Text.Json.JsonElement je when je.ValueKind == System.Text.Json.JsonValueKind.String => je.GetString(),
            System.Text.Json.JsonElement je when je.ValueKind == System.Text.Json.JsonValueKind.True => "true",
            System.Text.Json.JsonElement je when je.ValueKind == System.Text.Json.JsonValueKind.False => "false",
            _ => raw.ToString()
        };
        return !string.IsNullOrWhiteSpace(value);
    }

    private static bool HasAdminRoleInAccessToken(string? accessToken)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
            return false;

        try
        {
            var parts = accessToken.Split('.');
            if (parts.Length < 2)
                return false;

            var payload = parts[1]
                .Replace('-', '+')
                .Replace('_', '/');
            switch (payload.Length % 4)
            {
                case 2: payload += "=="; break;
                case 3: payload += "="; break;
            }

            var json = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(payload));
            using var doc = System.Text.Json.JsonDocument.Parse(json);

            if (!doc.RootElement.TryGetProperty("app_metadata", out var appMeta))
                return false;

            if (appMeta.TryGetProperty("role", out var role) &&
                string.Equals(role.GetString(), "admin", StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            if (appMeta.TryGetProperty("is_admin", out var isAdmin))
            {
                var value = isAdmin.ValueKind == System.Text.Json.JsonValueKind.True
                    ? "true"
                    : isAdmin.ToString();
                if (string.Equals(value, "true", StringComparison.OrdinalIgnoreCase) || value == "1")
                    return true;
            }
        }
        catch
        {
            return false;
        }

        return false;
    }

    private User? GetCurrentUser()
    {
        try
        {
            return _client.Auth.CurrentUser;
        }
        catch
        {
            return null;
        }
    }

    private Session? GetCurrentSession()
    {
        try
        {
            return _client.Auth.CurrentSession;
        }
        catch
        {
            return null;
        }
    }
}
