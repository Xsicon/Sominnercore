# Support API (external repo)

The multi-tenant Support API was moved out of this repo.

**Location:** `../Sominnercore-SupportApi` (sibling folder under `MurabacApps`)

## Why chats looked empty

MuuqWear still stores live chat on **MuuqWearApi** (`http://localhost:5243/`).  
Support Hub reads **Support API** (`http://localhost:5241/`). Those were separate stores.

Support API now **bridges** tenant `muuqwear` chat to MuuqWearApi when `UpstreamApiBaseUrl` is set (default in Development).

## Run (all three)

1. MuuqWearApi — `http://localhost:5243/`
2. Support API — `http://localhost:5241/`
3. Som Inner Core WASM — Support Hub → Live Chat

```bash
dotnet run --project ../Sominnercore-SupportApi/Sominnercore.SupportApi
```

Support Hub config: `SupportApi:BaseUrl` in `wwwroot/appsettings.json`.

JwtSecret for the bridge must match MuuqWear `Authentication:JwtSecret` (set via Support API user-secrets, not committed).

Cutover notes: `../Sominnercore-SupportApi/docs/support-muuqwear-cutover.md`  
Schema SQL: `../Sominnercore-SupportApi/supabase/support_schema.sql`

## Multi-project Support Hub

Each storefront brand is a **tenant** in Support API (`Support:Tenants`) and a **Project** row in Core `softwares` (Admin → Projects). Softwares use UUID ids; names match brands (MuuqWear / Salguri / GaarX). Tenant ids live in Support API config:

| TenantId | PublicKey (dev) | Enabled |
|----------|-----------------|---------|
| `muuqwear` | `pk_muuqwear_dev_public` | yes |
| `salguri` | `pk_salguri_dev_public` | yes |
| `gaarx` | `pk_gaarx_dev_public` | yes |

Core auto-registers missing Softwares on Admin Dashboard load (`SoftwareProductService.EnsureSupportProjectsRegisteredAsync`).  
Optional SQL: `supabase/seed_support_projects.sql` (matches by name; generates UUID ids).

Support Hub sidebar **Project** switcher calls `GET api/Support/tenants`, then sets `X-Tenant-Key` via `SupportApiClient.SetTenant(...)`.

Selection is stored in `localStorage` key `support-hub-selected-tenant`.

Chat, tickets, and KB reload for the selected project (`@key` remount).

Optional per-tenant Help Center URL: `Support:Tenants:{id}:PublicHelpCenterUrl` (also returned on the tenants list). Core still accepts `SupportApi:PublicHelpCenterUrl` as the default when a tenant has none.

## Deploy on Render

### 1) Support API (Web Service)

1. Push `Sominnercore-SupportApi` to GitHub.
2. Render → **New → Web Service** → connect that repo.
3. Settings:
   - **Runtime:** Docker (uses repo `Dockerfile`)
   - **Instance:** free/starter is fine to start
4. Environment variables (Render dashboard):

| Key | Example / notes |
|-----|-----------------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `Supabase__Url` | your Supabase project URL |
| `Supabase__AnonKey` | anon key (optional for API) |
| `Supabase__ServiceRoleKey` | **required** for real DB (not in-memory) |
| `Supabase__Schema` | `sominnercore` |
| `Support__UseInMemoryStore` | `false` in production |
| `Support__CoreAgentJwtSecret` | long random secret (32+ chars) |
| `Support__CoreAdminEmails__0` | your admin email |
| `Support__Tenants__muuqwear__PublicKey` | `pk_muuqwear_…` (prod key) |
| `Support__Tenants__muuqwear__JwtSecret` | MuuqWear JWT secret if bridging |
| `Support__Tenants__muuqwear__UpstreamApiBaseUrl` | MuuqWearApi public URL or empty |
| `Support__Tenants__muuqwear__Enabled` | `true` |
| (same pattern for `salguri`, `gaarx`) | |

5. Health check path: `/health`
6. After deploy, copy the public URL, e.g. `https://sominnercore-support-api.onrender.com/`

### 2) Som Inner Core WASM (Web Service + Docker)

1. Set production Support API URL in `wwwroot/appsettings.json` **before** deploy (or bake in build):

```json
"SupportApi": {
  "BaseUrl": "https://sominnercoresupportapi.onrender.com/",
  "TenantId": "muuqwear",
  "TenantKey": "pk_muuqwear_dev_public",
  "PublicHelpCenterUrl": ""
}
```

Local `dotnet run` still uses `wwwroot/appsettings.Development.json` → `http://localhost:5241/`.

2. Render → **New → Web Service** → `Sominnercore` repo (Docker + `Dockerfile` / `nginx.conf`).
3. Open the site → Admin → Support Hub and confirm chats/tickets/KB hit the API.

### 3) Checklist so everything works together

- [ ] Support API `/health` returns OK
- [ ] WASM `SupportApi:BaseUrl` points at the Render API (HTTPS, trailing `/`)
- [ ] Supabase schema `sominnercore` exposed + support tables applied
- [ ] `Support__UseInMemoryStore=false` and Service Role key set
- [ ] Admin email allowed via `Support__CoreAdminEmails`
- [ ] Tenant public keys match what the Hub / storefront widgets send as `X-Tenant-Key`
- [ ] CORS is open in API — Render HTTPS origins work

### Help KB API (used by Support Hub)

| Method | Route |
|--------|--------|
| GET | `api/Help/articles` (published) |
| GET | `api/Help/articles/{id}` |
| GET | `api/Help/admin/articles` |
| GET | `api/Help/admin/articles/{id}` |
| POST | `api/Help/admin/articles` |
| PUT | `api/Help/admin/articles/{id}` |
| PATCH | `api/Help/admin/articles/{id}/status` |
| DELETE | `api/Help/admin/articles/{id}` |
| POST | `api/Help/admin/upload-image` |
| POST | `api/Help/admin/articles/{id}/comments` |
| POST | `api/Help/admin/articles/{id}/vote` |
