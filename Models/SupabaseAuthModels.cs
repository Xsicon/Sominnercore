using System.Text.Json.Serialization;

namespace Sominnercore.Models;

public class SupabaseAuthResponse
{
    [JsonPropertyName("access_token")]
    public string? AccessToken { get; set; }

    [JsonPropertyName("token_type")]
    public string? TokenType { get; set; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }

    [JsonPropertyName("refresh_token")]
    public string? RefreshToken { get; set; }

    [JsonPropertyName("user")]
    public SupabaseUser? User { get; set; }
}

public class SupabaseUser
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("user_metadata")]
    public Dictionary<string, object>? UserMetadata { get; set; }

    [JsonPropertyName("aud")]
    public string? Audience { get; set; }

    [JsonPropertyName("role")]
    public string? Role { get; set; }
}

