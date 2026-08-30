using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace KobNeti.Services.Support;

public class SupportApiClient
{
    public const string SelectedTenantStorageKey = "support-hub-selected-tenant";

    private readonly HttpClient _http;
    private readonly SupabaseAuthService _auth;
    private readonly string _defaultTenantKey;
    private readonly string _defaultTenantId;
    private readonly string _defaultHelpCenterUrl;
    private string _tenantKey;
    private string _tenantId;
    private string _publicHelpCenterUrl;
    private string _displayName = "";
    private string? _agentToken;
    private DateTime _agentTokenExpires = DateTime.MinValue;
    private string? _agentRole;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public SupportApiClient(HttpClient http, IConfiguration configuration, SupabaseAuthService auth)
    {
        _http = http;
        _auth = auth;
        _defaultTenantKey = configuration["KobNetiApi:TenantKey"] ?? "pk_muuqwear_dev_public";
        _defaultTenantId = configuration["KobNetiApi:TenantId"] ?? "muuqwear";
        _defaultHelpCenterUrl = configuration["KobNetiApi:PublicHelpCenterUrl"]?.Trim() ?? "";
        _tenantKey = _defaultTenantKey;
        _tenantId = _defaultTenantId;
        _publicHelpCenterUrl = _defaultHelpCenterUrl;
        _displayName = _defaultTenantId;
    }

    public string TenantId => _tenantId;
    public string TenantKey => _tenantKey;
    public string PublicHelpCenterUrl => _publicHelpCenterUrl;
    public string DisplayName => string.IsNullOrWhiteSpace(_displayName) ? _tenantId : _displayName;
    public string AgentRole => _agentRole ?? "";
    public bool IsPlatformAdmin =>
        string.Equals(_agentRole, "admin", StringComparison.OrdinalIgnoreCase);

    public event Action? TenantChanged;

    public void SetTenant(string tenantId, string publicKey, string? displayName = null, string? publicHelpCenterUrl = null)
    {
        if (string.IsNullOrWhiteSpace(tenantId) || string.IsNullOrWhiteSpace(publicKey))
            throw new ArgumentException("Tenant id and public key are required.");

        var nextId = tenantId.Trim();
        var nextKey = publicKey.Trim();
        var nextHelp = publicHelpCenterUrl?.Trim() ?? "";
        var nextName = string.IsNullOrWhiteSpace(displayName) ? nextId : displayName.Trim();

        if (string.Equals(_tenantId, nextId, StringComparison.OrdinalIgnoreCase)
            && string.Equals(_tenantKey, nextKey, StringComparison.Ordinal)
            && string.Equals(_publicHelpCenterUrl, nextHelp, StringComparison.Ordinal)
            && string.Equals(_displayName, nextName, StringComparison.Ordinal))
        {
            return;
        }

        _tenantId = nextId;
        _tenantKey = nextKey;
        _publicHelpCenterUrl = nextHelp;
        _displayName = nextName;
        // Agent JWT is shared across tenants; keep it. Data scope comes from X-Tenant-Key.
        TenantChanged?.Invoke();
    }

    public void ResetToDefaultTenant()
    {
        SetTenant(_defaultTenantId, _defaultTenantKey, _defaultTenantId, _defaultHelpCenterUrl);
    }

