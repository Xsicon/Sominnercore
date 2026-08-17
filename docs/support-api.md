# KobNetiApi (ops API)

The multi-tenant **operations** API lives in a sibling repo (formerly Sominnercore Support API).

**Location:** `../Sominnercore-SupportApi` (local folder; GitHub target name **KobNetiApi**)  
**Project:** `KobNeti.Api`  
**Postgres schema:** **`sominnercore`** (not renamed)

## Why chats looked empty

MuuqWear still may store live chat on **MuuqWearApi** (`http://localhost:5243/`).  
KobNeti Support Hub reads **KobNetiApi** (`http://localhost:5241/`). Those can be separate stores.

KobNetiApi **bridges** tenant `muuqwear` to MuuqWearApi when `UpstreamApiBaseUrl` is set (default in Development → localhost).

## Run (all three)

1. MuuqWearApi — `http://localhost:5243/`
2. KobNetiApi — `http://localhost:5241/`
3. KobNeti WASM — Support Hub → Live Chat

```bash
dotnet run --project ../Sominnercore-SupportApi/KobNeti.Api
```

Support Hub config: `KobNetiApi:BaseUrl` in `wwwroot/appsettings.json`.

JwtSecret for the bridge must match MuuqWear `Authentication:JwtSecret` (Support API user-secrets / Render env `Support__Tenants__muuqwear__JwtSecret`).

Cutover notes: `../Sominnercore-SupportApi/docs/support-muuqwear-cutover.md`  
Schema SQL: `../Sominnercore-SupportApi/supabase/support_schema.sql` (schema name remains `sominnercore`)

## Multi-project Support Hub

Each storefront brand is a **tenant** in KobNetiApi (`Support:Tenants`) and a **Project** row in Core `softwares` (Admin → Projects). Softwares use UUID ids; names match brands (MuuqWear / Salguri / GaarX).

| TenantId | PublicKey (dev) | Enabled |
|----------|-----------------|---------|
| `muuqwear` | `pk_muuqwear_dev_public` | yes |
| `salguri` | `pk_salguri_dev_public` | yes |
| `gaarx` | `pk_gaarx_dev_public` | yes |

Hub sidebar **Project** switcher calls `GET api/Support/tenants`, then sets `X-Tenant-Key` via `SupportApiClient.SetTenant(...)`.

## Deploy

### 1) KobNetiApi (Web Service)

- Runtime: Docker (`Dockerfile` in API repo)
- Health: `/health`
- Keep `Supabase__Schema=sominnercore`

### 2) KobNeti WASM

```json
"KobNetiApi": {
  "BaseUrl": "https://YOUR-KOBNETI-API.onrender.com/",
  "TenantId": "muuqwear",
  "TenantKey": "pk_muuqwear_dev_public",
  "PublicHelpCenterUrl": ""
}
```

Local `dotnet run` uses `wwwroot/appsettings.Development.json` → `http://localhost:5241/`.
