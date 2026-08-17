# KobNeti Unified Operations Platform — Execution Plan

**Source:** KobNeti PRD v1.0 (`KobNeti.md`)  
**Architecture stance (confirmed):**

- **N product APIs** — each customer-facing product keeps its own API (e.g. `MuuqWearApi`, later Salguri/GaarX/SomPay APIs).
- **1 ops API** — one internal backend for staff to manage support and (later) all ops modules across products.
- **1 ops UI** — Som Inner Core / KobNeti admin shell (WASM) is the pane of glass.

This document turns the PRD into **ordered, do-one-at-a-time tasks**. Check boxes as you go.

---

## 0. Rename strategy (Som Inner Core → KobNeti)

**Decision (2026-08-17):** Rename repos, projects, namespaces, and branding to **KobNeti** / **KobNetiApi**.  
**Do not rename the Postgres schema** — keep **`sominnercore`** (and existing `support_*` tables) as-is.

Do renames in **layers**, not one giant big-bang. Prefer **new names going forward** while old URLs keep working briefly.

### Target names

| Today | Target | Role |
|-------|--------|------|
| `Sominnercore` / Som Inner Core (WASM) | **`KobNeti`** (repo/app: `KobNeti` or `kobneti-web`) | Ops UI / admin shell |
| `Sominnercore-SupportApi` / `Sominnercore.SupportApi` | **`KobNetiApi`** (repo: `KobNetiApi`, project: `KobNeti.Api`) | Ops API (all modules over time) |
| `MuuqWearApi` (and future product APIs) | **unchanged** | Product APIs (spokes) |
| Render: `sominnercore.onrender.com` | Later: `app.kobneti.com` or `kobneti.onrender.com` | Ops UI host |
| Render: `sominnercoresupportapi.onrender.com` | Later: `api.kobneti.com` or `kobneti-api.onrender.com` | Ops API host |

### Best way to rename (recommended order)

#### Phase R1 — Docs & branding only (low risk)

- [ ] **R1.1** Decide final spellings: display name `KobNeti`, UI repo `KobNeti`, API repo `KobNetiApi`, C# root namespace `KobNeti.Api` / `KobNeti.Web`.
- [ ] **R1.2** Update README / `docs/` titles to say KobNeti Ops UI / KobNetiApi; keep old GitHub repo names temporarily.
- [ ] **R1.3** In UI shell, change visible product name strings (nav, titles, login) from “Som Inner Core” → “KobNeti”.

#### Phase R2 — GitHub repos (medium risk)

- [ ] **R2.1** Rename GitHub repo `Xsicon/Sominnercore` → `Xsicon/KobNeti` (GitHub Settings → Rename). Update local `git remote set-url`.
- [ ] **R2.2** Rename GitHub repo `Xsicon/SominnercoreSupportAPI` → `Xsicon/KobNetiApi`. Update remote.
- [ ] **R2.3** Update Render “repo connection” if it broke after rename (usually auto-follows; verify auto-deploy).

#### Phase R3 — .NET project / namespaces (do after R2)

**Ops API**

- [ ] **R3.1** Rename folder/project `Sominnercore.SupportApi` → `KobNeti.Api` (or `KobNetiApi`).
- [ ] **R3.2** Change default namespace / assembly name; fix `using`s; update Dockerfile `dotnet publish` paths.
- [ ] **R3.3** Keep public HTTP routes stable at first (`/api/Chat`, `/api/Help`, `/api/SupportAuth`) so the UI does not break. Optional later: `/api/v1/...`.

**Ops UI**

- [ ] **R3.4** Rename `KobNeti.csproj` → `KobNeti.csproj` (or `KobNeti.Web.csproj`).
- [ ] **R3.5** Change root namespace from `KobNeti` → `KobNeti` (or `KobNeti.Web`); update Dockerfile.
- [ ] **R3.6** Rename config section `KobNetiApi:*` → `KobNetiApi:*` (or `OpsApi:*`) and update `Program.cs` / client — **ship UI + API config together**.

#### Phase R4 — Render / DNS (do last)

- [ ] **R4.1** Rename Render services for clarity (`kobneti`, `kobneti-api`). Note: **service rename may change `*.onrender.com` URLs**.
- [ ] **R4.2** Point UI `KobNetiApi:BaseUrl` (or `KobNetiApi:BaseUrl`) at the new API URL; redeploy UI.
- [ ] **R4.3** Add custom domains when ready (`app.kobneti.com`, `api.kobneti.com`) + CORS origins on API.
- [ ] **R4.4** Deprecate old Render URLs after DNS cutover.

