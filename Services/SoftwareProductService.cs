using System.Globalization;
using SominnercoreNew.Models;

namespace SominnercoreNew.Services;

public class SoftwareProductService
{
    private readonly Supabase.Client _client;
    private readonly ProductChangeNotifier _notifier;
    private bool _initialized = false;

    public SoftwareProductService(Supabase.Client client, ProductChangeNotifier notifier)
    {
        _client = client;
        _notifier = notifier;
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

    public async Task<List<Software>> GetPublishedAsync()
    {
        await EnsureInitializedAsync();

        var response = await _client.From<Software>()
            .Filter("visibility", Postgrest.Constants.Operator.Equals, "public")
            .Filter("status", Postgrest.Constants.Operator.NotEqual, "deprecated")
            .Order("created_at", Postgrest.Constants.Ordering.Descending)
            .Get();

        var now = DateTime.UtcNow;

        return response.Models
            .Where(s => IsReleaseDatePassed(s.ReleaseDate, now))
            .ToList();
    }

    private static bool IsReleaseDatePassed(string? releaseDate, DateTime utcNow)
    {
        if (string.IsNullOrWhiteSpace(releaseDate))
            return true;

        if (DateTime.TryParse(releaseDate, CultureInfo.InvariantCulture,
            DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal, out var parsedDate))
        {
            return parsedDate <= utcNow;
        }

        return false;
    }

    public async Task<Software?> CreateAsync(Software software)
    {
        await EnsureInitializedAsync();
        software.CreatedAt = DateTime.UtcNow.ToString("o");
        software.UpdatedAt = DateTime.UtcNow.ToString("o");
        var response = await _client.From<Software>().Insert(software);
        _notifier.NotifyChanged();
        return response.Models.FirstOrDefault();
    }

    public async Task<Software?> UpdateAsync(Software software)
    {
        await EnsureInitializedAsync();
        software.UpdatedAt = DateTime.UtcNow.ToString("o");
        var response = await _client.From<Software>()
            .Update(software);
        _notifier.NotifyChanged();
        return response.Models.FirstOrDefault();
    }

    public async Task DeleteAsync(string id)
    {
        await EnsureInitializedAsync();
        await _client.From<Software>()
            .Where(x => x.Id == id)
            .Delete();
        _notifier.NotifyChanged();
    }
}
