-- Check if projects table exists and what columns it has
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- If the table exists but has wrong structure, you can see it here
-- If no rows are returned, the table doesn't exist


