using System.Net;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Sominnercore.Models;
using Sominnercore.Options;

namespace Sominnercore.Services;

public class SupabaseAuthService
{
    private readonly HttpClient _httpClient;
    private readonly SupabaseOptions _options;
    private readonly JsonSerializerOptions _serializerOptions = new(JsonSerializerDefaults.Web);

    public SupabaseAuthService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        var section = configuration.GetSection("Supabase");
        _options = new SupabaseOptions
        {
            Url = section["Url"] ?? string.Empty,
            AnonKey = section["AnonKey"] ?? string.Empty
        };
    }

    public async Task<SupabaseAuthResponse> SignInAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.Url) || string.IsNullOrWhiteSpace(_options.AnonKey) ||
            _options.Url.Contains("your-project-ref", StringComparison.OrdinalIgnoreCase) ||
            _options.AnonKey.Contains("your-anon-key", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Supabase configuration is missing or still using placeholder values. Provide your project URL and anon key.");
        }

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"{_options.Url.TrimEnd('/')}/auth/v1/token?grant_type=password");

        request.Headers.Add("apikey", _options.AnonKey);
        request.Headers.Add("Authorization", $"Bearer {_options.AnonKey}");

        var payload = new
        {
            email,
            password
        };

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

        if (string.IsNullOrWhiteSpace(_options.Url) || string.IsNullOrWhiteSpace(_options.AnonKey))
        {
            return null;
        }

        var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"{_options.Url.TrimEnd('/')}/auth/v1/user");

        request.Headers.Add("apikey", _options.AnonKey);
        request.Headers.Add("Authorization", $"Bearer {accessToken}");

        var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return JsonSerializer.Deserialize<SupabaseUser>(content, _serializerOptions);
    }

    public async Task SignOutAsync(string accessToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(_options.Url) || string.IsNullOrWhiteSpace(_options.AnonKey))
        {
            return;
        }

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"{_options.Url.TrimEnd('/')}/auth/v1/logout");

        request.Headers.Add("apikey", _options.AnonKey);
        request.Headers.Add("Authorization", $"Bearer {accessToken}");

        await _httpClient.SendAsync(request, cancellationToken);
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

