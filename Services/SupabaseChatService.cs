using System.Net;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using Sominnercore.Options;

namespace Sominnercore.Services;

public class SupabaseChatService
{
    private readonly HttpClient _httpClient;
    private readonly SupabaseOptions _options;
    private readonly JsonSerializerOptions _serializerOptions = new(JsonSerializerDefaults.Web);

    public SupabaseChatService(HttpClient httpClient, IOptions<SupabaseOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<ChatSessionCreationResult> CreateChatSessionAsync(string customerName, string? customerEmail, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        // If email is provided, check for existing customer and active session
        if (!string.IsNullOrWhiteSpace(customerEmail))
        {
            var trimmedEmail = customerEmail.Trim();
            var existingContact = await FindCustomerContactByEmailAsync(trimmedEmail, cancellationToken);
            
            if (existingContact is not null)
            {
                // Check for existing active chat session
                var activeSession = await FindActiveChatSessionAsync(existingContact.Id, cancellationToken);
                if (activeSession.HasValue)
                {
                    return new ChatSessionCreationResult(activeSession.Value, true, true);
                }

                // Use existing contact but create new session
                var sessionId = await CreateSessionAsync(existingContact.Id, customerName, customerEmail, cancellationToken);
                return new ChatSessionCreationResult(sessionId, true, false);
            }
        }

        // Create new contact and session
        var contact = await CreateOrGetCustomerContactAsync(customerName, customerEmail, cancellationToken);
        var newSessionId = await CreateSessionAsync(contact.Id, customerName, customerEmail, cancellationToken);
        return new ChatSessionCreationResult(newSessionId, false, false);
    }

    public async Task<ChatMessageResponse> AddCustomerMessageAsync(Guid sessionId, string message, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var payload = new
        {
            session_id = sessionId,
            sender_type = "customer",
            message
        };

        var request = CreateRequest(HttpMethod.Post, "chat_messages");
        request.Headers.Add("Prefer", "return=representation");
        request.Content = new StringContent(JsonSerializer.Serialize(payload, _serializerOptions), Encoding.UTF8, "application/json");

        var responses = await SendAsync<ChatMessageResponse>(request, cancellationToken);
        if (responses.Count == 0)
        {
            throw new SupabaseChatException(HttpStatusCode.InternalServerError, "Supabase did not return a chat message record.");
        }

        return responses[0];
    }

    public async Task<ChatMessageResponse> AddAgentMessageAsync(Guid sessionId, string message, Guid? agentId = null, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var payload = new
        {
            session_id = sessionId,
            sender_type = "agent",
            sender_id = agentId,
            message
        };

        var request = CreateRequest(HttpMethod.Post, "chat_messages");
        request.Headers.Add("Prefer", "return=representation");
        request.Content = new StringContent(JsonSerializer.Serialize(payload, _serializerOptions), Encoding.UTF8, "application/json");

        var responses = await SendAsync<ChatMessageResponse>(request, cancellationToken);
        if (responses.Count == 0)
        {
            throw new SupabaseChatException(HttpStatusCode.InternalServerError, "Supabase did not return a chat message record.");
        }

        return responses[0];
    }

    public async Task<IReadOnlyList<ChatSessionSummary>> GetChatSessionsAsync(CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var query =
            "chat_sessions?select=id,status,started_at,customer_contacts(full_name,email),chat_messages(message,created_at)&chat_messages.order=created_at.desc&chat_messages.limit=1&order=started_at.desc";
        var request = CreateRequest(HttpMethod.Get, query);

        var sessions = await SendAsync<ChatSessionRow>(request, cancellationToken);

        return sessions
            .Select(row =>
            {
                var preview = row.Messages?.FirstOrDefault();
                return new ChatSessionSummary(
                    row.Id,
                    row.Status,
                    row.StartedAt,
                    row.Customer?.FullName,
                    row.Customer?.Email,
                    preview?.Message,
                    preview?.CreatedAt);
            })
            .ToList();
    }

    public async Task<IReadOnlyList<ChatMessageDetail>> GetChatMessagesAsync(Guid sessionId, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        // First, get all messages
        var query =
            $"chat_messages?select=id,session_id,message,sender_type,sender_id,created_at&session_id=eq.{sessionId}&order=created_at.asc";
        var request = CreateRequest(HttpMethod.Get, query);

        var messages = await SendAsync<ChatMessageRow>(request, cancellationToken);
        
        // Get unique agent IDs from messages
        var agentIds = messages
            .Where(m => m.SenderId.HasValue && m.SenderType?.ToLowerInvariant() == "agent")
            .Select(m => m.SenderId!.Value)
            .Distinct()
            .ToList();

        // Fetch agent names if there are any agent messages
        var agentNames = new Dictionary<Guid, string>();
        if (agentIds.Any())
        {
            try
            {
                // Build query with proper PostgREST syntax for 'in' operator
                var agentIdsList = string.Join(",", agentIds.Select(id => id.ToString()));
                var agentQuery = $"team_members?select=id,display_name&id=in.({agentIdsList})";
                var agentRequest = CreateRequest(HttpMethod.Get, agentQuery);
                var agents = await SendAsync<TeamMemberRow>(agentRequest, cancellationToken);
                
                foreach (var agent in agents)
                {
                    if (agent.Id.HasValue && !string.IsNullOrWhiteSpace(agent.DisplayName))
                    {
                        agentNames[agent.Id.Value] = agent.DisplayName;
                    }
                }
            }
            catch (Exception ex)
            {
                // If fetching agent names fails, continue without them
                // Log error for debugging but don't fail the entire request
                Console.Error.WriteLine($"Failed to fetch agent names: {ex.Message}");
            }
        }

        return messages
            .Select(row => new ChatMessageDetail(
                row.Id,
                row.SessionId,
                row.Message,
                ParseSenderType(row.SenderType),
                row.SenderId,
                row.CreatedAt,
                row.SenderId.HasValue && agentNames.TryGetValue(row.SenderId.Value, out var name) ? name : null))
            .ToList();
    }

    private async Task<CustomerContactResponse?> FindCustomerContactByEmailAsync(string email, CancellationToken cancellationToken)
    {
        var query = $"customer_contacts?select=id&email=eq.{Uri.EscapeDataString(email)}&limit=1";
        var request = CreateRequest(HttpMethod.Get, query);

        var contacts = await SendAsync<CustomerContactResponse>(request, cancellationToken);
        return contacts.FirstOrDefault();
    }

    private async Task<Guid?> FindActiveChatSessionAsync(Guid customerId, CancellationToken cancellationToken)
    {
        // Check for active or waiting sessions (returning customers should continue their existing chat)
        var query = $"chat_sessions?select=id&customer_id=eq.{customerId}&or=(status.eq.active,status.eq.waiting)&order=started_at.desc&limit=1";
        var request = CreateRequest(HttpMethod.Get, query);

        var sessions = await SendAsync<ChatSessionResponse>(request, cancellationToken);
        return sessions.FirstOrDefault()?.Id;
    }

    private async Task<CustomerContactResponse> CreateOrGetCustomerContactAsync(string customerName, string? customerEmail, CancellationToken cancellationToken)
    {
        var email = string.IsNullOrWhiteSpace(customerEmail)
            ? CreatePlaceholderEmail(customerName)
            : customerEmail.Trim();

        var payload = new
        {
            full_name = customerName,
            email,
            source = "website_chat"
        };

        var request = CreateRequest(HttpMethod.Post, "customer_contacts");
        request.Headers.Add("Prefer", "return=representation");
        request.Content = new StringContent(JsonSerializer.Serialize(payload, _serializerOptions), Encoding.UTF8, "application/json");

        var responses = await SendAsync<CustomerContactResponse>(request, cancellationToken);
        if (responses.Count == 0)
        {
            throw new SupabaseChatException(HttpStatusCode.InternalServerError, "Supabase did not return a customer contact record.");
        }

        return responses[0];
    }

    private async Task<Guid> CreateSessionAsync(Guid customerId, string customerName, string? customerEmail, CancellationToken cancellationToken)
    {
        var payload = new
        {
            customer_id = customerId,
            status = "active",
            metadata = new
            {
                customer_name = customerName,
                customer_email = customerEmail
            }
        };

        var request = CreateRequest(HttpMethod.Post, "chat_sessions");
        request.Headers.Add("Prefer", "return=representation");
        request.Content = new StringContent(JsonSerializer.Serialize(payload, _serializerOptions), Encoding.UTF8, "application/json");

        var responses = await SendAsync<ChatSessionResponse>(request, cancellationToken);
        if (responses.Count == 0)
        {
            throw new SupabaseChatException(HttpStatusCode.InternalServerError, "Supabase did not return a chat session record.");
        }

        return responses[0].Id;
    }

    private HttpRequestMessage CreateRequest(HttpMethod method, string path)
    {
        var request = new HttpRequestMessage(method, $"{_options.Url!.TrimEnd('/')}/rest/v1/{path}");
        request.Headers.Add("apikey", _options.AnonKey);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AnonKey);
        return request;
    }

