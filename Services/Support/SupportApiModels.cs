namespace KobNeti.Services.Support;

public class ApiResponse<T>
{
    public T? Data { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = "";
}

public class ApiPaginated<T>
{
    public List<T> Data { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public bool HasMore { get; set; }
}

public class SupportCountsDto
{
    public int ActiveChats { get; set; }
    public int OpenTickets { get; set; }
}

public class ChatSessionDto
{
    public Guid Id { get; set; }
    public string CustomerName { get; set; } = "";
    public string? CustomerEmail { get; set; }
    public string? Email { get; set; }
    public string? GuestEmail { get; set; }
    public string Status { get; set; } = "";
    public DateTime LastActivity { get; set; }
    public string? LastMessagePreview { get; set; }
    public string? LastMessageSender { get; set; }
    public int MessageCount { get; set; }
    public int UnreadMessageCount { get; set; }
    public DateTime CreatedAt { get; set; }

    public string? ContactEmail =>
        !string.IsNullOrWhiteSpace(CustomerEmail) ? CustomerEmail :
        !string.IsNullOrWhiteSpace(Email) ? Email :
        !string.IsNullOrWhiteSpace(GuestEmail) ? GuestEmail : null;
}

public class ChatMessageDto
{
    public Guid Id { get; set; }
    public Guid SessionId { get; set; }
    public string SenderType { get; set; } = "";
    public string SenderName { get; set; } = "";
    public string Message { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}

public class SupportTicketDto
{
    public Guid Id { get; set; }
    public string TicketNumber { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Category { get; set; } = "";
    public string Subject { get; set; } = "";
    public string Message { get; set; } = "";
    public string Priority { get; set; } = "";
    public string Status { get; set; } = "";
    public string? Team { get; set; }
    public Guid? AssignedTo { get; set; }
    public string? AssignedToName { get; set; }
    public DateTime? FirstResponseAt { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<SupportTicketReplyDto> Replies { get; set; } = [];
    public int ReplyCount { get; set; }

    public int DisplayReplyCount =>
        Replies.Count > 0 ? Replies.Count : ReplyCount;

    public bool IsAssignedTo(string agentName) =>
        !string.IsNullOrWhiteSpace(AssignedToName) &&
        AssignedToName.Equals(agentName, StringComparison.OrdinalIgnoreCase);

    public int AgentReplyCount =>
        Replies.Count(r => r.IsAgent);
}

public class SupportTicketReplyDto
{
    public Guid Id { get; set; }
    public string SenderType { get; set; } = "agent";
    public string? SenderName { get; set; }
    public string Message { get; set; } = "";
    public DateTime? CreatedAt { get; set; }

    public bool IsAgent =>
        string.Equals(SenderType, "agent", StringComparison.OrdinalIgnoreCase);
}

public class UpdateTicketRequest
{
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? Team { get; set; }
    public Guid? AssignedTo { get; set; }
    public string? AssignedToName { get; set; }
}

public class TicketStatsDto
{
    public int OpenCount { get; set; }
    public int InProgressCount { get; set; }
    public int TotalCount { get; set; }
}

public class HelpArticleDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Category { get; set; } = "Orders";
    public string Status { get; set; } = HelpArticleDisplayStatus.Draft;
    public int ViewCount { get; set; }
    public int HelpfulCount { get; set; }
    public string Content { get; set; } = "";
    public string? HeroImageUrl { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public List<HelpArticleStepDto> Steps { get; set; } = [];
    public List<HelpArticleCommentDto> Comments { get; set; } = [];
    public int LikeCount { get; set; }
    public int DislikeCount { get; set; }
    public string? MyVote { get; set; }

    public int Views => ViewCount;
    public int Helpful => HelpfulCount > 0 ? HelpfulCount : LikeCount;

    public string LastUpdated =>
        UpdatedAt?.ToString("MMM d, yyyy", System.Globalization.CultureInfo.InvariantCulture) ?? "";
}

public class HelpArticleStepDto
{
    public Guid Id { get; set; }
    public int SortOrder { get; set; }
    public string Detail { get; set; } = "";
    public string? ImageUrl { get; set; }
}

public class HelpArticleCommentDto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string AuthorName { get; set; } = "";
    public string Body { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string Initials
    {
        get
        {
            var parts = AuthorName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length >= 2)
                return $"{parts[0][0]}{parts[^1][0]}".ToUpperInvariant();
            return parts.Length > 0
                ? parts[0][..Math.Min(2, parts[0].Length)].ToUpperInvariant()
                : "?";
        }
    }

    public string TimeAgo
    {
        get
        {
            var mins = Math.Max(0, (int)(DateTime.UtcNow - CreatedAt).TotalMinutes);
            if (mins < 60) return $"{mins}m ago";
            var hrs = mins / 60;
            if (hrs < 24) return $"{hrs}h ago";
            return $"{hrs / 24}d ago";
        }
    }
}

public class SaveHelpArticleRequest
{
    public string Title { get; set; } = "";
    public string Category { get; set; } = "Orders";
    public string Status { get; set; } = HelpArticleDisplayStatus.Draft;
    public string Content { get; set; } = "";
    public string? HeroImageUrl { get; set; }
    public List<HelpArticleStepDto> Steps { get; set; } = [];
}

public class HelpArticleEngagementDto
{
    public int LikeCount { get; set; }
    public int DislikeCount { get; set; }
    public string? MyVote { get; set; }
    public List<HelpArticleCommentDto> Comments { get; set; } = [];
}

public static class HelpArticleCategories
{
    public static readonly string[] All =
        ["Orders", "Shipping", "Returns", "Payments", "Account", "Product Info"];
}

public static class HelpArticleDisplayStatus
{
    public const string Draft = "Draft";
    public const string Published = "Published";

    public static string FromApi(string? status) =>
        string.Equals(status, "published", StringComparison.OrdinalIgnoreCase)
            ? Published
            : Draft;

    public static string ToApi(string? status) =>
        string.Equals(status, Published, StringComparison.OrdinalIgnoreCase)
            ? "published"
            : "draft";
}

public class AgentTokenDto
{
    public string AccessToken { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
}

public class SupportTenantDto
{
    public string TenantId { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string PublicKey { get; set; } = "";
    public string PublicHelpCenterUrl { get; set; } = "";
}

public class StaffMemberDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = "";
    public string? DisplayName { get; set; }
    public string Role { get; set; } = "";
    public bool Active { get; set; }
    public List<string> ProductSlugs { get; set; } = [];
}

public class TeamDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public string? Description { get; set; }
    public string? ProductSlug { get; set; }
    public bool Active { get; set; }
    public List<TeamMemberDto> Members { get; set; } = [];
}

public class TeamMemberDto
{
    public Guid StaffId { get; set; }
    public string Email { get; set; } = "";
    public string? DisplayName { get; set; }
    public string MemberRole { get; set; } = "member";
}

public class RotateEmbedKeyDto
{
    public string PublicKey { get; set; } = "";
    public string WidgetSnippet { get; set; } = "";
}
