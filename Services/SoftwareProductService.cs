using System.Globalization;
using Postgrest;
using Postgrest.Interfaces;
using SominnercoreNew.Models;
using static Postgrest.Constants;

namespace SominnercoreNew.Services;

public class SoftwareProductService
{
    private readonly Supabase.Client _client;
    private readonly ProductChangeNotifier _notifier;
    private readonly SupabaseAuthService _auth;

    public SoftwareProductService(
        Supabase.Client client,
        ProductChangeNotifier notifier,
        SupabaseAuthService auth)
    {
        _client = client;
        _notifier = notifier;
        _auth = auth;
    }

    private Task EnsureInitializedAsync() => _auth.EnsureInitializedAsync();

    public async Task<List<Software>> GetAllAsync()
    {
        await EnsureInitializedAsync();
        var response = await _client.From<Software>()
            .Order("created_at", Ordering.Descending)
            .Get();
        return response.Models;
    }

    public async Task<List<Software>> GetPublishedAsync()
    {
        await EnsureInitializedAsync();

        var nowIso = DateTime.UtcNow.ToString("o", CultureInfo.InvariantCulture);

        // Push release-date gating to PostgREST so unreleased rows are not returned to the client.
        var filters = new List<IPostgrestQueryFilter>
        {
            new QueryFilter("release_date", Operator.Is, QueryFilter.NullVal),
            new QueryFilter("release_date", Operator.LessThanOrEqual, nowIso)
        };

        var response = await _client.From<Software>()
            .Filter("visibility", Operator.Equals, "public")
            .Filter("status", Operator.NotEqual, "deprecated")
            .Or(filters)
            .Order("created_at", Ordering.Descending)
            .Get();

        var now = DateTime.UtcNow;
        // Defense in depth if the API OR filter is unavailable / misconfigured.
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

    private static void SanitizeFields(Software software)
    {
        software.Name = InputSanitizer.SanitizeRequired(software.Name, 100);
        software.ShortDescription = InputSanitizer.SanitizeText(software.ShortDescription, 200);
        software.FullDescription = InputSanitizer.SanitizeText(software.FullDescription, 2000);
        software.Version = InputSanitizer.SanitizeRequired(software.Version, 20);
        software.Category = InputSanitizer.SanitizeText(software.Category, 50);
        software.Status = InputSanitizer.SanitizeStatus(software.Status);
        software.Visibility = InputSanitizer.SanitizeVisibility(software.Visibility);
        software.IconColor = InputSanitizer.SanitizeHexColor(software.IconColor);
        software.ReleaseDate = InputSanitizer.SanitizeReleaseDate(software.ReleaseDate);
        software.ActiveUsers = InputSanitizer.ClampInt(software.ActiveUsers, 0, 10_000_000);
        software.TotalDownloads = InputSanitizer.ClampInt(software.TotalDownloads, 0, 10_000_000);
    }

    public async Task<Software?> CreateAsync(Software software)
    {
        await EnsureInitializedAsync();
        SanitizeFields(software);
        software.CreatedAt = DateTime.UtcNow.ToString("o");
        software.UpdatedAt = DateTime.UtcNow.ToString("o");
        var response = await _client.From<Software>().Insert(software);
        _notifier.NotifyChanged();
        return response.Models.FirstOrDefault();
    }

    public async Task<Software?> UpdateAsync(Software software)
    {
        await EnsureInitializedAsync();
        SanitizeFields(software);
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

    /// <summary>
    /// Support Hub brands that must exist as Softwares / Projects in the admin catalog.
    /// Matched by <see cref="Software.Name"/> (<c>softwares.id</c> is a UUID).
    /// </summary>
    public static IReadOnlyList<Software> DefaultSupportProjects { get; } =
    [
        new Software
        {
            Name = "MuuqWear",
            ShortDescription = "Fashion ecommerce storefront with live chat, tickets, and help center.",
            FullDescription = "MuuqWear customer-facing shop. Support desk tenant id: muuqwear.",
            Version = "1.0.0",
            Status = "active",
            Category = "Support Project",
            IconColor = "#14b8a6",
            Visibility = "public"
        },
        new Software
        {
            Name = "Salguri",
            ShortDescription = "Salguri storefront — Support Hub project desk.",
            FullDescription = "Salguri customer support desk. Support desk tenant id: salguri.",
            Version = "1.0.0",
            Status = "active",
            Category = "Support Project",
            IconColor = "#f97316",
            Visibility = "public"
        },
        new Software
        {
            Name = "GaarX",
            ShortDescription = "GaarX storefront — Support Hub project desk.",
            FullDescription = "GaarX customer support desk. Support desk tenant id: gaarx.",
            Version = "1.0.0",
            Status = "active",
            Category = "Support Project",
            IconColor = "#a855f7",
            Visibility = "public"
        }
    ];

    /// <summary>
    /// Inserts missing Support Hub projects into <c>softwares</c> (matched by name).
    /// </summary>
    public async Task<int> EnsureSupportProjectsRegisteredAsync()
    {
        var existing = await GetAllAsync();
        var created = 0;

        foreach (var seed in DefaultSupportProjects)
        {
            var alreadyThere = existing.Any(p =>
                string.Equals(p.Name, seed.Name, StringComparison.OrdinalIgnoreCase));

            if (alreadyThere)
                continue;

            var row = new Software
            {
                Id = Guid.NewGuid().ToString(),
                Name = seed.Name,
                ShortDescription = seed.ShortDescription,
                FullDescription = seed.FullDescription,
                Version = seed.Version,
                Status = seed.Status,
                Category = seed.Category,
                IconColor = seed.IconColor,
                Visibility = seed.Visibility,
                ActiveUsers = 0,
                TotalDownloads = 0
            };

            await CreateAsync(row);
            created++;
        }

        return created;
    }
}