    private async Task<List<T>> SendAsync<T>(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var response = await _httpClient.SendAsync(request, cancellationToken);
        var content = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new SupabaseChatException(response.StatusCode, content);
        }

        var data = JsonSerializer.Deserialize<List<T>>(content, _serializerOptions);
        if (data is null)
        {
            throw new SupabaseChatException(HttpStatusCode.InternalServerError, "Unexpected response from Supabase.");
        }

        return data;
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

    private static string CreatePlaceholderEmail(string name)
    {
        var sanitized = new string(name.Trim().ToLowerInvariant().Where(char.IsLetterOrDigit).ToArray());
        if (string.IsNullOrWhiteSpace(sanitized))
        {
            sanitized = "guest";
        }

        return $"{sanitized}-{Guid.NewGuid():N}@guest.sominnercore.com";
    }

    private sealed record CustomerContactResponse(
        [property: JsonPropertyName("id")] Guid Id);

    private sealed record ChatSessionResponse(
        [property: JsonPropertyName("id")] Guid Id);

    public sealed record ChatMessageResponse(
        [property: JsonPropertyName("id")] long Id,
        [property: JsonPropertyName("session_id")] Guid SessionId,
        [property: JsonPropertyName("message")] string Message,
        [property: JsonPropertyName("created_at")] DateTime CreatedAt);