### Rename rules of thumb

1. **Never rename product APIs** (MuuqWearApi etc.) as part of this — they stay product spokes.
2. **Rename GitHub before deep namespace churn** so clones/CI match.
3. **Keep API route paths stable** during rename; rename hosts/config, not contracts, in the same week.
4. **One deployable rename at a time:** API first (update UI BaseUrl), then UI project name.

---

## 1. System map (how pieces relate)

```text
Public products          Product APIs              Ops (KobNeti)
─────────────────        ─────────────             ──────────────────────────
muuqwear.com      ──►    MuuqWearApi               KobNeti UI (admin shell)
gaarx.com         ──►    GaarXApi (future)            │
salguri.com       ──►    SalguriApi (future)          ▼
                     widgets ─────────────────►   KobNetiApi (ops API)
                                                  • Product Registry
                                                  • Support (chat/tickets/KB)
                                                  • later: eng, payroll, …
```

**Rule:** Customer shopping/using a product → **product API**.  
KobNeti staff managing all products → **KobNetiApi + KobNeti UI**.

---

## 2. Workstreams overview

| Wave | Focus | PRD modules |
|------|--------|-------------|
| **W0** | Rename + stabilize Support on ops API | — |
| **W1** | Foundation: Identity + Product Registry | 1, 2, 3, 23 (shell) |
| **W2** | Support complete (ops-owned or bridged cleanly) | 4, 5, 10, 14 |
| **W3** | Support depth | 6, macros polish, cutover off product APIs |
| **W4** | Engineering work tracking | 7, 8, 11 |
| **W5** | People ops | 12, 13, 18 |
| **W6** | Platform glue | 16, 17, 19, 20, 24 |
| **W7** | Insights + internal help | 15, 25, 22, 9 (last), 21 |

Do **one task checkbox** (or one small PR) at a time.

---

## Wave W0 — Stabilize & rename

- [ ] **W0.1** Confirm prod Support: schema `support_schema.sql` applied + `sominnercore` exposed (or rename schema later to `kobneti`).
- [ ] **W0.2** Decide MuuqWear chat/tickets **home**: (A) bridge to MuuqWearApi in prod, or (B) ops-owned storage only.
- [ ] **W0.3** If (A): set Render `Support__Tenants__muuqwear__UpstreamApiBaseUrl` + `Support__Tenants__muuqwear__JwtSecret` (= MuuqWear `Authentication__JwtSecret`).
- [ ] **W0.4** Smoke-test Hub: Overview / Live Chat / Tickets / KB for `muuqwear`.
- [ ] **W0.5** Execute rename Phase **R1** (branding/docs).
- [ ] **W0.6** Execute rename Phase **R2** (GitHub repos → KobNeti / KobNetiApi).
- [ ] **W0.7** Execute rename Phase **R3** (csproj/namespaces/config keys).
- [ ] **W0.8** Execute rename Phase **R4** (Render/DNS) when ready.

---

## Wave W1 — Foundation (build first)

### Module 1 — Identity & Access

- [ ] **W1.1** Document staff roles: `admin`, `manager`, `engineer`, `support` (map from today’s `admin` / `support_team`).
- [ ] **W1.2** Keep Supabase Auth as staff IdP for v1; formalize `app_metadata.role` + allowlist emails.
- [ ] **W1.3** Harden `POST /api/SupportAuth/exchange` (or `/api/auth/exchange`) → ops agent JWT with role claims.
- [ ] **W1.4** Add product-scoped permission model (user may access only assigned products).

### Module 2 — User & Team Management

- [ ] **W1.5** Staff profile table (user id, display name, role, active).
- [ ] **W1.6** Teams table + membership.
- [ ] **W1.7** Admin UI: list/invite/deactivate staff (minimal).
- [ ] **W1.8** Assign staff ↔ products (powers switcher visibility).

### Module 3 — Software / Product Registry

