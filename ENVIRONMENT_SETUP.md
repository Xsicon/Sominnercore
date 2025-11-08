## Supabase Environment Variables

Create an `.env` (for local development) and configure the same keys in Netlify → **Site settings → Environment variables**.

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- `SUPABASE_URL`: Project API URL from Supabase dashboard.
- `SUPABASE_ANON_KEY`: Public anon key for client-side calls.
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key; only use inside secured Netlify Functions.

You can also keep local variables in `.env.local` (ignored by git) and load them with your preferred configuration library.

