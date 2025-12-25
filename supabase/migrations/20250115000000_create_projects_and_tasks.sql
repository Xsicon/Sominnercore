-- Ensure the set_updated_at function exists (in case init_schema hasn't been run)
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$ language plpgsql;

-- Drop existing tables if they exist (to avoid conflicts)
drop table if exists task_tags cascade;
drop table if exists tasks cascade;
drop table if exists projects cascade;

-- Drop types if they exist (must drop before recreating)
drop type if exists task_status cascade;
drop type if exists task_priority cascade;

-- Create task status enum
create type task_status as enum ('To Do', 'In Progress', 'Done');
create type task_priority as enum ('low', 'medium', 'high');

-- Projects table
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

-- Tasks table
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

-- Task tags table (many-to-many relationship)
create table task_tags (
    id      bigint generated always as identity primary key,
    task_id bigint not null references tasks (id) on delete cascade,
    tag     text not null,
    created_at timestamptz not null default timezone('utc', now()),
    constraint task_tags_unique unique (task_id, tag)
);

-- Create triggers for updated_at
create trigger set_projects_updated_at
before update on projects
for each row execute function set_updated_at();

create trigger set_tasks_updated_at
before update on tasks
for each row execute function set_updated_at();

-- Create indexes
create index if not exists tasks_project_id_idx on tasks (project_id);
create index if not exists tasks_status_idx on tasks (status);
create index if not exists task_tags_task_id_idx on task_tags (task_id);

