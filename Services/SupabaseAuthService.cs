using Supabase;
using Supabase.Gotrue;

namespace SominnercoreNew.Services;

public class SupabaseAuthService
{
    private readonly Supabase.Client _client;
    private bool _initialized = false;

    public SupabaseAuthService(Supabase.Client client)
    {
        _client = client;
    }

    private async Task EnsureInitializedAsync()
    {
        if (!_initialized)
        {
            await _client.InitializeAsync();
            _initialized = true;
        }
    }

    public async Task<(bool Success, string? Error, User? User)> SignInAsync(string email, string password)
    {
        try
        {
            await EnsureInitializedAsync();
            var session = await _client.Auth.SignIn(email, password);

            if (session?.User != null)
            {
                return (true, null, session.User);
            }

            return (false, "Login failed. Please check your credentials.", null);
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
            await _client.Auth.SignOut();
        }
        catch
        {
            // Ignore errors on sign out
        }
    }

    public User? GetCurrentUser()
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

    public Session? GetCurrentSession()
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
