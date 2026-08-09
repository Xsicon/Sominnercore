-- Sominnercore RLS policies (schema: sominnercore)
-- Apply in the Supabase SQL editor.
--
-- Admin users must have app_metadata.role = 'admin', e.g.:
--   update auth.users
--   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
--   where email = 'you@example.com';

create schema if not exists sominnercore;

grant usage on schema sominnercore to anon, authenticated, service_role;

grant select on all tables in schema sominnercore to anon, authenticated;
grant insert, update, delete on all tables in schema sominnercore to authenticated;
grant all on all tables in schema sominnercore to service_role;
grant usage, select on all sequences in schema sominnercore to anon, authenticated, service_role;

alter table if exists sominnercore.softwares enable row level security;
alter table if exists sominnercore.page_contents enable row level security;

create or replace function sominnercore.is_admin()
returns boolean
language sql
stable
security definer
set search_path = sominnercore, public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  )
  or coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'is_admin') in ('true', '1'),
    false
  );
$$;

grant execute on function sominnercore.is_admin() to anon, authenticated;

create or replace function sominnercore.is_released(p_release_date text)
returns boolean
language sql
stable
as $$
  select
    p_release_date is null
    or btrim(p_release_date) = ''
    or (
      p_release_date ~ '^\d{4}-\d{2}-\d{2}'
      and p_release_date::timestamptz <= timezone('utc', now())
    );
$$;

grant execute on function sominnercore.is_released(text) to anon, authenticated;

drop policy if exists softwares_public_read on sominnercore.softwares;
create policy softwares_public_read
on sominnercore.softwares
for select
to anon, authenticated
using (
  visibility = 'public'
  and status <> 'deprecated'
  and sominnercore.is_released(release_date::text)
);

drop policy if exists softwares_admin_select on sominnercore.softwares;
create policy softwares_admin_select
on sominnercore.softwares
for select
to authenticated
using (sominnercore.is_admin());

drop policy if exists softwares_admin_insert on sominnercore.softwares;
create policy softwares_admin_insert
on sominnercore.softwares
for insert
to authenticated
with check (sominnercore.is_admin());

drop policy if exists softwares_admin_update on sominnercore.softwares;
create policy softwares_admin_update
on sominnercore.softwares
for update
to authenticated
using (sominnercore.is_admin())
with check (sominnercore.is_admin());

drop policy if exists softwares_admin_delete on sominnercore.softwares;
create policy softwares_admin_delete
on sominnercore.softwares
for delete
to authenticated
using (sominnercore.is_admin());

drop policy if exists page_contents_public_read on sominnercore.page_contents;
create policy page_contents_public_read
on sominnercore.page_contents
for select
to anon, authenticated
using (true);

drop policy if exists page_contents_admin_insert on sominnercore.page_contents;
create policy page_contents_admin_insert
on sominnercore.page_contents
for insert
to authenticated
with check (sominnercore.is_admin());

drop policy if exists page_contents_admin_update on sominnercore.page_contents;
create policy page_contents_admin_update
on sominnercore.page_contents
for update
to authenticated
using (sominnercore.is_admin())
with check (sominnercore.is_admin());

drop policy if exists page_contents_admin_delete on sominnercore.page_contents;
create policy page_contents_admin_delete
on sominnercore.page_contents
for delete
to authenticated
using (sominnercore.is_admin());
