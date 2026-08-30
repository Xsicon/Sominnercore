# KobNetiApi (ops API)

The multi-tenant **operations** API lives in a sibling repo (formerly Sominnercore Support API).

**Location:** `../Sominnercore-SupportApi` (local folder; GitHub target name **KobNetiApi**)  
**Project:** `KobNeti.Api`  
**Postgres schema:** **`sominnercore`** (not renamed)

## Why chats looked empty

MuuqWear live chat is served by **MuuqWearApi** (e.g. `http://localhost:5243/`), not directly from Supabase in the Support Hub.

1. Open **Support Hub → Settings → Product API URLs**
2. Set MuuqWear to `http://localhost:5243/` and click **Save URL**
3. Start MuuqWearApi, click **Test connection** (should show **API online**)
4. Open **Live Chat** — sessions load from the product API when it is running

The same upstream URL is used for **Knowledge Base** articles (`api/Help/articles` and `api/Help/admin/articles` are forwarded when the product API URL is set).

**Create Ticket** from Live Chat: the session is read from the product API (`api/Chat/session/{id}` + messages), but the ticket is always created in the **ops store** (`sominnercore.support_tickets`). Restart KobNetiApi after pulling bridge fixes.

If no URL is configured, chat and KB use the KobNeti **ops store** (`sominnercore.support_chat_*`, `support_kb_*`) only.

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
Also apply: `products_registry.sql`, `staff_access.sql`, `teams.sql`, `support_w2_intake.sql`, `support_w2_lifecycle.sql`, `support_w3_incidents.sql`, `support_w4_engineering.sql`, `support_w5_people_ops.sql`, `support_w6_platform_glue.sql`, `support_w7_insights.sql`.
Widget embed: `../Sominnercore-SupportApi/docs/widget-embed.md`

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
