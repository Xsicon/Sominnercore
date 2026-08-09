-- Fix PGRST106 when the dashboard shows a schema as exposed,
-- but the API still rejects it (stale authenticator pgrst.db_schemas).
--
-- Run this in the Supabase SQL Editor, then retry the app.
-- Docs: https://supabase.com/docs/guides/troubleshooting/pgrst106-the-schema-must-be-one-of-the-following-error-when-querying-an-exposed-schema-n5V0k0

-- Option A (recommended): let the Dashboard "Exposed schemas" setting win
alter role authenticator reset pgrst.db_schemas;

-- Reload PostgREST config
notify pgrst, 'reload schema';
notify pgrst, 'reload config';

-- Verify grants for the app schema
grant usage on schema sominnercore to anon, authenticated, service_role;
grant all on all tables in schema sominnercore to anon, authenticated, service_role;
grant all on all routines in schema sominnercore to anon, authenticated, service_role;
grant all on all sequences in schema sominnercore to anon, authenticated, service_role;
alter default privileges for role postgres in schema sominnercore
  grant all on tables to anon, authenticated, service_role;
alter default privileges for role postgres in schema sominnercore
  grant all on routines to anon, authenticated, service_role;
alter default privileges for role postgres in schema sominnercore
  grant all on sequences to anon, authenticated, service_role;

-- Optional check: should include sominnercore after reset + dashboard save
-- select rolname, rolconfig from pg_roles where rolname = 'authenticator';
