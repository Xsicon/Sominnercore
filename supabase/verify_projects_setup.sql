-- Verification script to check if projects table exists and has correct structure

-- Check if table exists
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_name = 'projects';

-- Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- Check if we have any data
SELECT count(*) as project_count FROM projects;
SELECT count(*) as task_count FROM tasks;
SELECT count(*) as tag_count FROM task_tags;

-- Check RLS policies (if any)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('projects', 'tasks', 'task_tags');

