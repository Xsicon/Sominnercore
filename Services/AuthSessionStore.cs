using Microsoft.JSInterop;
using Newtonsoft.Json;
using Supabase.Gotrue;

namespace SominnercoreNew.Services;

/// <summary>
/// Async localStorage session persistence for Blazor WASM.
/// </summary>
public class AuthSessionStore
{
    public const string StorageKey = "sominnercore.supabase.auth";

    private readonly IJSRuntime _js;

    public AuthSessionStore(IJSRuntime js)
    {
        _js = js;
    }

    public async Task SaveAsync(Session session)
    {
        var json = JsonConvert.SerializeObject(session);
        await _js.InvokeVoidAsync("sominnercoreStorage.set", StorageKey, json);
    }

    public async Task<Session?> LoadAsync()
    {
        var json = await _js.InvokeAsync<string?>("sominnercoreStorage.get", StorageKey);
        if (string.IsNullOrWhiteSpace(json))
            return null;

        return JsonConvert.DeserializeObject<Session>(json);
    }

    public async Task ClearAsync()
    {
        await _js.InvokeVoidAsync("sominnercoreStorage.remove", StorageKey);
    }
}