    public sealed record ChatSessionSummary(
        Guid Id,
        string Status,
        DateTime StartedAt,
        string? CustomerName,
        string? CustomerEmail,
        string? LastMessagePreview,
        DateTime? LastMessageCreatedAt);

    public sealed record ChatMessageDetail(
        long Id,
        Guid SessionId,
        string Message,
        ChatSenderType SenderType,
        Guid? SenderId,
        DateTime CreatedAt,
        string? AgentName = null);

    public sealed record ChatSessionCreationResult(
        Guid SessionId,
        bool IsReturningCustomer,
        bool IsReusingSession);

    public enum ChatSenderType
    {
        Customer,
        Agent,
        System
    }

    private sealed record ChatSessionRow(
        [property: JsonPropertyName("id")] Guid Id,
        [property: JsonPropertyName("status")] string Status,
        [property: JsonPropertyName("started_at")] DateTime StartedAt,
        [property: JsonPropertyName("customer_contacts")] CustomerContactRow? Customer,
        [property: JsonPropertyName("chat_messages")] List<MessagePreviewRow>? Messages);

    private sealed record CustomerContactRow(
        [property: JsonPropertyName("full_name")] string? FullName,
        [property: JsonPropertyName("email")] string? Email);

    private sealed record MessagePreviewRow(
        [property: JsonPropertyName("message")] string Message,
        [property: JsonPropertyName("created_at")] DateTime CreatedAt);

    private sealed record ChatMessageRow(
        [property: JsonPropertyName("id")] long Id,
        [property: JsonPropertyName("session_id")] Guid SessionId,
        [property: JsonPropertyName("message")] string Message,
        [property: JsonPropertyName("sender_type")] string SenderType,
        [property: JsonPropertyName("sender_id")] Guid? SenderId,
        [property: JsonPropertyName("created_at")] DateTime CreatedAt);

    private sealed record TeamMemberRow(
        [property: JsonPropertyName("id")] Guid? Id,
        [property: JsonPropertyName("display_name")] string? DisplayName);

    private static ChatSenderType ParseSenderType(string value) =>
        value.ToLowerInvariant() switch
        {
            "agent" => ChatSenderType.Agent,
            "system" => ChatSenderType.System,
            _ => ChatSenderType.Customer
        };
}

public class SupabaseChatException : Exception
{
    public HttpStatusCode StatusCode { get; }

    public SupabaseChatException(HttpStatusCode statusCode, string message)
        : base(message)
    {
        StatusCode = statusCode;
    }
}

