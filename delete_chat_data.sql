-- Option 1: Delete only chat messages and sessions (keeps customer_contacts)
-- This is useful if you want to test with existing customer records
-- Order matters: delete messages first, then sessions

-- Delete all chat messages
DELETE FROM chat_messages;

-- Delete all chat sessions
DELETE FROM chat_sessions;

-- Option 2: Delete everything including customer contacts (complete reset)
-- Uncomment the line below if you want to delete customer contacts too
-- Note: This will cascade delete all related chat_sessions and chat_messages
-- DELETE FROM customer_contacts WHERE source = 'website_chat';

-- Verify deletion (optional - run these to check)
-- SELECT COUNT(*) as remaining_messages FROM chat_messages;
-- SELECT COUNT(*) as remaining_sessions FROM chat_sessions;
-- SELECT COUNT(*) as remaining_contacts FROM customer_contacts WHERE source = 'website_chat';

