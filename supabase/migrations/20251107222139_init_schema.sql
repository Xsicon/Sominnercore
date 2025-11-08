-- Enable useful extensions
create extension if not exists "pgcrypto";

-- Trigger helper
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$ language plpgsql;

-- Enumerations
create type submission_status as enum ('new', 'in_progress', 'resolved', 'closed');
create type chat_session_status as enum ('active', 'waiting', 'resolved', 'closed');
create type chat_sender_type as enum ('customer', 'agent', 'system');
create type notification_type as enum (
    'submission_assigned',
    'submission_updated',
    'chat_assigned',
    'chat_message',
    'system_alert'
);

-- Roles and permissions
create table if not exists roles (
    id            bigint generated always as identity primary key,
    name          text not null unique,
    description   text,
    level         int not null,
    created_at    timestamptz not null default timezone('utc', now())
);

insert into roles (name, description, level)
values
    ('admin', 'Full access to manage the system', 100),
    ('marketing_manager', 'Manages marketing-related inquiries', 80),
    ('customer_relations_specialist', 'Handles customer submissions and follow-ups', 70),
    ('support_specialist', 'Provides technical support to customers', 60),
    ('developer', 'Handles technical escalations and maintenance', 50)
on conflict (name) do nothing;

create table if not exists permissions (
    id          bigint generated always as identity primary key,
    code        text not null unique,
    label       text not null,
    description text,
    created_at  timestamptz not null default timezone('utc', now())
);

create table if not exists role_permissions (
    role_id       bigint references roles (id) on delete cascade,
    permission_id bigint references permissions (id) on delete cascade,
    constraint role_permissions_pkey primary key (role_id, permission_id)
);

-- Team members (links to Supabase auth.users)
create table if not exists team_members (
    id                uuid primary key default gen_random_uuid(),
    auth_user_id      uuid not null unique references auth.users (id) on delete cascade,
    role_id           bigint not null references roles (id),
    display_name      text not null,
    email             text not null unique,
    status            text not null default 'active',
    avatar_url        text,
    timezone          text,
    created_at        timestamptz not null default timezone('utc', now()),
    updated_at        timestamptz not null default timezone('utc', now())
);

create trigger set_team_members_updated_at
before update on team_members
for each row execute function set_updated_at();

-- Customers & submissions
create table if not exists customer_contacts (
    id            uuid primary key default gen_random_uuid(),
    full_name     text not null,
    email         text not null,
    phone         text,
    company       text,
    source        text,
    notes         text,
    created_at    timestamptz not null default timezone('utc', now()),
    updated_at    timestamptz not null default timezone('utc', now())
);

create trigger set_customer_contacts_updated_at
before update on customer_contacts
for each row execute function set_updated_at();

create table if not exists submissions (
    id              uuid primary key default gen_random_uuid(),
    customer_id     uuid not null references customer_contacts (id) on delete cascade,
    subject         text not null,
    description     text,
    source          text,
    status          submission_status not null default 'new',
    priority        text,
    assigned_to     uuid references team_members (id),
    created_by      uuid references team_members (id),
    created_at      timestamptz not null default timezone('utc', now()),
    updated_at      timestamptz not null default timezone('utc', now()),
    resolved_at     timestamptz
);

create trigger set_submissions_updated_at
before update on submissions
for each row execute function set_updated_at();

create table if not exists submission_activity (
    id             bigint generated always as identity primary key,
    submission_id  uuid not null references submissions (id) on delete cascade,
    actor_id       uuid references team_members (id),
    action         text not null,
    notes          text,
    metadata       jsonb,
    created_at     timestamptz not null default timezone('utc', now())
);

-- Chat
create table if not exists chat_sessions (
    id              uuid primary key default gen_random_uuid(),
    customer_id     uuid not null references customer_contacts (id) on delete cascade,
    submission_id   uuid references submissions (id),
    status          chat_session_status not null default 'waiting',
    assigned_to     uuid references team_members (id),
    started_at      timestamptz not null default timezone('utc', now()),
    closed_at       timestamptz,
    metadata        jsonb
);

create table if not exists chat_messages (
    id              bigint generated always as identity primary key,
    session_id      uuid not null references chat_sessions (id) on delete cascade,
    sender_type     chat_sender_type not null,
    sender_id       uuid,
    message         text not null,
    attachments     jsonb,
    created_at      timestamptz not null default timezone('utc', now()),
    read_at         timestamptz
);

create index if not exists chat_messages_session_id_idx on chat_messages (session_id, created_at);
create index if not exists chat_sessions_status_idx on chat_sessions (status);

create table if not exists agent_presence (
    agent_id     uuid primary key references team_members (id) on delete cascade,
    status       text not null default 'offline',
    last_seen_at timestamptz not null default timezone('utc', now()),
    metadata     jsonb
);

-- Metrics & notifications
create table if not exists team_stats_daily (
    stat_date              date not null,
    agent_id               uuid not null references team_members (id) on delete cascade,
    handled_submissions    int not null default 0,
    handled_chats          int not null default 0,
    avg_first_response_sec int,
    avg_resolution_sec     int,
    created_at             timestamptz not null default timezone('utc', now()),
    constraint team_stats_daily_pkey primary key (stat_date, agent_id)
);

create table if not exists notifications (
    id            bigint generated always as identity primary key,
    recipient_id  uuid not null references team_members (id) on delete cascade,
    type          notification_type not null,
    payload       jsonb not null,
    read_at       timestamptz,
    created_at    timestamptz not null default timezone('utc', now())
);

create index if not exists notifications_recipient_idx on notifications (recipient_id, created_at desc);

create table if not exists audit_log (
    id            bigint generated always as identity primary key,
    actor_id      uuid references team_members (id),
    entity        text not null,
    entity_id     text not null,
    action        text not null,
    diff          jsonb,
    metadata      jsonb,
    created_at    timestamptz not null default timezone('utc', now())
);

create index if not exists audit_log_entity_idx on audit_log (entity, entity_id);
create index if not exists audit_log_actor_idx on audit_log (actor_id, created_at);

-- Placeholder permissions seed
insert into permissions (code, label, description)
values
    ('manage_roles', 'Manage roles', 'Create and update role definitions'),
    ('manage_team', 'Manage team members', 'Invite or disable team members'),
    ('view_submissions', 'View submissions', 'Access customer submissions'),
    ('update_submissions', 'Update submissions', 'Modify submission status and metadata'),
    ('manage_chats', 'Manage chats', 'Respond to and close chat sessions'),
    ('view_reports', 'View reports', 'Access analytics dashboards')
on conflict (code) do nothing;

-- Map default role permissions
insert into role_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on (
    (r.name = 'admin')
    or (r.name = 'marketing_manager' and p.code in ('view_submissions', 'update_submissions', 'view_reports'))
    or (r.name = 'customer_relations_specialist' and p.code in ('view_submissions', 'update_submissions', 'manage_chats'))
    or (r.name = 'support_specialist' and p.code in ('view_submissions', 'update_submissions', 'manage_chats'))
    or (r.name = 'developer' and p.code in ('view_submissions', 'manage_chats', 'view_reports'))
)
on conflict do nothing;

-- TODO: Add RLS policies after confirming application access patterns.