    public async Task<ApiResponse<List<SupportTenantDto>>> GetTenantsAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Support/tenants");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<List<SupportTenantDto>>>(JsonOptions)
                       ?? new ApiResponse<List<SupportTenantDto>>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to load projects.";
            }
            else
            {
                body.Success = true;
                body.Data ??= [];
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<SupportTenantDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task EnsureAgentTokenAsync()
    {
        if (!string.IsNullOrWhiteSpace(_agentToken) && _agentTokenExpires > DateTime.UtcNow.AddMinutes(1))
            return;

        var supabaseToken = await _auth.GetAccessTokenAsync();
        if (string.IsNullOrWhiteSpace(supabaseToken))
            throw new InvalidOperationException("Not signed in.");

        using var req = new HttpRequestMessage(HttpMethod.Post, "api/SupportAuth/exchange");
        req.Content = JsonContent.Create(new { accessToken = supabaseToken });
        var res = await _http.SendAsync(req);
        var body = await res.Content.ReadFromJsonAsync<ApiResponse<AgentTokenDto>>(JsonOptions);
        if (!res.IsSuccessStatusCode || body?.Data is null || string.IsNullOrWhiteSpace(body.Data.AccessToken))
            throw new InvalidOperationException(body?.Message ?? "Failed to exchange support token.");

        _agentToken = body.Data.AccessToken;
        _agentTokenExpires = body.Data.ExpiresAt.ToUniversalTime();
        _agentRole = ReadJwtClaim(_agentToken, "app_role");
    }

    /// <summary>Anonymous password-reset request (Postmark via API).</summary>
    public async Task<ApiResponse<object>> RequestPasswordResetAsync(string email, string redirectTo)
    {
        try
        {
            using var req = new HttpRequestMessage(HttpMethod.Post, "api/Auth/forgot-password");
            req.Content = JsonContent.Create(new { email, redirectTo });
            var res = await _http.SendAsync(req);
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<object>>(JsonOptions)
                       ?? new ApiResponse<object>();
            body.Success = res.IsSuccessStatusCode && body.Success;
            if (!res.IsSuccessStatusCode && string.IsNullOrWhiteSpace(body.Message))
                body.Message = "Could not send reset email. Try again later.";
            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<object> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<StaffMemberDto>>> GetStaffAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Staff");
            return await ReadEnvelopeAsync<List<StaffMemberDto>>(res, "Failed to load staff.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<StaffMemberDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<StaffMemberDto>> InviteStaffAsync(
        string email, string? displayName, string role, IEnumerable<string> productSlugs)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Staff/invite", new
            {
                email,
                displayName,
                role,
                productSlugs = productSlugs.ToList()
            });
            return await ReadEnvelopeAsync<StaffMemberDto>(res, "Failed to invite staff.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<StaffMemberDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<StaffMemberDto>> DeactivateStaffAsync(Guid staffId)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Staff/{staffId}/deactivate");
            return await ReadEnvelopeAsync<StaffMemberDto>(res, "Failed to deactivate staff.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<StaffMemberDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<StaffMemberDto>> ActivateStaffAsync(Guid staffId)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Staff/{staffId}/activate");
            return await ReadEnvelopeAsync<StaffMemberDto>(res, "Failed to activate staff.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<StaffMemberDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<TeamDto>>> GetTeamsAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Teams");
            return await ReadEnvelopeAsync<List<TeamDto>>(res, "Failed to load teams.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<TeamDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<TeamDto>> CreateTeamAsync(string name, string? productSlug, string? description = null)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Teams", new
            {
                name,
                productSlug,
                description
            });
            return await ReadEnvelopeAsync<TeamDto>(res, "Failed to create team.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<TeamDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<RotateEmbedKeyDto>> RotateEmbedKeyAsync(string slug)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/products/{Uri.EscapeDataString(slug)}/rotate-key");
            return await ReadEnvelopeAsync<RotateEmbedKeyDto>(res, "Failed to rotate embed key.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<RotateEmbedKeyDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<RotateEmbedKeyDto>> GetWidgetSnippetAsync(string slug)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/products/{Uri.EscapeDataString(slug)}/widget-snippet");
            return await ReadEnvelopeAsync<RotateEmbedKeyDto>(res, "Failed to load widget snippet.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<RotateEmbedKeyDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<ProductRegistryDto>>> GetProductRegistryAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/products");
            return await ReadEnvelopeAsync<List<ProductRegistryDto>>(res, "Failed to load products.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<ProductRegistryDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<ProductRegistryDto>> UpdateProductUpstreamUrlAsync(
        string slug, string? upstreamApiBaseUrl)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Patch,
                $"api/products/{Uri.EscapeDataString(slug)}/upstream-api",
                new UpdateProductUpstreamRequest { UpstreamApiBaseUrl = upstreamApiBaseUrl });
            return await ReadEnvelopeAsync<ProductRegistryDto>(res, "Failed to save product API URL.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<ProductRegistryDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<ProductUpstreamStatusDto>> GetProductUpstreamStatusAsync(string slug)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/products/{Uri.EscapeDataString(slug)}/upstream-status");
            return await ReadEnvelopeAsync<ProductUpstreamStatusDto>(res, "Failed to check product API status.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<ProductUpstreamStatusDto> { Success = false, Message = ex.Message };
        }
    }

    private static async Task<ApiResponse<T>> ReadEnvelopeAsync<T>(HttpResponseMessage res, string fallback)
    {
        var body = await res.Content.ReadFromJsonAsync<ApiResponse<T>>(JsonOptions)
                   ?? new ApiResponse<T>();
        if (!res.IsSuccessStatusCode)
        {
            body.Success = false;
            if (string.IsNullOrWhiteSpace(body.Message))
                body.Message = fallback;
        }
        else
        {
            body.Success = true;
        }

        return body;
    }

    private static string? ReadJwtClaim(string jwt, string claim)
    {
        try
        {
            var parts = jwt.Split('.');
            if (parts.Length < 2)
                return null;
            var payload = parts[1].Replace('-', '+').Replace('_', '/');
            switch (payload.Length % 4)
            {
                case 2: payload += "=="; break;
                case 3: payload += "="; break;
            }

            using var doc = System.Text.Json.JsonDocument.Parse(
                System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(payload)));
            return doc.RootElement.TryGetProperty(claim, out var el) ? el.GetString() : null;
        }
        catch
        {
            return null;
        }
    }

    public async Task<SupportCountsDto> GetCountsAsync()
    {
        var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Support/counts");
        var body = await res.Content.ReadFromJsonAsync<ApiResponse<SupportCountsDto>>(JsonOptions);
        if (!res.IsSuccessStatusCode || body?.Success == false)
            throw new InvalidOperationException(body?.Message ?? $"Counts failed ({(int)res.StatusCode}).");
        return body?.Data ?? new SupportCountsDto();
    }

    public async Task<ApiResponse<List<ChatSessionDto>>> GetActiveSessionsResultAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Chat/active-sessions");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<List<ChatSessionDto>>>(JsonOptions)
                       ?? new ApiResponse<List<ChatSessionDto>>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                body.Data ??= [];
                if (string.IsNullOrWhiteSpace(body.Message))
                {
                    body.Message = res.StatusCode == System.Net.HttpStatusCode.Forbidden
                        ? $"No access to product '{DisplayName}'."
                        : $"Failed to load active sessions ({(int)res.StatusCode}).";
                }
            }

            body.Data ??= [];
            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<ChatSessionDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<List<ChatSessionDto>> GetActiveSessionsAsync()
    {
        var result = await GetActiveSessionsResultAsync();
        return result.Success ? result.Data ?? [] : [];
    }

    public async Task<ApiResponse<ChatSessionDto>> GetSessionByIdAsync(Guid sessionId)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/Chat/session/{sessionId}");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<ChatSessionDto>>(JsonOptions)
                       ?? new ApiResponse<ChatSessionDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to load conversation details.";
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<ChatSessionDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<List<ChatMessageDto>> GetMessagesAsync(Guid sessionId)
    {
        var result = await GetMessagesResultAsync(sessionId);
        return result.Data ?? [];
    }

    public async Task<ApiResponse<List<ChatMessageDto>>> GetMessagesResultAsync(Guid sessionId)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/Chat/messages/{sessionId}");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<List<ChatMessageDto>>>(JsonOptions)
                       ?? new ApiResponse<List<ChatMessageDto>>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to load messages.";
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<ChatMessageDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task SendAdminMessageAsync(Guid sessionId, string message)
    {
        var result = await SendAdminMessageResultAsync(sessionId, message);
        if (!result.Success)
            throw new InvalidOperationException(
                string.IsNullOrWhiteSpace(result.Message) ? "Failed to send message." : result.Message);
    }

    public async Task<ApiResponse<ChatMessageDto>> SendAdminMessageResultAsync(Guid sessionId, string message)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Chat/send", new
            {
                sessionId,
                message
            });
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<ChatMessageDto>>(JsonOptions)
                       ?? new ApiResponse<ChatMessageDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to send message.";
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<ChatMessageDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task CloseSessionAsync(Guid sessionId)
    {
        var result = await CloseSessionResultAsync(sessionId);
        if (!result.Success)
            throw new InvalidOperationException(
                string.IsNullOrWhiteSpace(result.Message) ? "Failed to close chat session." : result.Message);
    }

    public async Task<ApiResponse<object>> CloseSessionResultAsync(Guid sessionId)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Chat/close/{sessionId}");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<object>>(JsonOptions)
                       ?? new ApiResponse<object> { Success = res.IsSuccessStatusCode };
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to close chat session.";
            }
            else
            {
                body.Success = true;
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<object> { Success = false, Message = ex.Message };
        }
    }

    public async Task<TicketStatsDto?> GetTicketStatsAsync()
    {
        var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Help/admin/stats");
        var body = await res.Content.ReadFromJsonAsync<ApiResponse<TicketStatsDto>>(JsonOptions);
        if (!res.IsSuccessStatusCode || body?.Success == false)
            throw new InvalidOperationException(body?.Message ?? $"Stats failed ({(int)res.StatusCode}).");
        return body?.Data ?? new TicketStatsDto();
    }

    public async Task<ApiResponse<ApiPaginated<SupportTicketDto>>> GetTicketsPageAsync(
        int page, int pageSize, string? status = null)
    {
        var url = $"api/Help/admin/tickets?page={page}&pageSize={pageSize}";
        if (!string.IsNullOrWhiteSpace(status))
            url += $"&status={Uri.EscapeDataString(status)}";

        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, url);
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<ApiPaginated<SupportTicketDto>>>(JsonOptions)
                       ?? new ApiResponse<ApiPaginated<SupportTicketDto>>();

            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = $"Failed to load tickets ({(int)res.StatusCode}).";
            }
            else if (body.Data != null && !body.Data.HasMore && body.Data.Data.Count >= pageSize)
            {
                // Some bridges omit HasMore — infer from page fullness.
                var totalPages = body.Data.PageSize <= 0
                    ? 1
                    : (int)Math.Ceiling(body.Data.TotalCount / (double)body.Data.PageSize);
                body.Data.HasMore = body.Data.Page < totalPages ||
                                   (body.Data.TotalCount == 0 && body.Data.Data.Count >= pageSize);
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<ApiPaginated<SupportTicketDto>>
            {
                Success = false,
                Message = ex.Message
            };
        }
    }

    public async Task<List<SupportTicketDto>> GetTicketsAsync(string? status = null)
    {
        var page = await GetTicketsPageAsync(1, 50, status);
        return page.Data?.Data ?? [];
    }

    public async Task<ApiResponse<SupportTicketDto>> GetTicketByIdResultAsync(Guid ticketId)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/Help/admin/tickets/{ticketId}");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<SupportTicketDto>>(JsonOptions)
                       ?? new ApiResponse<SupportTicketDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to load ticket details.";
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<SupportTicketDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<SupportTicketDto?> GetTicketByIdAsync(Guid ticketId)
    {
        var result = await GetTicketByIdResultAsync(ticketId);
        return result.Success ? result.Data : null;
    }

    public async Task<ApiResponse<SupportTicketDto>> AssignTicketToMeAsync(Guid ticketId)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Help/admin/tickets/{ticketId}/assign-me");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<SupportTicketDto>>(JsonOptions)
                       ?? new ApiResponse<SupportTicketDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to assign ticket.";
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<SupportTicketDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<SupportTicketDto>> UpdateTicketAsync(Guid ticketId, UpdateTicketRequest patch)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Patch, $"api/Help/admin/tickets/{ticketId}", patch);
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<SupportTicketDto>>(JsonOptions)
                       ?? new ApiResponse<SupportTicketDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to update ticket.";
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<SupportTicketDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task UpdateTicketStatusAsync(Guid ticketId, string status)
    {
        var result = await UpdateTicketAsync(ticketId, new UpdateTicketRequest { Status = status });
        if (!result.Success)
            throw new InvalidOperationException(result.Message);
    }

    public async Task<ApiResponse<List<SupportMacroDto>>> GetMacrosAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Support/macros");
            return await ReadEnvelopeAsync<List<SupportMacroDto>>(res, "Failed to load macros.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<SupportMacroDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<HelpArticleDto>>> SuggestArticlesForTicketAsync(Guid ticketId, int limit = 5)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Get,
                $"api/Help/admin/tickets/{ticketId}/suggestions?limit={limit}");
            return await ReadEnvelopeAsync<List<HelpArticleDto>>(res, "Failed to load suggestions.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<HelpArticleDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<SupportTicketDto>> ConvertChatToTicketAsync(
        Guid sessionId, string? category = null, string? subject = null)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Post,
                $"api/Chat/session/{sessionId}/convert-to-ticket",
                new { category, subject });
            return await ReadEnvelopeAsync<SupportTicketDto>(res, "Failed to convert chat to ticket.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<SupportTicketDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<ChatStickyNoteDto?>> GetChatStickyNoteAsync(Guid sessionId)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Get,
                $"api/Chat/session/{sessionId}/sticky-note");

            if (res.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return new ApiResponse<ChatStickyNoteDto?>
                {
                    Success = true,
                    Data = null,
                    Message = "No sticky note"
                };
            }

            var body = await res.Content.ReadFromJsonAsync<ApiResponse<ChatStickyNoteDto?>>(JsonOptions)
                       ?? new ApiResponse<ChatStickyNoteDto?>();

            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to load sticky note.";
                return body;
            }

            body.Success = body.Success || res.IsSuccessStatusCode;
            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<ChatStickyNoteDto?> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<ChatStickyNoteDto>> SaveChatStickyNoteAsync(
        Guid sessionId, SaveChatStickyNoteRequest request)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Put,
                $"api/Chat/session/{sessionId}/sticky-note",
                request);
            return await ReadEnvelopeAsync<ChatStickyNoteDto>(res, "Failed to save sticky note.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<ChatStickyNoteDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<bool>> DeleteChatStickyNoteAsync(Guid sessionId)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Delete,
                $"api/Chat/session/{sessionId}/sticky-note");
            return await ReadEnvelopeAsync<bool>(res, "Failed to delete sticky note.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<bool> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<IncidentDto>>> GetIncidentsAsync(string? status = null)
    {
        try
        {
            var url = string.IsNullOrWhiteSpace(status)
                ? "api/Incidents"
                : $"api/Incidents?status={Uri.EscapeDataString(status)}";
            var res = await SendAuthorizedAsync(HttpMethod.Get, url);
            return await ReadEnvelopeAsync<List<IncidentDto>>(res, "Failed to load incidents.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<IncidentDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<IncidentDto>> GetIncidentAsync(Guid id)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/Incidents/{id}");
            return await ReadEnvelopeAsync<IncidentDto>(res, "Failed to load incident.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<IncidentDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<IncidentDto>> EscalateTicketToIncidentAsync(
        Guid ticketId, EscalateTicketRequest? request = null)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Post,
                $"api/Incidents/from-ticket/{ticketId}",
                request ?? new EscalateTicketRequest());
            return await ReadEnvelopeAsync<IncidentDto>(res, "Failed to escalate ticket.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<IncidentDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<IncidentDto>> EscalateChatToIncidentAsync(
        Guid sessionId, EscalateChatRequest request)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Post,
                $"api/Incidents/from-chat/{sessionId}",
                request);
            return await ReadEnvelopeAsync<IncidentDto>(res, "Failed to escalate chat.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<IncidentDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<IncidentDto>> UpdateIncidentAsync(Guid id, UpdateIncidentRequest request)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Patch, $"api/Incidents/{id}", request);
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<IncidentDto>>(JsonOptions)
                       ?? new ApiResponse<IncidentDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to update incident.";
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<IncidentDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<EngTaskDto>>> GetEngTasksAsync(string? status = null, Guid? milestoneId = null)
    {
        try
        {
            var qs = new List<string>();
            if (!string.IsNullOrWhiteSpace(status))
                qs.Add($"status={Uri.EscapeDataString(status)}");
            if (milestoneId.HasValue)
                qs.Add($"milestoneId={milestoneId}");
            var url = qs.Count == 0 ? "api/EngTasks" : $"api/EngTasks?{string.Join("&", qs)}";
            var res = await SendAuthorizedAsync(HttpMethod.Get, url);
            return await ReadEnvelopeAsync<List<EngTaskDto>>(res, "Failed to load tasks.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<EngTaskDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<EngTaskDto>> CreateEngTaskAsync(CreateEngTaskRequest request)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/EngTasks", request);
            return await ReadEnvelopeAsync<EngTaskDto>(res, "Failed to create task.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<EngTaskDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<EngTaskDto>> UpdateEngTaskAsync(Guid id, UpdateEngTaskRequest request)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Patch, $"api/EngTasks/{id}", request);
            return await ReadEnvelopeAsync<EngTaskDto>(res, "Failed to update task.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<EngTaskDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<MilestoneDto>>> GetMilestonesAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Milestones");
            return await ReadEnvelopeAsync<List<MilestoneDto>>(res, "Failed to load milestones.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<MilestoneDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<MilestoneDto>> CreateMilestoneAsync(CreateMilestoneRequest request)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Milestones", request);
            return await ReadEnvelopeAsync<MilestoneDto>(res, "Failed to create milestone.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<MilestoneDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<CalendarEventDto>>> GetCalendarEventsAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Calendar/events");
            return await ReadEnvelopeAsync<List<CalendarEventDto>>(res, "Failed to load calendar events.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<CalendarEventDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<GithubCacheDto>> GetGithubCacheAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Github");
            return await ReadEnvelopeAsync<GithubCacheDto>(res, "Failed to load GitHub cache.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<GithubCacheDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<GithubCacheDto>> RefreshGithubCacheAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Github/refresh");
            return await ReadEnvelopeAsync<GithubCacheDto>(res, "Failed to refresh GitHub cache.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<GithubCacheDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<object>> UpdateProductGithubRepoAsync(string slug, string? githubRepoUrl)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Patch,
                $"api/products/{Uri.EscapeDataString(slug)}/github-repo",
                new { githubRepoUrl });
            return await ReadEnvelopeAsync<object>(res, "Failed to update GitHub repo.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<object> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<TimeEntryDto>>> GetTimeEntriesAsync(string? status = null)
    {
        try
        {
            var url = string.IsNullOrWhiteSpace(status)
                ? "api/TimeEntries"
                : $"api/TimeEntries?status={Uri.EscapeDataString(status)}";
            var res = await SendAuthorizedAsync(HttpMethod.Get, url);
            return await ReadEnvelopeAsync<List<TimeEntryDto>>(res, "Failed to load time entries.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<TimeEntryDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<TimeEntryDto>> ClockInAsync(Guid? ticketId = null, Guid? engTaskId = null)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/TimeEntries/clock-in", new { ticketId, engTaskId });
            return await ReadEnvelopeAsync<TimeEntryDto>(res, "Failed to clock in.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<TimeEntryDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<TimeEntryDto>> ClockOutAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/TimeEntries/clock-out");
            return await ReadEnvelopeAsync<TimeEntryDto>(res, "Failed to clock out.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<TimeEntryDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<TimeEntryDto>> AddManualTimeAsync(int minutes, Guid? ticketId = null, Guid? engTaskId = null, string? notes = null)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/TimeEntries/manual", new { minutes, ticketId, engTaskId, notes });
            return await ReadEnvelopeAsync<TimeEntryDto>(res, "Failed to add manual time.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<TimeEntryDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<ApprovalRequestDto>> RequestTimeEditAsync(Guid entryId, int minutes, string? reason = null)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/TimeEntries/request-edit", new { entryId, minutes, reason });
            return await ReadEnvelopeAsync<ApprovalRequestDto>(res, "Failed to request time edit.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<ApprovalRequestDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<ApprovalRequestDto>>> GetApprovalsAsync(string? status = null)
    {
        try
        {
            var url = string.IsNullOrWhiteSpace(status)
                ? "api/Approvals"
                : $"api/Approvals?status={Uri.EscapeDataString(status)}";
            var res = await SendAuthorizedAsync(HttpMethod.Get, url);
            return await ReadEnvelopeAsync<List<ApprovalRequestDto>>(res, "Failed to load approvals.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<ApprovalRequestDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<ApprovalRequestDto>> DecideApprovalAsync(Guid id, bool approve)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Approvals/{id}/decide", new { approve });
            return await ReadEnvelopeAsync<ApprovalRequestDto>(res, "Failed to decide approval.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<ApprovalRequestDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<PayRateDto>>> GetPayRatesAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Payroll/rates");
            return await ReadEnvelopeAsync<List<PayRateDto>>(res, "Failed to load rates.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<PayRateDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<PayRateDto>> SavePayRateAsync(decimal hourlyRate, string? role = null, Guid? userId = null)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Payroll/rates", new { hourlyRate, role, userId, currency = "USD" });
            return await ReadEnvelopeAsync<PayRateDto>(res, "Failed to save rate.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<PayRateDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<PayPeriodDto>>> GetPayPeriodsAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Payroll/periods");
            return await ReadEnvelopeAsync<List<PayPeriodDto>>(res, "Failed to load pay periods.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<PayPeriodDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<PayPeriodDto>> CreatePayPeriodAsync(string label, DateOnly startsOn, DateOnly endsOn)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Payroll/periods", new { label, startsOn, endsOn });
            return await ReadEnvelopeAsync<PayPeriodDto>(res, "Failed to create pay period.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<PayPeriodDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<PayPeriodDto>> CalculatePayPeriodAsync(Guid id)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Payroll/periods/{id}/calculate");
            return await ReadEnvelopeAsync<PayPeriodDto>(res, "Failed to calculate payroll.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<PayPeriodDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<PayPeriodDto>> SubmitPayPeriodAsync(Guid id)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Payroll/periods/{id}/submit");
            return await ReadEnvelopeAsync<PayPeriodDto>(res, "Failed to submit payroll.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<PayPeriodDto> { Success = false, Message = ex.Message };
        }
    }

    public string PayPeriodExportUrl(Guid id) => $"api/Payroll/periods/{id}/export.csv";

    public async Task<(bool Success, string? Csv, string Message)> DownloadPayPeriodCsvAsync(Guid id)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, PayPeriodExportUrl(id));
            if (!res.IsSuccessStatusCode)
            {
                var err = await res.Content.ReadAsStringAsync();
                return (false, null, string.IsNullOrWhiteSpace(err) ? "Export failed." : err);
            }
            var csv = await res.Content.ReadAsStringAsync();
            return (true, csv, "OK");
        }
        catch (Exception ex)
        {
            return (false, null, ex.Message);
        }
    }

    public async Task<ApiResponse<List<AuditEventDto>>> SearchAuditAsync(string? search = null, string? action = null)
    {
        try
        {
            var qs = new List<string>();
            if (!string.IsNullOrWhiteSpace(search)) qs.Add($"search={Uri.EscapeDataString(search)}");
            if (!string.IsNullOrWhiteSpace(action)) qs.Add($"action={Uri.EscapeDataString(action)}");
            var url = qs.Count == 0 ? "api/Audit" : $"api/Audit?{string.Join("&", qs)}";
            var res = await SendAuthorizedAsync(HttpMethod.Get, url);
            return await ReadEnvelopeAsync<List<AuditEventDto>>(res, "Failed to load audit.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<AuditEventDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<NotificationDto>>> GetNotificationsAsync(bool unreadOnly = false)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/Notifications?unreadOnly={unreadOnly}");
            return await ReadEnvelopeAsync<List<NotificationDto>>(res, "Failed to load notifications.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<NotificationDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<NotificationDto>> MarkNotificationReadAsync(Guid id)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Notifications/{id}/read");
            return await ReadEnvelopeAsync<NotificationDto>(res, "Failed to mark read.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<NotificationDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<NotificationPrefsDto>> GetNotificationPrefsAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Notifications/preferences");
            return await ReadEnvelopeAsync<NotificationPrefsDto>(res, "Failed to load prefs.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<NotificationPrefsDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<NotificationPrefsDto>> SaveNotificationPrefsAsync(NotificationPrefsDto prefs)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Put, "api/Notifications/preferences", prefs);
            return await ReadEnvelopeAsync<NotificationPrefsDto>(res, "Failed to save prefs.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<NotificationPrefsDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<CalendarEventDto>> CreateCalendarEventAsync(string title, DateTime startsAt, string eventType = "meeting")
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Calendar/events", new { title, startsAt, eventType });
            return await ReadEnvelopeAsync<CalendarEventDto>(res, "Failed to create event.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<CalendarEventDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<int>> SendCalendarRemindersAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Calendar/reminders");
            return await ReadEnvelopeAsync<int>(res, "Failed to send reminders.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<int> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<OpsFileDto>>> GetOpsFilesAsync(string? folder = null)
    {
        try
        {
            var url = string.IsNullOrWhiteSpace(folder) ? "api/OpsFiles" : $"api/OpsFiles?folder={Uri.EscapeDataString(folder)}";
            var res = await SendAuthorizedAsync(HttpMethod.Get, url);
            return await ReadEnvelopeAsync<List<OpsFileDto>>(res, "Failed to load files.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<OpsFileDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<OpsFileDto>> CreateOpsFileAsync(string fileName, string folderPath = "/")
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/OpsFiles", new { fileName, folderPath });
            return await ReadEnvelopeAsync<OpsFileDto>(res, "Failed to register file.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<OpsFileDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<IntegrationDto>>> GetIntegrationsAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Integrations");
            return await ReadEnvelopeAsync<List<IntegrationDto>>(res, "Failed to load integrations.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<IntegrationDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<IntegrationDto>> ConnectIntegrationAsync(string provider, string? secretValue = null)
    {
        try
        {
            object body = string.IsNullOrWhiteSpace(secretValue)
                ? new { provider }
                : new { provider, secrets = new Dictionary<string, string> { ["token"] = secretValue } };
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Integrations/connect", body);
            return await ReadEnvelopeAsync<IntegrationDto>(res, "Failed to connect.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<IntegrationDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<IntegrationDto>> DisconnectIntegrationAsync(string provider)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Integrations/{Uri.EscapeDataString(provider)}/disconnect");
            return await ReadEnvelopeAsync<IntegrationDto>(res, "Failed to disconnect.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<IntegrationDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<OverviewDto>> GetOverviewAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Overview");
            return await ReadEnvelopeAsync<OverviewDto>(res, "Failed to load overview.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<OverviewDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<CrossProductOverviewDto>> GetCrossProductOverviewAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Overview/cross-product");
            return await ReadEnvelopeAsync<CrossProductOverviewDto>(res, "Failed to load cross-product overview.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<CrossProductOverviewDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<ReportRunDto>>> GetReportsAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Reports");
            return await ReadEnvelopeAsync<List<ReportRunDto>>(res, "Failed to load reports.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<ReportRunDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<ReportRunDto>> RunReportAsync(string reportType, string? label = null)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Reports/run", new { reportType, label });
            return await ReadEnvelopeAsync<ReportRunDto>(res, "Failed to run report.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<ReportRunDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<string>> GetReportCsvAsync(Guid id)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/Reports/{id}/csv");
            return await ReadEnvelopeAsync<string>(res, "Failed to load CSV.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<string> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<PlatformHelpArticleDto>>> GetPlatformHelpAsync(bool publishedOnly = true)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/PlatformHelp?publishedOnly={publishedOnly}");
            return await ReadEnvelopeAsync<List<PlatformHelpArticleDto>>(res, "Failed to load help.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<PlatformHelpArticleDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<ImChannelDto>>> GetImChannelsAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/InternalChat/channels");
            return await ReadEnvelopeAsync<List<ImChannelDto>>(res, "Failed to load channels.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<ImChannelDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<ImChannelDto>> CreateImChannelAsync(string name, string channelType = "channel")
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/InternalChat/channels", new { name, channelType });
            return await ReadEnvelopeAsync<ImChannelDto>(res, "Failed to create channel.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<ImChannelDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<ImMessageDto>>> GetImMessagesAsync(Guid channelId)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/InternalChat/channels/{channelId}/messages");
            return await ReadEnvelopeAsync<List<ImMessageDto>>(res, "Failed to load messages.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<ImMessageDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<ImMessageDto>> SendImMessageAsync(Guid channelId, string body)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/InternalChat/channels/{channelId}/messages", new { body });
            return await ReadEnvelopeAsync<ImMessageDto>(res, "Failed to send message.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<ImMessageDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<List<AssetDto>>> GetAssetsAsync()
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Assets");
            return await ReadEnvelopeAsync<List<AssetDto>>(res, "Failed to load assets.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<List<AssetDto>> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<AssetDto>> CreateAssetAsync(string name, string assetType = "hardware", DateOnly? renewalDate = null, string? notes = null)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Assets", new { name, assetType, renewalDate, notes });
            return await ReadEnvelopeAsync<AssetDto>(res, "Failed to create asset.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<AssetDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<AssetDto>> AssignAssetAsync(Guid id, string? userName)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Assets/{id}/assign", new { userName });
            return await ReadEnvelopeAsync<AssetDto>(res, "Failed to assign asset.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<AssetDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<AssetDto>> RetireAssetAsync(Guid id)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Assets/{id}/retire");
            return await ReadEnvelopeAsync<AssetDto>(res, "Failed to retire asset.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<AssetDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<int>> SendAssetRenewalRemindersAsync(int withinDays = 30)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, $"api/Assets/renewal-reminders?withinDays={withinDays}");
            return await ReadEnvelopeAsync<int>(res, "Failed to send reminders.");
        }
        catch (Exception ex)
        {
            return new ApiResponse<int> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<SupportTicketReplyDto>> AddTicketReplyAsync(Guid ticketId, string message)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Post,
                $"api/Help/admin/tickets/{ticketId}/replies",
                new { message });
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<SupportTicketReplyDto>>(JsonOptions)
                       ?? new ApiResponse<SupportTicketReplyDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to send reply.";
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<SupportTicketReplyDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<ApiPaginated<HelpArticleDto>>> GetPublishedArticlesPageAsync(
        int page, int pageSize)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Get,
                $"api/Help/articles?page={page}&pageSize={pageSize}");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<ApiPaginated<HelpArticleDto>>>(JsonOptions)
                       ?? new ApiResponse<ApiPaginated<HelpArticleDto>>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to load knowledge base.";
            }
            else
            {
                NormalizeArticlesPage(body.Data);
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<ApiPaginated<HelpArticleDto>>
            {
                Success = false,
                Message = ex.Message
            };
        }
    }

    public async Task<HelpArticleDto?> GetPublishedArticleByIdAsync(Guid articleId)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/Help/articles/{articleId}");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<HelpArticleDto>>(JsonOptions);
            if (body?.Data != null)
                body.Data.Status = HelpArticleDisplayStatus.FromApi(body.Data.Status);
            return body?.Data;
        }
        catch
        {
            return null;
        }
    }

    public async Task<ApiResponse<ApiPaginated<HelpArticleDto>>> GetAdminArticlesPageAsync(
        int page, int pageSize)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Get,
                $"api/Help/admin/articles?page={page}&pageSize={pageSize}");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<ApiPaginated<HelpArticleDto>>>(JsonOptions)
                       ?? new ApiResponse<ApiPaginated<HelpArticleDto>>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to load knowledge base articles.";
            }
            else
            {
                NormalizeArticlesPage(body.Data);
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<ApiPaginated<HelpArticleDto>>
            {
                Success = false,
                Message = ex.Message
            };
        }
    }

    /// <summary>Legacy helper — prefer <see cref="GetAdminArticlesPageAsync"/> + paginated loader.</summary>
    public async Task<List<HelpArticleDto>> GetAdminArticlesAsync()
    {
        var body = await GetAdminArticlesPageAsync(1, 50);
        return body.Data?.Data ?? [];
    }

    public async Task<ApiResponse<HelpArticleDto>> GetAdminArticleByIdAsync(Guid articleId)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, $"api/Help/admin/articles/{articleId}");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<HelpArticleDto>>(JsonOptions)
                       ?? new ApiResponse<HelpArticleDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to load article.";
            }
            else if (body.Data != null)
            {
                body.Data.Status = HelpArticleDisplayStatus.FromApi(body.Data.Status);
                body.Success = true;
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<HelpArticleDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<HelpArticleDto>> CreateArticleAsync(SaveHelpArticleRequest request)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Post, "api/Help/admin/articles", ToSavePayload(request));
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<HelpArticleDto>>(JsonOptions)
                       ?? new ApiResponse<HelpArticleDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to save article.";
            }
            else if (body.Data != null)
            {
                body.Data.Status = HelpArticleDisplayStatus.FromApi(body.Data.Status);
                body.Success = true;
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<HelpArticleDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<HelpArticleDto>> UpdateArticleAsync(Guid articleId, SaveHelpArticleRequest request)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Put, $"api/Help/admin/articles/{articleId}", ToSavePayload(request));
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<HelpArticleDto>>(JsonOptions)
                       ?? new ApiResponse<HelpArticleDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to save article.";
            }
            else if (body.Data != null)
            {
                body.Data.Status = HelpArticleDisplayStatus.FromApi(body.Data.Status);
                body.Success = true;
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<HelpArticleDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<HelpArticleDto>> UpdateArticleStatusAsync(Guid articleId, string displayStatus)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Patch,
                $"api/Help/admin/articles/{articleId}/status",
                new { status = HelpArticleDisplayStatus.ToApi(displayStatus) });
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<HelpArticleDto>>(JsonOptions)
                       ?? new ApiResponse<HelpArticleDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to update article status.";
            }
            else if (body.Data != null)
            {
                body.Data.Status = HelpArticleDisplayStatus.FromApi(body.Data.Status);
                body.Success = true;
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<HelpArticleDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<bool>> DeleteArticleAsync(Guid articleId)
    {
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Delete, $"api/Help/admin/articles/{articleId}");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<bool>>(JsonOptions)
                       ?? new ApiResponse<bool>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to delete article.";
            }
            else
            {
                body.Success = true;
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<bool> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<string>> UploadHelpImageAsync(string fileName, byte[] bytes, string contentType)
    {
        try
        {
            await EnsureAgentTokenAsync();
            using var content = new MultipartFormDataContent();
            var fileContent = new ByteArrayContent(bytes);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(contentType);
            content.Add(fileContent, "file", fileName);

            using var req = new HttpRequestMessage(HttpMethod.Post, "api/Help/admin/upload-image");
            req.Headers.TryAddWithoutValidation("X-Tenant-Key", _tenantKey);
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _agentToken);
            req.Content = content;

            var res = await _http.SendAsync(req);
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<string>>(JsonOptions)
                       ?? new ApiResponse<string>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Upload failed.";
            }
            else
            {
                body.Success = !string.IsNullOrWhiteSpace(body.Data);
                if (!body.Success && string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Upload failed.";
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<string> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<HelpArticleCommentDto>> AddArticleCommentAsync(Guid articleId, string bodyText)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Post,
                $"api/Help/admin/articles/{articleId}/comments",
                new { body = bodyText });
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<HelpArticleCommentDto>>(JsonOptions)
                       ?? new ApiResponse<HelpArticleCommentDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to post comment.";
            }
            else
            {
                body.Success = true;
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<HelpArticleCommentDto> { Success = false, Message = ex.Message };
        }
    }

    public async Task<ApiResponse<HelpArticleEngagementDto>> SetArticleVoteAsync(Guid articleId, string vote)
    {
        try
        {
            var res = await SendAuthorizedAsync(
                HttpMethod.Post,
                $"api/Help/admin/articles/{articleId}/vote",
                new { vote });
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<HelpArticleEngagementDto>>(JsonOptions)
                       ?? new ApiResponse<HelpArticleEngagementDto>();
            if (!res.IsSuccessStatusCode)
            {
                body.Success = false;
                if (string.IsNullOrWhiteSpace(body.Message))
                    body.Message = "Failed to save vote.";
            }
            else
            {
                body.Success = true;
            }

            return body;
        }
        catch (Exception ex)
        {
            return new ApiResponse<HelpArticleEngagementDto> { Success = false, Message = ex.Message };
        }
    }

    private static void NormalizeArticlesPage(ApiPaginated<HelpArticleDto>? page)
    {
        if (page == null)
            return;

        foreach (var article in page.Data)
            article.Status = HelpArticleDisplayStatus.FromApi(article.Status);

        if (!page.HasMore)
        {
            var totalPages = page.PageSize <= 0
                ? 1
                : (int)Math.Ceiling(page.TotalCount / (double)page.PageSize);
            page.HasMore = page.Page < totalPages;
        }
    }

    private static object ToSavePayload(SaveHelpArticleRequest request) =>
        new
        {
            title = request.Title.Trim(),
            category = request.Category.Trim(),
            content = request.Content.Trim(),
            status = HelpArticleDisplayStatus.ToApi(request.Status),
            heroImageUrl = string.IsNullOrWhiteSpace(request.HeroImageUrl)
                ? null
                : request.HeroImageUrl.Trim(),
            steps = request.Steps.Select(s => new
            {
                id = s.Id,
                sortOrder = s.SortOrder,
                detail = s.Detail,
                imageUrl = s.ImageUrl
            })
        };

    private async Task<HttpResponseMessage> SendAuthorizedAsync(HttpMethod method, string url, object? body = null)
    {
        await EnsureAgentTokenAsync();
        using var req = new HttpRequestMessage(method, url);
        req.Headers.TryAddWithoutValidation("X-Tenant-Key", _tenantKey);
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _agentToken);
        if (body is not null)
            req.Content = JsonContent.Create(body);
        return await _http.SendAsync(req);
    }
}
