using KobNeti.Models;

namespace KobNeti.Services;

public class PageContentService
{
    private readonly Supabase.Client _client;
    private readonly SupabaseAuthService _auth;

    public PageContentService(Supabase.Client client, SupabaseAuthService auth)
    {
        _client = client;
        _auth = auth;
    }

    private Task EnsureInitializedAsync() => _auth.EnsureInitializedAsync();

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
        var sanitizedSlug = InputSanitizer.SanitizeSlug(slug);
        var response = await _client.From<PageContent>()
            .Filter("slug", Postgrest.Constants.Operator.Equals, sanitizedSlug)
            .Get();
        return response.Models.FirstOrDefault();
    }

    public async Task<PageContent?> CreateAsync(PageContent page)
    {
        await EnsureInitializedAsync();
        SanitizeFields(page);
        page.UpdatedAt = DateTime.UtcNow.ToString("o");
        var response = await _client.From<PageContent>().Insert(page);
        return response.Models.FirstOrDefault();
    }

    public async Task<PageContent?> UpdateAsync(PageContent page)
    {
        await EnsureInitializedAsync();
        SanitizeFields(page);
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

    private static void SanitizeFields(PageContent page)
    {
        page.Slug = InputSanitizer.SanitizeSlug(page.Slug);
        page.Title = InputSanitizer.SanitizeRequired(page.Title, 200);
        page.Content = InputSanitizer.SanitizeRequired(page.Content, 50_000);
    }
}
