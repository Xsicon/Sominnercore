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

    public async Task<CreateUserResponse> CreateUserAsync(
        string email,
        string password,
        string firstName,
        string lastName,
        string roleName,
        bool isActive,
        string? accessToken,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
        {
            throw new InvalidOperationException("Access token is required to create users.");
        }

        EnsureConfigured();

        // NOTE: For production, user creation should be done via a backend API to protect the ServiceRoleKey.
        // The ServiceRoleKey should NEVER be exposed in client-side code.
        // For now, we'll use the Admin API if ServiceRoleKey is available, otherwise fall back to anon key
        // (which may not work depending on your RLS policies).
        var serviceKey = _options.ServiceRoleKey ?? _options.AnonKey;
        
        // Step 1: Create user in Supabase Auth using Admin API
        var createUserRequest = new HttpRequestMessage(HttpMethod.Post, $"{_options.Url!.TrimEnd('/')}/auth/v1/admin/users");
        createUserRequest.Headers.Add("apikey", serviceKey);
        createUserRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", serviceKey);

        var userPayload = new
        {
            email,
            password,
            email_confirm = true,
            user_metadata = new Dictionary<string, object>
            {
                { "first_name", firstName },
                { "last_name", lastName },
                { "role", roleName }
            }
        };

        createUserRequest.Content = new StringContent(
            JsonSerializer.Serialize(userPayload, _serializerOptions),
            Encoding.UTF8,
            "application/json");

        var createUserResponse = await _httpClient.SendAsync(createUserRequest, cancellationToken);
        var createUserContent = await createUserResponse.Content.ReadAsStringAsync(cancellationToken);

        if (!createUserResponse.IsSuccessStatusCode)
        {
            throw new SupabaseAuthException(createUserResponse.StatusCode, createUserContent);
        }

        var createdUser = JsonSerializer.Deserialize<SupabaseUser>(createUserContent, _serializerOptions);
        if (createdUser?.Id == null)
        {
            throw new SupabaseAuthException(HttpStatusCode.InternalServerError, "Failed to create user in Auth.");
        }

        // Step 2: Get role ID
        var roleId = await GetRoleIdByNameAsync(roleName, accessToken, cancellationToken);
        if (roleId == null)
        {
            throw new SupabaseAuthException(HttpStatusCode.NotFound, $"Role '{roleName}' not found.");
        }

        // Step 3: Create team member record
        var teamMemberPayload = new
        {
            auth_user_id = createdUser.Id,
            role_id = roleId,
            display_name = $"{firstName} {lastName}",
            email = email,
            status = isActive ? "active" : "inactive"
        };

        var createTeamMemberRequest = new HttpRequestMessage(
            HttpMethod.Post,
            $"{_options.Url!.TrimEnd('/')}/rest/v1/team_members");
        createTeamMemberRequest.Headers.Add("apikey", _options.AnonKey);
        createTeamMemberRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        createTeamMemberRequest.Headers.Add("Prefer", "return=representation");
        createTeamMemberRequest.Content = new StringContent(
            JsonSerializer.Serialize(teamMemberPayload, _serializerOptions),
            Encoding.UTF8,
            "application/json");

        var teamMemberResponse = await _httpClient.SendAsync(createTeamMemberRequest, cancellationToken);
        var teamMemberContent = await teamMemberResponse.Content.ReadAsStringAsync(cancellationToken);

        if (!teamMemberResponse.IsSuccessStatusCode)
        {
            throw new SupabaseAuthException(teamMemberResponse.StatusCode, teamMemberContent);
        }

        var teamMember = JsonSerializer.Deserialize<TeamMemberDto[]>(teamMemberContent, _serializerOptions);
        return new CreateUserResponse
        {
            UserId = createdUser.Id,
            TeamMember = teamMember?.FirstOrDefault()
        };
    }

    public async Task<TeamMemberDto[]> GetTeamMembersAsync(string? accessToken, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"{_options.Url!.TrimEnd('/')}/rest/v1/team_members?select=*,roles(name,description)&order=created_at.desc");
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

        var data = JsonSerializer.Deserialize<TeamMemberDto[]>(content, _serializerOptions);
        return data ?? Array.Empty<TeamMemberDto>();
    }

    public async Task<AuthUserDto[]> GetAllAuthUsersAsync(string? accessToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
        {
            throw new InvalidOperationException("Access token is required to fetch auth users.");
        }

        EnsureConfigured();

        // Use Admin API to get all users from auth.users
        // Note: This requires ServiceRoleKey for production
        var serviceKey = _options.ServiceRoleKey ?? _options.AnonKey;
        var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"{_options.Url!.TrimEnd('/')}/auth/v1/admin/users?per_page=1000");
        request.Headers.Add("apikey", serviceKey);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", serviceKey);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            // If admin API fails, fall back to just team members
            // This is expected if ServiceRoleKey is not configured
            Console.WriteLine($"Warning: Could not fetch auth users: {content}");
            return Array.Empty<AuthUserDto>();
        }

        try
        {
            // Supabase Admin API returns users in a paginated format with a "users" property
            // Try to deserialize as wrapped object first
            var wrappedResponse = JsonSerializer.Deserialize<AuthUsersWrappedResponse>(content, _serializerOptions);
            if (wrappedResponse?.Users != null)
            {
                return wrappedResponse.Users;
            }

            // If that fails, try as direct array
            var data = JsonSerializer.Deserialize<AuthUserDto[]>(content, _serializerOptions);
            return data ?? Array.Empty<AuthUserDto>();
        }
        catch (JsonException ex)
        {
            // Log the actual response for debugging
            Console.WriteLine($"Error deserializing auth users. Response: {content.Substring(0, Math.Min(500, content.Length))}");
            Console.WriteLine($"Exception: {ex.Message}");
            return Array.Empty<AuthUserDto>();
        }
    }

    public record AuthUsersWrappedResponse(
        [property: JsonPropertyName("users")] AuthUserDto[]? Users
    );

    public record AuthUserDto(
        [property: JsonPropertyName("id")] string Id,
        [property: JsonPropertyName("email")] string? Email,
        [property: JsonPropertyName("created_at")] string? CreatedAt,
        [property: JsonPropertyName("last_sign_in_at")] string? LastSignInAt,
        [property: JsonPropertyName("user_metadata")] Dictionary<string, object>? UserMetadata
    );

    public async Task<RoleDto[]> GetRolesAsync(string? accessToken, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"{_options.Url!.TrimEnd('/')}/rest/v1/roles?select=*&order=level.desc");
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

        var data = JsonSerializer.Deserialize<RoleDto[]>(content, _serializerOptions);
        return data ?? Array.Empty<RoleDto>();
    }

    public async Task<TeamMemberDto?> GetTeamMemberByAuthUserIdAsync(string authUserId, string? accessToken, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"{_options.Url!.TrimEnd('/')}/rest/v1/team_members?auth_user_id=eq.{Uri.EscapeDataString(authUserId)}&select=*,roles(name,description)");
        request.Headers.Add("apikey", _options.AnonKey);

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }

        var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        Console.WriteLine($"[SupabaseAuthService] GetTeamMemberByAuthUserIdAsync response: {content}");
        var teamMembers = JsonSerializer.Deserialize<TeamMemberDto[]>(content, _serializerOptions);
        var teamMember = teamMembers?.FirstOrDefault();
        if (teamMember != null)
        {
            Console.WriteLine($"[SupabaseAuthService] Deserialized team member - Email: {teamMember.Email}, Status: '{teamMember.Status}'");
        }
        return teamMember;
    }

    public async Task<AuthUserDto?> GetAuthUserByIdAsync(string userId, string? accessToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
        {
            throw new InvalidOperationException("Access token is required to fetch auth user.");
        }

        EnsureConfigured();

        var serviceKey = _options.ServiceRoleKey ?? _options.AnonKey;
        var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"{_options.Url!.TrimEnd('/')}/auth/v1/admin/users/{Uri.EscapeDataString(userId)}");
        request.Headers.Add("apikey", serviceKey);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", serviceKey);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return JsonSerializer.Deserialize<AuthUserDto>(content, _serializerOptions);
    }

    public async Task UpdateUserAsync(
        string userId,
        string email,
        string firstName,
        string lastName,
        string roleName,
        bool isActive,
        string? accessToken,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
        {
            throw new InvalidOperationException("Access token is required to update users.");
        }

        EnsureConfigured();

        var serviceKey = _options.ServiceRoleKey ?? _options.AnonKey;

        // Step 1: Update user in Supabase Auth
        var updateUserRequest = new HttpRequestMessage(
            HttpMethod.Put,
            $"{_options.Url!.TrimEnd('/')}/auth/v1/admin/users/{Uri.EscapeDataString(userId)}");
        updateUserRequest.Headers.Add("apikey", serviceKey);
        updateUserRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", serviceKey);

        var userMetadata = new Dictionary<string, object>();
        if (!string.IsNullOrWhiteSpace(firstName))
            userMetadata["first_name"] = firstName;
        if (!string.IsNullOrWhiteSpace(lastName))
            userMetadata["last_name"] = lastName;
        if (!string.IsNullOrWhiteSpace(roleName))
            userMetadata["role"] = roleName;

        var userPayload = new
        {
            email,
            user_metadata = userMetadata
        };

        updateUserRequest.Content = new StringContent(
            JsonSerializer.Serialize(userPayload, _serializerOptions),
            Encoding.UTF8,
            "application/json");

        var updateUserResponse = await _httpClient.SendAsync(updateUserRequest, cancellationToken);
        if (!updateUserResponse.IsSuccessStatusCode)
        {
            var content = await updateUserResponse.Content.ReadAsStringAsync(cancellationToken);
            throw new SupabaseAuthException(updateUserResponse.StatusCode, content);
        }

        // Step 2: Get or create team member record
        var teamMember = await GetTeamMemberByAuthUserIdAsync(userId, accessToken, cancellationToken);
        var roleId = await GetRoleIdByNameAsync(roleName, accessToken, cancellationToken);
        
        if (roleId == null)
        {
            throw new SupabaseAuthException(HttpStatusCode.NotFound, $"Role '{roleName}' not found.");
        }

        if (teamMember != null)
        {
            // Update existing team member
            var updateTeamMemberRequest = new HttpRequestMessage(
                HttpMethod.Patch,
                $"{_options.Url!.TrimEnd('/')}/rest/v1/team_members?auth_user_id=eq.{Uri.EscapeDataString(userId)}");
            updateTeamMemberRequest.Headers.Add("apikey", _options.AnonKey);
            updateTeamMemberRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            updateTeamMemberRequest.Headers.Add("Prefer", "return=minimal");

            var teamMemberPayload = new
            {
                role_id = roleId,
                display_name = $"{firstName} {lastName}",
                email = email,
                status = isActive ? "active" : "inactive"
            };

            updateTeamMemberRequest.Content = new StringContent(
                JsonSerializer.Serialize(teamMemberPayload, _serializerOptions),
                Encoding.UTF8,
                "application/json");

            var updateTeamMemberResponse = await _httpClient.SendAsync(updateTeamMemberRequest, cancellationToken);
            if (!updateTeamMemberResponse.IsSuccessStatusCode)
            {
                var content = await updateTeamMemberResponse.Content.ReadAsStringAsync(cancellationToken);
                throw new SupabaseAuthException(updateTeamMemberResponse.StatusCode, content);
            }
        }
        else
        {
            // Create team member if it doesn't exist
            var createTeamMemberRequest = new HttpRequestMessage(
                HttpMethod.Post,
                $"{_options.Url!.TrimEnd('/')}/rest/v1/team_members");
            createTeamMemberRequest.Headers.Add("apikey", _options.AnonKey);
            createTeamMemberRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            createTeamMemberRequest.Headers.Add("Prefer", "return=minimal");

            var teamMemberPayload = new
            {
                auth_user_id = userId,
                role_id = roleId,
                display_name = $"{firstName} {lastName}",
                email = email,
                status = isActive ? "active" : "inactive"
            };

            createTeamMemberRequest.Content = new StringContent(
                JsonSerializer.Serialize(teamMemberPayload, _serializerOptions),
                Encoding.UTF8,
                "application/json");

            var createTeamMemberResponse = await _httpClient.SendAsync(createTeamMemberRequest, cancellationToken);
            if (!createTeamMemberResponse.IsSuccessStatusCode)
            {
                var content = await createTeamMemberResponse.Content.ReadAsStringAsync(cancellationToken);
                throw new SupabaseAuthException(createTeamMemberResponse.StatusCode, content);
            }
        }
    }

    public async Task UpdateUserStatusAsync(
        string userId,
        bool isActive,
        string? accessToken,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
        {
            throw new InvalidOperationException("Access token is required to update user status.");
        }

        EnsureConfigured();

        // Update team member status
        var updateTeamMemberRequest = new HttpRequestMessage(
            HttpMethod.Patch,
            $"{_options.Url!.TrimEnd('/')}/rest/v1/team_members?auth_user_id=eq.{Uri.EscapeDataString(userId)}");
        updateTeamMemberRequest.Headers.Add("apikey", _options.AnonKey);
        updateTeamMemberRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        updateTeamMemberRequest.Headers.Add("Prefer", "return=minimal");

        var teamMemberPayload = new
        {
            status = isActive ? "active" : "inactive"
        };

        updateTeamMemberRequest.Content = new StringContent(
            JsonSerializer.Serialize(teamMemberPayload, _serializerOptions),
            Encoding.UTF8,
            "application/json");

        var updateTeamMemberResponse = await _httpClient.SendAsync(updateTeamMemberRequest, cancellationToken);
        if (!updateTeamMemberResponse.IsSuccessStatusCode)
        {
            var content = await updateTeamMemberResponse.Content.ReadAsStringAsync(cancellationToken);
            throw new SupabaseAuthException(updateTeamMemberResponse.StatusCode, content);
        }
    }

    private async Task<long?> GetRoleIdByNameAsync(string roleName, string accessToken, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"{_options.Url!.TrimEnd('/')}/rest/v1/roles?name=eq.{Uri.EscapeDataString(roleName)}&select=id");
        request.Headers.Add("apikey", _options.AnonKey);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        var roles = JsonSerializer.Deserialize<RoleDto[]>(content, _serializerOptions);
        return roles?.FirstOrDefault()?.Id;
    }

    public record CreateUserResponse
    {
        public string? UserId { get; init; }
        public TeamMemberDto? TeamMember { get; init; }
    }

    public record TeamMemberDto(
        [property: JsonPropertyName("id")] Guid Id,
        [property: JsonPropertyName("auth_user_id")] Guid AuthUserId,
        [property: JsonPropertyName("role_id")] long RoleId,
        [property: JsonPropertyName("display_name")] string DisplayName,
        [property: JsonPropertyName("email")] string Email,
        [property: JsonPropertyName("status")] string Status,
        [property: JsonPropertyName("avatar_url")] string? AvatarUrl,
        [property: JsonPropertyName("created_at")] DateTime CreatedAt,
        [property: JsonPropertyName("updated_at")] DateTime UpdatedAt,
        [property: JsonPropertyName("roles")] RoleDto? Role
    );

    public record RoleDto(
        [property: JsonPropertyName("id")] long Id,
        [property: JsonPropertyName("name")] string Name,
        [property: JsonPropertyName("description")] string? Description,
        [property: JsonPropertyName("level")] int Level
    );

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

