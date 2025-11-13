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

    public async Task<Guid> CreateChatSessionAsync(string customerName, string? customerEmail, CancellationToken cancellationToken = default)
    {
        EnsureConfigured();

        var contact = await CreateCustomerContactAsync(customerName, customerEmail, cancellationToken);
        return await CreateSessionAsync(contact.Id, customerName, customerEmail, cancellationToken);
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

        var query =
            $"chat_messages?select=id,session_id,message,sender_type,sender_id,created_at&session_id=eq.{sessionId}&order=created_at.asc";
        var request = CreateRequest(HttpMethod.Get, query);

        var messages = await SendAsync<ChatMessageRow>(request, cancellationToken);
        return messages
            .Select(row => new ChatMessageDetail(
                row.Id,
                row.SessionId,
                row.Message,
                ParseSenderType(row.SenderType),
                row.SenderId,
                row.CreatedAt))
            .ToList();
    }

    private async Task<CustomerContactResponse> CreateCustomerContactAsync(string customerName, string? customerEmail, CancellationToken cancellationToken)
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
        DateTime CreatedAt);

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

