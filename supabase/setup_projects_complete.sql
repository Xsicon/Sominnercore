-- Complete setup script for projects and tasks
-- This script will:
-- 1. Create the function
-- 2. Drop existing tables/types if they exist
-- 3. Create all tables with correct structure
-- 4. Insert seed data

-- ============================================
-- STEP 1: Ensure the set_updated_at function exists
-- ============================================
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$ language plpgsql;

-- ============================================
-- STEP 2: Drop existing tables if they exist (to avoid conflicts)
-- ============================================
drop table if exists task_tags cascade;
drop table if exists tasks cascade;
drop table if exists projects cascade;

-- Drop types if they exist (must drop before recreating)
drop type if exists task_status cascade;
drop type if exists task_priority cascade;

-- ============================================
-- STEP 3: Create task status enum
-- ============================================
create type task_status as enum ('To Do', 'In Progress', 'Done');
create type task_priority as enum ('low', 'medium', 'high');

-- ============================================
-- STEP 4: Create Projects table
-- ============================================
create table projects (
    id              bigint generated always as identity primary key,
    name            text not null,
    description     text,
    client          text,
    budget          decimal(18, 2),
    due_date        date,
    icon            text,
    icon_color      text,
    is_public       boolean not null default false,
    created_at      timestamptz not null default timezone('utc', now()),
    updated_at      timestamptz not null default timezone('utc', now())
);

-- ============================================
-- STEP 5: Create Tasks table
-- ============================================
create table tasks (
    id                  bigint generated always as identity primary key,
    project_id          bigint not null references projects (id) on delete cascade,
    title               text not null,
    status              task_status not null default 'To Do',
    priority            task_priority not null default 'medium',
    due_date            date,
    assigned_count      int not null default 0,
    comment_count       int not null default 0,
    total_subtasks      int not null default 0,
    completed_subtasks  int not null default 0,
    created_at          timestamptz not null default timezone('utc', now()),
    updated_at          timestamptz not null default timezone('utc', now())
);

-- ============================================
-- STEP 6: Create Task tags table
-- ============================================
create table task_tags (
    id      bigint generated always as identity primary key,
    task_id bigint not null references tasks (id) on delete cascade,
    tag     text not null,
    created_at timestamptz not null default timezone('utc', now()),
    constraint task_tags_unique unique (task_id, tag)
);

-- ============================================
-- STEP 7: Create triggers for updated_at
-- ============================================
create trigger set_projects_updated_at
before update on projects
for each row execute function set_updated_at();

create trigger set_tasks_updated_at
before update on tasks
for each row execute function set_updated_at();

-- ============================================
-- STEP 8: Create indexes
-- ============================================
create index if not exists tasks_project_id_idx on tasks (project_id);
create index if not exists tasks_status_idx on tasks (status);
create index if not exists task_tags_task_id_idx on task_tags (task_id);

-- ============================================
-- STEP 9: Insert Seed Data
-- ============================================

-- Insert Projects
insert into projects (name, description, client, budget, due_date, icon, icon_color, is_public)
values
    (
        'E-commerce Platform',
        'Full-stack e-commerce solution with modern UI/UX',
        'TechCorp',
        50000.00,
        '2024-03-30',
        'shopping_cart',
        'blue',
        true
    ),
    (
        'Mobile App Redesign',
        'Modern redesign of mobile application',
        'StartupCo',
        30000.00,
        '2024-04-15',
        'phone_android',
        'purple',
        true
    );

-- Insert Tasks for E-commerce Platform
insert into tasks (project_id, title, status, priority, due_date, assigned_count, comment_count, total_subtasks, completed_subtasks)
select 
    p.id,
    task_data.title,
    task_data.status::task_status,
    task_data.priority::task_priority,
    task_data.due_date,
    task_data.assigned_count,
    task_data.comment_count,
    task_data.total_subtasks,
    task_data.completed_subtasks
from projects p
cross join (values
    ('E-commerce Platform', 'Setup project infrastructure', 'Done', 'high', '2024-02-20'::date, 2, 1, 3, 3),
    ('E-commerce Platform', 'Design product catalog UI', 'In Progress', 'high', '2024-02-25'::date, 1, 0, 3, 1),
    ('E-commerce Platform', 'Implement shopping cart', 'To Do', 'medium', '2024-03-01'::date, 1, 0, 0, 0)
) as task_data(project_name, title, status, priority, due_date, assigned_count, comment_count, total_subtasks, completed_subtasks)
where p.name = task_data.project_name;

-- Insert Tasks for Mobile App Redesign
insert into tasks (project_id, title, status, priority, due_date, assigned_count, comment_count, total_subtasks, completed_subtasks)
select 
    p.id,
    task_data.title,
    task_data.status::task_status,
    task_data.priority::task_priority,
    task_data.due_date,
    task_data.assigned_count,
    task_data.comment_count,
    task_data.total_subtasks,
    task_data.completed_subtasks
from projects p
cross join (values
    ('Mobile App Redesign', 'Create wireframes', 'In Progress', 'high', '2024-03-10'::date, 1, 2, 5, 2),
    ('Mobile App Redesign', 'Develop prototype', 'To Do', 'medium', '2024-03-20'::date, 2, 0, 0, 0)
) as task_data(project_name, title, status, priority, due_date, assigned_count, comment_count, total_subtasks, completed_subtasks)
where p.name = task_data.project_name;

-- Insert Task Tags for E-commerce Platform tasks
insert into task_tags (task_id, tag)
select t.id, unnest(array['Backend', 'Frontend'])
from tasks t
join projects p on t.project_id = p.id
where p.name = 'E-commerce Platform' and t.title = 'Setup project infrastructure';

insert into task_tags (task_id, tag)
select t.id, unnest(array['Design', 'Frontend'])
from tasks t
join projects p on t.project_id = p.id
where p.name = 'E-commerce Platform' and t.title = 'Design product catalog UI';

insert into task_tags (task_id, tag)
select t.id, unnest(array['Frontend', 'Feature'])
from tasks t
join projects p on t.project_id = p.id
where p.name = 'E-commerce Platform' and t.title = 'Implement shopping cart';

-- Insert Task Tags for Mobile App Redesign tasks
insert into task_tags (task_id, tag)
select t.id, unnest(array['Design', 'UI'])
from tasks t
join projects p on t.project_id = p.id
where p.name = 'Mobile App Redesign' and t.title = 'Create wireframes';

insert into task_tags (task_id, tag)
select t.id, unnest(array['Development'])
from tasks t
join projects p on t.project_id = p.id
where p.name = 'Mobile App Redesign' and t.title = 'Develop prototype';

-- ============================================
-- STEP 10: Grant Permissions for PostgREST API Access
-- ============================================
-- Grant usage on schema
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

-- ============================================
-- STEP 11: Enable Row Level Security and Create Policies
-- ============================================
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (allow all for now - adjust based on your security needs)
DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;
CREATE POLICY "Allow all operations on projects" ON projects
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
CREATE POLICY "Allow all operations on tasks" ON tasks
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on task_tags" ON task_tags;
CREATE POLICY "Allow all operations on task_tags" ON task_tags
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Verification
-- ============================================
select 'Setup complete! Projects created: ' || count(*)::text as status from projects;
select 'Tasks created: ' || count(*)::text as status from tasks;
select 'Tags created: ' || count(*)::text as status from task_tags;

