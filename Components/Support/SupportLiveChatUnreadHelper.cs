using KobNeti.Services.Support;

namespace KobNeti.Components.Support;

public static class SupportLiveChatUnreadHelper
{
    public static bool IsWaitingForAdmin(ChatSessionDto session) =>
        session.Status == "active"
        && session.LastMessageSender is "customer" or null;

    public static bool IsSessionRead(
        ChatSessionDto session,
        IReadOnlyDictionary<Guid, DateTime> readAtBySessionId)
    {
        if (!readAtBySessionId.TryGetValue(session.Id, out var readAt))
            return false;

        return ToUtc(session.LastActivity) <= ToUtc(readAt);
    }

    public static bool ShouldHighlightSidebarCount(
        ChatSessionDto session,
        IReadOnlyDictionary<Guid, DateTime> readAtBySessionId) =>
        IsWaitingForAdmin(session) && !IsSessionRead(session, readAtBySessionId);

    public static int GetSidebarMessageCount(
        ChatSessionDto session,
        IReadOnlyDictionary<Guid, DateTime> readAtBySessionId)
    {
        if (ShouldHighlightSidebarCount(session, readAtBySessionId))
            return Math.Max(session.UnreadMessageCount, 1);

        return session.MessageCount;
    }

    public static void MarkSessionRead(
        IDictionary<Guid, DateTime> readAtBySessionId,
        Guid sessionId,
        DateTime lastActivity)
    {
        var readAt = ToUtc(lastActivity);
        if (readAtBySessionId.TryGetValue(sessionId, out var existing)
            && ToUtc(existing) > readAt)
            readAt = ToUtc(existing);

        readAtBySessionId[sessionId] = readAt;
    }

    private static DateTime ToUtc(DateTime value) =>
        value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
        };
}
