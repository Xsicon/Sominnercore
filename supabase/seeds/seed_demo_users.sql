-- Seed demo users and team members for the dashboard.
-- Run remotely with:
--   npx supabase db remote commit demo_seed_users --file supabase/seeds/seed_demo_users.sql

with new_users as (
    select *
    from (
        values
            ('admin@sominercore.com', 'admin123', 'admin', 'Admin User'),
            ('marketing@sominercore.com', 'marketing123', 'marketing_manager', 'Marketing Manager'),
            ('crs@sominercore.com', 'crs123', 'customer_relations_specialist', 'Customer Relations Specialist'),
            ('support@sominercore.com', 'support123', 'support_specialist', 'Support Specialist'),
            ('dev@sominercore.com', 'dev123', 'developer', 'Developer')
    ) as v(email, raw_password, role_name, full_name)
),
inserted_users as (
    insert into auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        aud,
        role,
        created_at,
        updated_at
    )
    select
        gen_random_uuid(),
        new_users.email,
        crypt(new_users.raw_password, gen_salt('bf')),
        timezone('utc', now()),
        jsonb_build_object('provider', 'email', 'providers', array['email']),
        jsonb_build_object('role', new_users.role_name),
        'authenticated',
        'authenticated',
        timezone('utc', now()),
        timezone('utc', now())
    from new_users
    where not exists (
        select 1
        from auth.users existing
        where lower(existing.email) = lower(new_users.email)
    )
    returning id, email
),
all_users as (
    select u.id, u.email, nu.role_name, nu.full_name
    from new_users nu
    join auth.users u on lower(u.email) = lower(nu.email)
),
insert_identities as (
    insert into auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    )
    select
        gen_random_uuid(),
        all_users.id,
        jsonb_build_object('sub', all_users.id::text, 'email', all_users.email),
        'email',
        all_users.email,
        timezone('utc', now()),
        timezone('utc', now()),
        timezone('utc', now())
    from all_users
    where not exists (
        select 1
        from auth.identities ai
        where ai.user_id = all_users.id
          and ai.provider = 'email'
    )
    returning user_id
)
insert into team_members (auth_user_id, role_id, display_name, email)
select
    all_users.id,
    roles.id,
    all_users.full_name,
    all_users.email
from all_users
join roles on roles.name = all_users.role_name
where not exists (
    select 1
    from team_members tm
    where tm.auth_user_id = all_users.id
);