- [ ] **W1.9** Single source of truth in **KobNetiApi** DB for products (replace env-only tenants long-term).
- [ ] **W1.10** Fields: name, slug/`tenant_id`, type, status, support tier, `public_key`, optional `upstream_api_base_url`, help URL.
- [ ] **W1.11** Seed MuuqWear / Salguri / GaarX; sync or retire Core-only `softwares` duplication.
- [ ] **W1.12** `GET /api/products` (or keep `/api/Support/tenants`) for Hub switcher.
- [ ] **W1.13** Rotate/generate embed keys per product; document widget install snippet.

### Module 23 — Navigation & UI Shell

- [ ] **W1.14** Treat KobNeti WASM as the shell: sidebar, product switcher, role-aware nav stubs.
- [ ] **W1.15** Add placeholder nav items for future modules (disabled until built).

**Exit criteria:** One login, product switcher from API registry, Support still works for at least one product.

---

## Wave W2 — Support core (PRD 4, 5, 10, 14)

### Module 4 — Ticket Intake

- [ ] **W2.1** Public ticket form API keyed by product public key (already partial).
- [ ] **W2.2** Embeddable ticket form snippet per product.
- [ ] **W2.3** Capture product context (page URL, account id if any).
- [ ] **W2.4** Email-to-ticket = later; stub only.

### Module 5 — Ticket Lifecycle

- [ ] **W2.5** Align statuses with PRD (New → In Progress → Waiting → Resolved → Closed) or map clearly to current `open` / `in_progress` / `resolved`.
- [ ] **W2.6** Assignment, priority, tags, timeline/history.
- [ ] **W2.7** SLA timer fields per product tier (can be null initially).
- [ ] **W2.8** Link ticket → future eng task id (nullable FK).

### Module 10 — Client Messaging (Live Chat)

- [ ] **W2.9** Ops-owned chat store as default for new products (no bridge required).
- [ ] **W2.10** MuuqWear: finish chosen path (bridge prod **or** migrate sessions into ops).
- [ ] **W2.11** Widget contract documented (send/messages/status) + public key.
- [ ] **W2.12** Macros/canned replies per product.
- [ ] **W2.13** Chat → ticket conversion.

### Module 14 — Knowledge Base (product/tech)

- [ ] **W2.14** Keep admin KB CRUD; ensure articles always scoped by product.
- [ ] **W2.15** Suggest KB articles from ticket category (basic).
- [ ] **W2.16** Distinguish later Help Center (Module 22) — do not mix content types.

**Exit criteria:** Agent can switch product and handle chat + tickets + KB without using product admin UIs.

---

## Wave W3 — Support depth

### Module 6 — Escalation & Incidents

- [ ] **W3.1** Incident entity (severity, commander, status, product_id).
- [ ] **W3.2** Escalate ticket → incident.
- [ ] **W3.3** Notify assignees (hook to Module 17 when ready; email/log stub OK).
- [ ] **W3.4** Incident timeline + postmortem notes field.

### Cutover & quality

- [ ] **W3.5** Remove MuuqWear upstream bridge once ops store is source of truth.
- [ ] **W3.6** Tenant isolation tests for every new Support table.
- [ ] **W3.7** Onboard Salguri/GaarX widgets to KobNetiApi (config only if W2.9 done).

---

## Wave W4 — Engineering (PRD 7, 8, 11)

### Module 7 — Engineering Tasks

- [ ] **W4.1** Task entity: type, status, priority, estimate, product_id, assignee.
- [ ] **W4.2** Board/list API + minimal UI.
- [ ] **W4.3** Link task ↔ ticket.
- [ ] **W4.4** Link task ↔ GitHub PR url (manual until Module 11).

### Module 8 — Project Planning

- [ ] **W4.5** Milestone/roadmap entities per product.
- [ ] **W4.6** Timeline view (simple list/dates before Gantt).
- [ ] **W4.7** Push milestone dates to Calendar (W6) via events table.

### Module 11 — GitHub (read-only)

- [ ] **W4.8** Store repo link on product; PAT/OAuth via Integrations Hub later.
- [ ] **W4.9** Read-only list PRs/commits (cached).
- [ ] **W4.10** Never write to GitHub from ops API.

---

## Wave W5 — People ops (PRD 12, 13, 18)

### Module 12 — Time Tracking

- [ ] **W5.1** Clock in/out entries (append-only).
- [ ] **W5.2** Manual time against ticket/task.
- [ ] **W5.3** Edits create new audit rows; require approval (Module 18).

### Module 18 — Approval Workflows

