using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using Sominnercore.Models;
using Sominnercore.Options;

namespace Sominnercore.Services;

public class SupabaseAuthService
{
    private readonly HttpClient _httpClient;
    private readonly SupabaseOptions _options;
    private readonly JsonSerializerOptions _serializerOptions = new(JsonSerializerDefaults.Web);

    public SupabaseAuthService(HttpClient httpClient, IOptions<SupabaseOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<SupabaseAuthResponse> SignInAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_options.Url!.TrimEnd('/')}/auth/v1/token?grant_type=password");
        request.Headers.Add("apikey", _options.AnonKey);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);

        var payload = new { email, password };
        request.Content = new StringContent(JsonSerializer.Serialize(payload, _serializerOptions), Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new SupabaseAuthException(response.StatusCode, content);
        }

        var result = JsonSerializer.Deserialize<SupabaseAuthResponse>(content, _serializerOptions);
        if (result is null || string.IsNullOrWhiteSpace(result.AccessToken))
        {
            throw new SupabaseAuthException(HttpStatusCode.InternalServerError, "Unexpected response from Supabase.");
        }

        return result;
    }

    public async Task<SupabaseUser?> GetUserAsync(string accessToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
        {
            return null;
        }

        EnsureConfigured();

        var request = new HttpRequestMessage(HttpMethod.Get, $"{_options.Url!.TrimEnd('/')}/auth/v1/user");
        request.Headers.Add("apikey", _options.AnonKey);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return JsonSerializer.Deserialize<SupabaseUser>(content, _serializerOptions);
    }

    public async Task SignOutAsync(string? accessToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
        {
            return;
        }

        EnsureConfigured();

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_options.Url!.TrimEnd('/')}/auth/v1/logout");
        request.Headers.Add("apikey", _options.AnonKey);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        await _httpClient.SendAsync(request, cancellationToken);
    }

    public record CustomerSubmissionDto(
        Guid Id,
        [property: JsonPropertyName("full_name")] string FullName,
        [property: JsonPropertyName("email")] string Email,
        [property: JsonPropertyName("phone")] string? Phone,
        [property: JsonPropertyName("company")] string? Company,
        [property: JsonPropertyName("category")] string? Category,
        [property: JsonPropertyName("description")] string? Description,
        [property: JsonPropertyName("status")] string Status,
        [property: JsonPropertyName("submitted_at")] DateTime SubmittedAt,
        [property: JsonPropertyName("tags")] string[]? Tags,
        [property: JsonPropertyName("status_updated_by")] string? StatusUpdatedBy,
        [property: JsonPropertyName("status_updated_at")] DateTime? StatusUpdatedAt
    );

    public async Task<CustomerSubmissionDto[]> GetCustomerSubmissionsAsync(string? accessToken, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var request = new HttpRequestMessage(HttpMethod.Get, $"{_options.Url!.TrimEnd('/')}/rest/v1/customer_submissions?select=*&order=submitted_at.desc");
        request.Headers.Add("apikey", _options.AnonKey);

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }

        var response = await _httpClient.SendAsync(request, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new SupabaseAuthException(response.StatusCode, content);
        }

        var data = JsonSerializer.Deserialize<CustomerSubmissionDto[]>(content, _serializerOptions);
        return data ?? Array.Empty<CustomerSubmissionDto>();
    }

    public async Task UpdateSubmissionStatusAsync(
        Guid submissionId,
        string status,
        string accessToken,
        string? updatedBy,
        DateTime? updatedAtUtc = null,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
        {
            throw new InvalidOperationException("No Supabase access token available for updating submissions.");
        }

        EnsureConfigured();

        var request = new HttpRequestMessage(HttpMethod.Patch, $"{_options.Url!.TrimEnd('/')}/rest/v1/customer_submissions?id=eq.{submissionId}");
        request.Headers.Add("apikey", _options.AnonKey);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Headers.Add("Prefer", "return=minimal");

        var payload = JsonSerializer.Serialize(new
        {
            status,
            status_updated_by = updatedBy,
            status_updated_at = updatedAtUtc?.ToUniversalTime()
        });
        request.Content = new StringContent(payload, Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new SupabaseAuthException(response.StatusCode, content);
        }
    }

    private void EnsureConfigured()
    {
        if (string.IsNullOrWhiteSpace(_options.Url) || string.IsNullOrWhiteSpace(_options.AnonKey) ||
            _options.Url.Contains("your-project-ref", StringComparison.OrdinalIgnoreCase) ||
            _options.AnonKey.Contains("your-anon-key", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Supabase configuration is missing or still using placeholder values.");
        }
    }
}

public class SupabaseAuthException : Exception
{
    public HttpStatusCode StatusCode { get; }

    public SupabaseAuthException(HttpStatusCode statusCode, string message)
        : base(message)
    {
        StatusCode = statusCode;
    }
}

