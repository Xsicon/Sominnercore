-- Seed data for projects and tasks
-- Run this file after running the migration: 20250115000000_create_projects_and_tasks.sql
-- This will populate the database with sample project and task data

-- Insert Projects (using CTE to get IDs)
with inserted_projects as (
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
        )
    on conflict do nothing
    returning id, name
)
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
from inserted_projects p
cross join (values
    ('E-commerce Platform', 'Setup project infrastructure', 'Done', 'high', '2024-02-20'::date, 2, 1, 3, 3),
    ('E-commerce Platform', 'Design product catalog UI', 'In Progress', 'high', '2024-02-25'::date, 1, 0, 3, 1),
    ('E-commerce Platform', 'Implement shopping cart', 'To Do', 'medium', '2024-03-01'::date, 1, 0, 0, 0)
) as task_data(project_name, title, status, priority, due_date, assigned_count, comment_count, total_subtasks, completed_subtasks)
where p.name = task_data.project_name
on conflict do nothing;

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
where p.name = task_data.project_name
on conflict do nothing;

-- Insert Task Tags for E-commerce Platform tasks
insert into task_tags (task_id, tag)
select t.id, unnest(array['Backend', 'Frontend'])
from tasks t
join projects p on t.project_id = p.id
where p.name = 'E-commerce Platform' and t.title = 'Setup project infrastructure'
on conflict do nothing;

insert into task_tags (task_id, tag)
select t.id, unnest(array['Design', 'Frontend'])
from tasks t
join projects p on t.project_id = p.id
where p.name = 'E-commerce Platform' and t.title = 'Design product catalog UI'
on conflict do nothing;

insert into task_tags (task_id, tag)
select t.id, unnest(array['Frontend', 'Feature'])
from tasks t
join projects p on t.project_id = p.id
where p.name = 'E-commerce Platform' and t.title = 'Implement shopping cart'
on conflict do nothing;

-- Insert Task Tags for Mobile App Redesign tasks
insert into task_tags (task_id, tag)
select t.id, unnest(array['Design', 'UI'])
from tasks t
join projects p on t.project_id = p.id
where p.name = 'Mobile App Redesign' and t.title = 'Create wireframes'
on conflict do nothing;

insert into task_tags (task_id, tag)
select t.id, unnest(array['Development'])
from tasks t
join projects p on t.project_id = p.id
where p.name = 'Mobile App Redesign' and t.title = 'Develop prototype'
on conflict do nothing;

