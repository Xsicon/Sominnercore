using SominnercoreNew.Models;

namespace SominnercoreNew.Services;

public class PageContentService
{
    private readonly Supabase.Client _client;
    private bool _initialized = false;

    public PageContentService(Supabase.Client client)
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

    public async Task<List<PageContent>> GetAllAsync()
    {
        await EnsureInitializedAsync();
        var response = await _client.From<PageContent>()
            .Order("title", Postgrest.Constants.Ordering.Ascending)
            .Get();
        return response.Models;
    }

    public async Task<PageContent?> GetBySlugAsync(string slug)
    {
        await EnsureInitializedAsync();
        var response = await _client.From<PageContent>()
            .Filter("slug", Postgrest.Constants.Operator.Equals, slug)
            .Get();
        return response.Models.FirstOrDefault();
    }

    public async Task<PageContent?> CreateAsync(PageContent page)
    {
        await EnsureInitializedAsync();
        page.Slug = InputSanitizer.SanitizeRequired(page.Slug, 100).ToLowerInvariant().Replace(" ", "-");
        page.Title = InputSanitizer.SanitizeRequired(page.Title, 200);
        page.UpdatedAt = DateTime.UtcNow.ToString("o");
        var response = await _client.From<PageContent>().Insert(page);
        return response.Models.FirstOrDefault();
    }

    public async Task<PageContent?> UpdateAsync(PageContent page)
    {
        await EnsureInitializedAsync();
        page.Title = InputSanitizer.SanitizeRequired(page.Title, 200);
        page.UpdatedAt = DateTime.UtcNow.ToString("o");
        var response = await _client.From<PageContent>().Update(page);
        return response.Models.FirstOrDefault();
    }

    public async Task DeleteAsync(string id)
    {
        await EnsureInitializedAsync();
        await _client.From<PageContent>()
            .Where(x => x.Id == id)
            .Delete();
    }
}
