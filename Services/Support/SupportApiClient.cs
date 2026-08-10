using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace SominnercoreNew.Services.Support;

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

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public SupportApiClient(HttpClient http, IConfiguration configuration, SupabaseAuthService auth)
    {
        _http = http;
        _auth = auth;
        _defaultTenantKey = configuration["SupportApi:TenantKey"] ?? "pk_muuqwear_dev_public";
        _defaultTenantId = configuration["SupportApi:TenantId"] ?? "muuqwear";
        _defaultHelpCenterUrl = configuration["SupportApi:PublicHelpCenterUrl"]?.Trim() ?? "";
        _tenantKey = _defaultTenantKey;
        _tenantId = _defaultTenantId;
        _publicHelpCenterUrl = _defaultHelpCenterUrl;
        _displayName = _defaultTenantId;
    }

    public string TenantId => _tenantId;
    public string TenantKey => _tenantKey;
    public string PublicHelpCenterUrl => _publicHelpCenterUrl;
    public string DisplayName => string.IsNullOrWhiteSpace(_displayName) ? _tenantId : _displayName;

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
    }

    public async Task<SupportCountsDto> GetCountsAsync()
    {
        var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Support/counts");
        var body = await res.Content.ReadFromJsonAsync<ApiResponse<SupportCountsDto>>(JsonOptions);
        return body?.Data ?? new SupportCountsDto();
    }

    public async Task<List<ChatSessionDto>> GetActiveSessionsAsync()
    {
        var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Chat/active-sessions");
        var body = await res.Content.ReadFromJsonAsync<ApiResponse<List<ChatSessionDto>>>(JsonOptions);
        return body?.Data ?? [];
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
        try
        {
            var res = await SendAuthorizedAsync(HttpMethod.Get, "api/Help/admin/stats");
            var body = await res.Content.ReadFromJsonAsync<ApiResponse<TicketStatsDto>>(JsonOptions);
            if (res.IsSuccessStatusCode && body?.Success == true && body.Data != null)
                return body.Data;
            return null;
        }
        catch
        {
            return null;
        }
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
