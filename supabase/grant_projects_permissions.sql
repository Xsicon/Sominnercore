-- Grant necessary permissions for PostgREST to access the tables
-- This ensures the tables are accessible via the REST API

-- Grant usage on schema (if needed)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on projects table
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE projects_id_seq TO anon, authenticated;

-- Grant permissions on tasks table
GRANT SELECT, INSERT, UPDATE, DELETE ON tasks TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO anon, authenticated;

-- Grant permissions on task_tags table
GRANT SELECT, INSERT, UPDATE, DELETE ON task_tags TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE task_tags_id_seq TO anon, authenticated;

-- Note: If you're using Row Level Security (RLS), you may need to create policies
-- For now, we'll disable RLS or create permissive policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (allow all for now - adjust based on your security needs)
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;
DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
DROP POLICY IF EXISTS "Allow all operations on task_tags" ON task_tags;

CREATE POLICY "Allow all operations on projects" ON projects
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations on tasks" ON tasks
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations on task_tags" ON task_tags
    FOR ALL
    USING (true)
    WITH CHECK (true);

