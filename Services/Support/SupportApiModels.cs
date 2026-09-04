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

public class ChatStickyNoteDto
{
    public Guid SessionId { get; set; }
    public string AgentName { get; set; } = "";
    public string ReasonForContact { get; set; } = "";
    public List<string> KeyActionsTaken { get; set; } = [];
    public string ColorHex { get; set; } = "#F29D68";
    public bool Pinned { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class SaveChatStickyNoteRequest
{
    public string? AgentName { get; set; }
    public string? ReasonForContact { get; set; }
    public List<string>? KeyActionsTaken { get; set; }
    public string? ColorHex { get; set; }
    public bool Pinned { get; set; }
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
    public string? PageUrl { get; set; }
    public string? AccountId { get; set; }
    public Guid? ChatSessionId { get; set; }
    public List<string> Tags { get; set; } = [];
    public int? SlaFirstResponseMinutes { get; set; }
    public DateTime? FirstResponseDueAt { get; set; }
    public DateTime? ResolveDueAt { get; set; }
    public Guid? EngTaskId { get; set; }
    public List<TicketEventDto> Timeline { get; set; } = [];
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
    public List<string>? Tags { get; set; }
    public Guid? EngTaskId { get; set; }
}

public class TicketEventDto
{
    public Guid Id { get; set; }
    public string EventType { get; set; } = "";
    public string? ActorName { get; set; }
    public string? Detail { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class SupportMacroDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public string? Category { get; set; }
}

public class TicketStatsDto
{
    public int OpenCount { get; set; }
    public int InProgressCount { get; set; }
    public int WaitingCount { get; set; }
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

public class ProductRegistryDto
{
    public Guid Id { get; set; }
    public string TenantId { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string ProductType { get; set; } = "";
    public string Status { get; set; } = "";
    public string SupportTier { get; set; } = "";
    public string PublicKey { get; set; } = "";
    public string PublicHelpCenterUrl { get; set; } = "";
    public string? UpstreamApiBaseUrl { get; set; }
    public string? GithubRepoUrl { get; set; }
    public List<ProductRepoDto> LinkedRepos { get; set; } = [];
    public bool Enabled { get; set; }
}

public class ProductRepoDto
{
    public Guid Id { get; set; }
    public string RepoKind { get; set; } = "web_app";
    public string Title { get; set; } = "";
    public string GithubRepoUrl { get; set; } = "";
}

public class ProductUpstreamStatusDto
{
    public bool Configured { get; set; }
    public bool Reachable { get; set; }
    public string Message { get; set; } = "";
    public string? UpstreamApiBaseUrl { get; set; }
}

public class UpdateProductUpstreamRequest
{
    public string? UpstreamApiBaseUrl { get; set; }
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

public class IncidentDto
{
    public Guid Id { get; set; }
    public string IncidentNumber { get; set; } = "";
    public string Title { get; set; } = "";
    public string Severity { get; set; } = "sev3";
    public string Status { get; set; } = "open";
    public string? CommanderName { get; set; }
    public Guid? CommanderUserId { get; set; }
    public Guid? SourceTicketId { get; set; }
    public Guid? SourceChatSessionId { get; set; }
    public string? PostmortemNotes { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public List<IncidentEventDto> Timeline { get; set; } = [];
}

public class IncidentEventDto
{
    public Guid Id { get; set; }
    public string EventType { get; set; } = "";
    public string? ActorName { get; set; }
    public string? Detail { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class EscalateTicketRequest
{
    public string? Title { get; set; }
    public string Severity { get; set; } = "sev2";
    public string? CommanderName { get; set; }
}

public class EscalateChatRequest
{
    public string Target { get; set; } = "engineering";
    public string Severity { get; set; } = "High";
    public string Reason { get; set; } = "";
    public Guid? AssigneeUserId { get; set; }
    public string? AssigneeName { get; set; }
}

public class UpdateIncidentRequest
{
    public string? Status { get; set; }
    public string? Severity { get; set; }
    public string? CommanderName { get; set; }
    public string? PostmortemNotes { get; set; }
}

public class EngTaskDto
{
    public Guid Id { get; set; }
    public string TaskNumber { get; set; } = "";
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string TaskType { get; set; } = "feature";
    public string Status { get; set; } = "backlog";
    public string Priority { get; set; } = "medium";
    public decimal? EstimatePoints { get; set; }
    public string? AssigneeName { get; set; }
    public Guid? TicketId { get; set; }
    public Guid? MilestoneId { get; set; }
    public string? GithubPrUrl { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateEngTaskRequest
{
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string TaskType { get; set; } = "feature";
    public string Status { get; set; } = "backlog";
    public string Priority { get; set; } = "medium";
    public decimal? EstimatePoints { get; set; }
    public string? AssigneeName { get; set; }
    public Guid? TicketId { get; set; }
    public Guid? MilestoneId { get; set; }
    public string? GithubPrUrl { get; set; }
}

public class UpdateEngTaskRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? TaskType { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public decimal? EstimatePoints { get; set; }
    public string? AssigneeName { get; set; }
    public Guid? TicketId { get; set; }
    public bool ClearTicketId { get; set; }
    public Guid? MilestoneId { get; set; }
    public bool ClearMilestoneId { get; set; }
    public string? GithubPrUrl { get; set; }
    public bool ClearGithubPrUrl { get; set; }
}

public class MilestoneDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string Status { get; set; } = "planned";
    public DateOnly? TargetDate { get; set; }
    public DateOnly? StartDate { get; set; }
    public int SortOrder { get; set; }
    public Guid? CalendarEventId { get; set; }
    public int TaskCount { get; set; }
}

public class CreateMilestoneRequest
{
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string Status { get; set; } = "planned";
    public DateOnly? TargetDate { get; set; }
    public DateOnly? StartDate { get; set; }
    public int SortOrder { get; set; }
}

public class CalendarEventDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string EventType { get; set; } = "milestone";
    public DateTime StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }
    public string? SourceEntityType { get; set; }
    public Guid? SourceEntityId { get; set; }
}

public class GithubCacheDto
{
    public string? RepoKey { get; set; }
    public string? RepoTitle { get; set; }
    public string? RepoUrl { get; set; }
    public DateTime? PullsFetchedAt { get; set; }
    public DateTime? CommitsFetchedAt { get; set; }
    public List<GithubPullDto> Pulls { get; set; } = [];
    public List<GithubCommitDto> Commits { get; set; } = [];
    public List<ProductRepoDto> LinkedRepos { get; set; } = [];
    public string? Message { get; set; }
}

public class GithubPullDto
{
    public int Number { get; set; }
    public string Title { get; set; } = "";
    public string State { get; set; } = "";
    public string HtmlUrl { get; set; } = "";
    public string? Author { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class GithubCommitDto
{
    public string Sha { get; set; } = "";
    public string Message { get; set; } = "";
    public string HtmlUrl { get; set; } = "";
    public string? Author { get; set; }
    public DateTime? Date { get; set; }
}

public class TimeEntryDto
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public string UserName { get; set; } = "";
    public string EntryType { get; set; } = "manual";
    public DateTime? ClockIn { get; set; }
    public DateTime? ClockOut { get; set; }
    public int? Minutes { get; set; }
    public Guid? TicketId { get; set; }
    public Guid? EngTaskId { get; set; }
    public string? Notes { get; set; }
    public string Status { get; set; } = "approved";
    public Guid? SupersedesId { get; set; }
    public Guid? ApprovalId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ApprovalRequestDto
{
    public Guid Id { get; set; }
    public string RequestType { get; set; } = "";
    public string Status { get; set; } = "pending";
    public string PayloadJson { get; set; } = "{}";
    public string? RequesterName { get; set; }
    public string? ApproverName { get; set; }
    public DateTime? DecidedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class PayRateDto
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public string? Role { get; set; }
    public decimal HourlyRate { get; set; }
    public string Currency { get; set; } = "USD";
    public DateOnly EffectiveFrom { get; set; }
}

public class PayPeriodDto
{
    public Guid Id { get; set; }
    public string Label { get; set; } = "";
    public DateOnly StartsOn { get; set; }
    public DateOnly EndsOn { get; set; }
    public string Status { get; set; } = "open";
    public int TotalMinutes { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public List<PayPeriodLineDto> Lines { get; set; } = [];
    public Guid? ApprovalId { get; set; }
}

public class PayPeriodLineDto
{
    public Guid? UserId { get; set; }
    public string UserName { get; set; } = "";
    public int Minutes { get; set; }
    public decimal HourlyRate { get; set; }
    public decimal Amount { get; set; }
}

public class AuditEventDto
{
    public Guid Id { get; set; }
    public string? ActorName { get; set; }
    public string Action { get; set; } = "";
    public string EntityType { get; set; } = "";
    public string? EntityId { get; set; }
    public string? BeforeJson { get; set; }
    public string? AfterJson { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class NotificationDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string? Body { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}

public class NotificationPrefsDto
{
    public bool AssignEnabled { get; set; } = true;
    public bool ApprovalEnabled { get; set; } = true;
    public bool EscalationEnabled { get; set; } = true;
    public bool ReminderEnabled { get; set; } = true;
}

public class OpsFileDto
{
    public Guid Id { get; set; }
    public string FolderPath { get; set; } = "/";
    public string FileName { get; set; } = "";
    public string? ContentType { get; set; }
    public long? SizeBytes { get; set; }
    public string StoragePath { get; set; } = "";
    public string? PublicUrl { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class IntegrationDto
{
    public Guid Id { get; set; }
    public string Provider { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string Status { get; set; } = "disconnected";
    public bool HasSecrets { get; set; }
}

public class OverviewDto
{
    public string TenantId { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public int ActiveChats { get; set; }
    public int OpenTickets { get; set; }
    public int OpenIncidents { get; set; }
    public int EngTasksInProgress { get; set; }
    public int PendingApprovals { get; set; }
    public int UnreadNotifications { get; set; }
}

public class CrossProductOverviewDto
{
    public List<OverviewDto> Products { get; set; } = [];
    public int TotalOpenTickets { get; set; }
    public int TotalActiveChats { get; set; }
    public int TotalOpenIncidents { get; set; }
    public int TotalPendingApprovals { get; set; }
}

public class ReportRunDto
{
    public Guid Id { get; set; }
    public string ReportType { get; set; } = "";
    public string Label { get; set; } = "";
    public int RowCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CreatedByName { get; set; }
}

public class PlatformHelpArticleDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = "";
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public string Category { get; set; } = "general";
    public string Status { get; set; } = "published";
    public int SortOrder { get; set; }
}

public class SavePlatformHelpRequest
{
    public string Slug { get; set; } = "";
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public string Category { get; set; } = "general";
    public string Status { get; set; } = "published";
    public int SortOrder { get; set; }
}

public static class PlatformHelpCategories
{
    public static readonly string[] All =
    [
        "getting-started", "support", "engineering", "people", "platform", "general"
    ];
}

public class ImChannelDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string ChannelType { get; set; } = "channel";
    public DateTime CreatedAt { get; set; }
}

public class ImMessageDto
{
    public Guid Id { get; set; }
    public Guid ChannelId { get; set; }
    public Guid? SenderUserId { get; set; }
    public string SenderName { get; set; } = "";
    public string Body { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class AssetDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string AssetType { get; set; } = "hardware";
    public string? SerialOrKey { get; set; }
    public string Status { get; set; } = "available";
    public Guid? AssignedUserId { get; set; }
    public string? AssignedUserName { get; set; }
    public DateOnly? RenewalDate { get; set; }
    public string? Notes { get; set; }
}