- [ ] **W5.4** Generic approval request (type, payload, status, approver chain).
- [ ] **W5.5** Wire time-edit + payroll approvals.

### Module 13 — Payroll (internal)

- [ ] **W5.6** Rates per user/role; pay periods.
- [ ] **W5.7** Calculate from **approved** time only.
- [ ] **W5.8** Export CSV/PDF; no external bank integration in v1.

---

## Wave W6 — Platform glue (PRD 16, 17, 19, 20, 24)

### Module 16 — Audit Logs

- [ ] **W6.1** Append-only `audit_events` (actor, action, entity, before/after).
- [ ] **W6.2** Instrument auth, ticket status, payroll, permission changes first.
- [ ] **W6.3** Admin search UI (read-only).

### Module 17 — Notifications

- [ ] **W6.4** In-app notification store + unread.
- [ ] **W6.5** Preferences per user.
- [ ] **W6.6** Emit from assignment, approval, escalation (no merge with chat).

### Module 19 — Calendar

- [ ] **W6.7** Events table; ingest milestones.
- [ ] **W6.8** Reminders via notifications.

### Module 20 — File Management

- [ ] **W6.9** Foldered files (product-scoped) in Supabase Storage.
- [ ] **W6.10** Keep ticket/chat attachments separate (message-scoped).

### Module 24 — Integrations Hub

- [ ] **W6.11** Encrypted secrets store for GitHub/email/etc.
- [ ] **W6.12** Admin UI to connect/disconnect integrations.

---

## Wave W7 — Insights, help, extras (PRD 15, 25, 22, 9, 21)

### Module 15 — Dashboards

- [ ] **W7.1** Role-based overview APIs (counts you already partial for Support).
- [ ] **W7.2** Cross-product aggregates for admin.

### Module 25 — Analytics

- [ ] **W7.3** Historical reports + export (after enough data exists).

### Module 22 — Help Center (platform how-to)

- [ ] **W7.4** Separate content store from product KB (Module 14).
- [ ] **W7.5** Shell help icon → these articles.

### Module 9 — Internal Communication

- [ ] **W7.6** Defer until Support + Tasks are solid; or keep “disabled shell” longer.
- [ ] **W7.7** Channels/DMs only when notifications (17) exist.

### Module 21 — Resource Management

- [ ] **W7.8** Hardware/license assets; assign to users; renewal notifications.

---

## 3. Suggested “next 10 tasks” (start here)

1. [ ] W0.2 — Decide bridge vs ops-owned for MuuqWear support data  
2. [ ] W0.3 or W0.1 — Unblock prod data / schema  
3. [ ] W0.4 — Smoke-test Support Hub end-to-end  
4. [ ] W0.5 — R1 branding to KobNeti  
5. [ ] W0.6 — Rename GitHub repos to `KobNeti` + `KobNetiApi`  
6. [ ] W1.9–W1.12 — DB-backed Product Registry on KobNetiApi  
7. [ ] W1.11 — Hub switcher reads registry only  
8. [ ] W2.9 — New products default to ops-owned chat/tickets  
9. [ ] W2.10 — Finish MuuqWear cutover path  
10. [ ] W1.4 — Product-scoped staff permissions  

---

## 4. Definition of done (per task)

A task is done when:

1. API (if any) is in **KobNetiApi** (not a new microservice).  
2. Product scoping uses **product/tenant id** (no hardcoded `muuqwear` in business logic).  
3. UI lives in **KobNeti** shell or an embed widget, not a new admin app.  
4. Sensitive actions are at least **loggable** (audit can be wired in W6).  
5. You can demo it with **one product**, then a second product with config only.

---

## 5. Explicit non-goals (for this ops platform)

- Replacing `MuuqWearApi` (or other product APIs) for commerce/domain features.  
- Building 25 separate API services.  
- Public marketing site (KobNeti.com showcase) as part of ops API.  
- Full Slack clone (Module 9) before Support + Registry are solid.

---

## 6. Document history

| Version | Date | Notes |
|---------|------|--------|
| 1.0 | 2026-08-17 | Initial plan from KobNeti PRD + N product APIs + 1 ops API stance; rename playbook |

*When Phase 2 contracts (schemas/endpoints) are needed for a wave, create `docs/kobneti-wave-WX-spec.md` per wave rather than expanding this file unboundedly.*
