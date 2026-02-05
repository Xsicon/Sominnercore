using SominnercoreNew.Models;

namespace SominnercoreNew.Services;

public class SoftwareProductService
{
    private readonly Supabase.Client _client;
    private bool _initialized = false;

    public SoftwareProductService(Supabase.Client client)
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

    public async Task<List<Software>> GetAllAsync()
    {
        await EnsureInitializedAsync();
        var response = await _client.From<Software>()
            .Order("created_at", Postgrest.Constants.Ordering.Descending)
            .Get();
        return response.Models;
    }

    public async Task<Software?> CreateAsync(Software software)
    {
        await EnsureInitializedAsync();
        software.CreatedAt = DateTime.UtcNow.ToString("o");
        software.UpdatedAt = DateTime.UtcNow.ToString("o");
        var response = await _client.From<Software>().Insert(software);
        return response.Models.FirstOrDefault();
    }

    public async Task<Software?> UpdateAsync(Software software)
    {
        await EnsureInitializedAsync();
        software.UpdatedAt = DateTime.UtcNow.ToString("o");
        var response = await _client.From<Software>()
            .Where(x => x.Id == software.Id)
            .Update(software);
        return response.Models.FirstOrDefault();
    }

    public async Task DeleteAsync(string id)
    {
        await EnsureInitializedAsync();
        await _client.From<Software>()
            .Where(x => x.Id == id)
            .Delete();
    }
}
