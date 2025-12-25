-- ROLLBACK SCRIPT: Undoes all projects and tasks changes
-- Run this on the WRONG Supabase project to clean up

-- ============================================
-- STEP 1: Drop RLS Policies
-- ============================================
DROP POLICY IF EXISTS "Allow all operations on task_tags" ON task_tags;
DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;

-- ============================================
-- STEP 2: Disable RLS (optional, but clean)
-- ============================================
ALTER TABLE IF EXISTS task_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Revoke Permissions
-- ============================================
REVOKE ALL ON task_tags FROM anon, authenticated;
REVOKE ALL ON tasks FROM anon, authenticated;
REVOKE ALL ON projects FROM anon, authenticated;

REVOKE USAGE, SELECT ON SEQUENCE task_tags_id_seq FROM anon, authenticated;
REVOKE USAGE, SELECT ON SEQUENCE tasks_id_seq FROM anon, authenticated;
REVOKE USAGE, SELECT ON SEQUENCE projects_id_seq FROM anon, authenticated;

-- ============================================
-- STEP 4: Drop Tables (CASCADE will handle dependencies)
-- ============================================
DROP TABLE IF EXISTS task_tags CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- ============================================
-- STEP 5: Drop Types/Enums
-- ============================================
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;

-- ============================================
-- STEP 6: Drop Function (only if it was created by our migration)
-- ============================================
-- Note: Only drop set_updated_at if it was created by our migration
-- If it exists from init_schema, leave it alone
-- Uncomment the next line ONLY if you're sure it was created by our migration:
-- DROP FUNCTION IF EXISTS set_updated_at() CASCADE;

-- ============================================
-- Verification
-- ============================================
SELECT 'Rollback complete! Check that tables are gone:' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('projects', 'tasks', 'task_tags')
AND table_schema = 'public';


