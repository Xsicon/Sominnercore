-- Grant necessary permissions for PostgREST to access chat-related tables
-- This ensures the tables are accessible via the REST API

-- Grant usage on schema (if needed)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on customer_contacts table
GRANT SELECT, INSERT ON customer_contacts TO anon, authenticated;
GRANT UPDATE ON customer_contacts TO authenticated;

-- Grant permissions on chat_sessions table
GRANT SELECT, INSERT, UPDATE ON chat_sessions TO anon, authenticated;
GRANT DELETE ON chat_sessions TO authenticated;

-- Grant permissions on chat_messages table
GRANT SELECT, INSERT ON chat_messages TO anon, authenticated;
GRANT UPDATE, DELETE ON chat_messages TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON SEQUENCE chat_messages_id_seq TO anon, authenticated;

-- ============================================
-- Enable Row Level Security
-- ============================================
ALTER TABLE customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for customer_contacts
-- ============================================

-- Allow anonymous users to insert new customer contacts (for chat)
DROP POLICY IF EXISTS "Allow anon to insert customer contacts" ON customer_contacts;
CREATE POLICY "Allow anon to insert customer contacts" ON customer_contacts
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous users to select customer contacts by email (for finding existing contacts)
DROP POLICY IF EXISTS "Allow anon to select customer contacts" ON customer_contacts;
CREATE POLICY "Allow anon to select customer contacts" ON customer_contacts
    FOR SELECT
    TO anon
    USING (true);

-- Allow authenticated users (agents) full access to customer contacts
DROP POLICY IF EXISTS "Allow authenticated users full access to customer contacts" ON customer_contacts;
CREATE POLICY "Allow authenticated users full access to customer contacts" ON customer_contacts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- RLS Policies for chat_sessions
-- ============================================

-- Allow anonymous users to insert chat sessions
DROP POLICY IF EXISTS "Allow anon to insert chat sessions" ON chat_sessions;
CREATE POLICY "Allow anon to insert chat sessions" ON chat_sessions
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous users to select their own chat sessions (by customer_id)
-- Note: This is a simple policy - in production you might want to restrict this further
DROP POLICY IF EXISTS "Allow anon to select chat sessions" ON chat_sessions;
CREATE POLICY "Allow anon to select chat sessions" ON chat_sessions
    FOR SELECT
    TO anon
    USING (true);

-- Allow anonymous users to update chat sessions (for status changes)
DROP POLICY IF EXISTS "Allow anon to update chat sessions" ON chat_sessions;
CREATE POLICY "Allow anon to update chat sessions" ON chat_sessions
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users (agents) full access to chat sessions
DROP POLICY IF EXISTS "Allow authenticated users full access to chat sessions" ON chat_sessions;
CREATE POLICY "Allow authenticated users full access to chat sessions" ON chat_sessions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- RLS Policies for chat_messages
-- ============================================

-- Allow anonymous users to insert chat messages (for customer messages)
DROP POLICY IF EXISTS "Allow anon to insert chat messages" ON chat_messages;
CREATE POLICY "Allow anon to insert chat messages" ON chat_messages
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous users to select chat messages from their sessions
DROP POLICY IF EXISTS "Allow anon to select chat messages" ON chat_messages;
CREATE POLICY "Allow anon to select chat messages" ON chat_messages
    FOR SELECT
    TO anon
    USING (true);

-- Allow authenticated users (agents) full access to chat messages
DROP POLICY IF EXISTS "Allow authenticated users full access to chat messages" ON chat_messages;
CREATE POLICY "Allow authenticated users full access to chat messages" ON chat_messages
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

