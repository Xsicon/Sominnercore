# KobNeti UI Redesign — From Scratch (v2)

**Status:** Replaces the failed “theme swap” pass (light paint over old Blazor).  
**Source of truth:** [`kobneti-design/`](../kobneti-design/) — Google AI Studio React + Tailwind mock (run with `npm install && npm run dev`).  
**Implementation target:** Blazor WASM only — keep KobNetiApi contracts stable.  
**Feature plan:** [kobneti-platform-plan.md](./kobneti-platform-plan.md) (W0–W7) stays; this doc is **UI parity only**.

---

## 0. Why we restart

The first redesign waves (RD0–RD7 in v1) mostly:

- Added CSS variables and made the old dark UI light
- Reorganized the sidebar labels
- Did **not** rebuild layouts to match Studio composition

That is **not** acceptable. Matching the new design means **new markup and spacing**, screen by screen, against the Studio reference — not recoloring `.admin-dashboard` / `.support-hub`.

**Rule going forward:** If a Blazor screen still uses the pre-redesign DOM structure with only CSS overrides, it is **not done**.

---

## 1. Locked decisions

| Decision | Choice |
|----------|--------|
| Stack | Stay on **Blazor WASM**; do **not** ship the React Vite app as production UI |
| Reference | `kobneti-design` is the visual + IA spec; Blazor must **look like** it |
| Method | **Structural port**: rebuild each screen’s layout from Studio TSX → Razor + CSS |
| Styling | CSS variables + dedicated screen CSS (no Tailwind in Blazor) |
| API | No backend redesign inside UI ports; stub controls that have no API |
| Scope | Port screens that already have APIs first; defer Studio-only extras (Sprints, mega Settings) |

---

## 2. Teardown (do before rebuilding)

Delete or revert the “paint” layer so we are not fighting half-finished styles.

### 2.1 Remove / replace theme-swap artifacts

- [x] **T1** Gut paint-only CSS: `kobneti-ops.css` / `kobneti-ui.css` reset to foundations; `kobneti-public.css` kept as S1 structural rebuild (not paint); tokens regenerated from Studio.
- [x] **T2** Rebuild `Components/Ui/*` primitives (Button, Chip, Metric, Empty, PageHeader, Card) — no orphan paint utilities.
- [x] **T3** Public rebuilt in **S1** from `PublicWebsiteRoot` + `PublicHomePage` (not theme swap).
- [x] **T4** `OpsShell.razor` reset to minimal `ops-*` chrome (routes/logic kept); full Studio Sidebar/Header = **S2**.
- [x] **T5** `index.html` links only foundations + public + minimal ops; legacy hub CSS kept until S3+ ports.
- [x] **T6** Keep `kobneti-design/` in repo as reference; keep csproj exclude-from-publish.

### 2.2 What we keep

- All feature APIs / `SupportApiClient` / hub **routes** and business logic
- Auth (Supabase) flows
- Product switcher behavior (restyle, don’t remove)

---

## 3. Port method (every screen)

For each Studio screen:

1. Open Studio component (e.g. `LiveChatView.tsx`) next to Blazor.
2. Sketch DOM sections (header, filters, list, detail, empty).
3. **Rewrite** the Blazor `.razor` markup to that structure (new class names under `kn-` / `studio-` prefix).
4. Write **dedicated CSS** for that screen (or shared chrome only).
5. Wire existing API calls into the new DOM (same client methods).
6. **Done when:** side-by-side with Studio, a non-dev can tell they match (layout, hierarchy, density) — colors alone are insufficient.

```text
kobneti-design/*.tsx  →  structure + visual intent
Blazor *.razor        →  same structure + real data
KobNetiApi            →  unchanged contracts
```

---

## 4. Waves (from scratch)

### Wave S0 — Teardown + foundations

- [x] **S0.1** Execute teardown T1–T6.
- [x] **S0.2** Regenerate tokens from `kobneti-design/src/index.css` only.
- [x] **S0.3** Fonts: Inter + Source Serif 4 (as Studio).
- [x] **S0.4** Shared primitives built by copying Studio patterns (Button, Badge/Chip, Card, Metric) — used only when a screen needs them.
- [x] **S0.5** Side-by-side checklist template (`docs/kobneti-side-by-side-checklist.md`).

**Exit:** Old paint gone; blank/minimal shell boots; tokens ready.

---

### Wave S1 — Public website (full rebuild)

Studio: `PublicWebsiteRoot`, `PublicNavbar`, `PublicFooter`, `PublicHomePage`, Products/Services/About/Portfolio/Contact, LiveChat modal.

- [x] **S1.1** Rebuild `MainLayout` from Navbar + Footer.
- [x] **S1.2** Rebuild Home from `PublicHomePage` (hero, carousel, sections — real structure).
- [x] **S1.3** Secondary public pages/sections matching Studio.
- [x] **S1.4** Chat CTA / modal stub or widget hook.

**Exit:** Public site matches Studio at a glance.

---

### Wave S2 — Login + ops chrome (full rebuild)

Studio: `LoginPage`, `Sidebar`, `Header`.

- [x] **S2.1** Rebuild login page layout from `LoginPage.tsx` (+ forgot password + Postmark reset).
- [x] **S2.2** Rebuild sidebar from `Sidebar.tsx` (collapse, categories, product switcher, status).
- [x] **S2.3** Rebuild top header from `Header.tsx`.
- [x] **S2.4** Route map to existing hubs; product switcher in Studio placement.

**Exit:** Ops chrome matches Studio; hubs still temporary until later waves.

---

### Wave S3 — Overview + Support (rebuild views)

Studio: `OverviewView`, `LiveChatView`, `SupportTicketsView` / `TicketListView` / `TicketDetailView`, `EscalationsView`, `KnowledgeBaseView`.

- [ ] **S3.1** Rebuild Overview (`AdminDashboard` overview tab or dedicated page).
- [ ] **S3.2** Rebuild Live Chat view.
- [ ] **S3.3** Rebuild Tickets list + detail/drawer.
- [ ] **S3.4** Rebuild Incidents + KB.

**Exit:** Daily Support path matches Studio; APIs unchanged.

---

### Wave S4 — Engineering + People

Studio: `TaskBoardView`, `TaskDetailView`, `ProjectRoadmapView`, `GitHubActivityView`, `TimeTrackingView`, `ApprovalsView`, `PayrollRunsView` (+ hide My Pay if no API).

- [ ] **S4.1** Rebuild Eng board / milestones / GitHub.
- [ ] **S4.2** Rebuild Time + Approvals.
- [ ] **S4.3** Rebuild Payroll.

**Defer:** `SprintsBacklogView`.

---

### Wave S5 — Platform glue

Studio: Calendar, Files, Integrations, Audit, Notification prefs, Internal Chat, Help Center, Resources, Product Registry, Linked Repos.

- [ ] **S5.1** Calendar + notification prefs.
- [ ] **S5.2** Files + integrations + audit.
- [ ] **S5.3** Internal chat + help + assets.
- [ ] **S5.4** Product registry / linked repos.

---

### Wave S6 — Insights + Staff

Studio: `AnalyticsDashboardView`, `UsersView`, `TeamsView` (+ minimal profile/settings).

- [ ] **S6.1** Insights / analytics shell.
- [ ] **S6.2** Users + Teams.
- [ ] **S6.3** Minimal settings/profile if needed.

**Defer:** Pending invites / access audit richness beyond existing audit API.

---

### Wave S7 — Hardening

- [ ] **S7.1** Responsive pass vs Studio breakpoints.
- [ ] **S7.2** Delete leftover pre-redesign CSS files that nothing references.
- [ ] **S7.3** Smoke test every hub with real API.
- [ ] **S7.4** Optional content dark mode (Studio toggle) only after light default matches.

---

## 5. Screen map (Studio → Blazor)

| Studio | Blazor target (rebuild) |
|--------|-------------------------|
| Public* | `MainLayout`, `Home`, content routes |
| LoginPage | `AdminLogin` |
| Sidebar + Header | `OpsShell` |
| OverviewView | Admin overview |
| LiveChat / Tickets / Escalations / KB | Support hub views |
| TaskBoard / Roadmap / GitHub | Engineering views |
| Time / Approvals / Payroll | People hubs |
| Calendar / Files / Integrations / Audit / IM / Help / Assets | Calendar / Platform / Insights / Internal |
| Users / Teams | AdminStaff / AdminTeams |

---

## 6. Definition of done (per screen)

A screen is done only if:

1. Markup was **rewritten** for Studio structure (not only CSS on old classes).
2. Side-by-side with Studio looks like the same product.
3. Real data still loads via existing clients.
4. No dependency on deleted paint-only CSS.

---

## 7. Explicit non-goals

- Rewriting KobNeti in React
- Changing KobNetiApi schemas for cosmetics
- Pixel-perfect Tailwind class dump (translate to semantic CSS)
- Building Sprints / full Settings mega-page before Support chrome is right

---

## 8. Suggested execution order

1. **S0 teardown** (delete paint, reset shell/public to rebuildable state)  
2. **S1 public** (brand-visible win)  
3. **S2 chrome** (unlocks all hubs)  
4. **S3 Support** (highest daily use)  
5. S4 → S7  

---

## 9. Document history

| Version | Date | Notes |
|---------|------|--------|
| 1.0 | 2026-08-24 | Theme-swap waves (superseded — insufficient fidelity) |
| 2.0 | 2026-08-24 | From-scratch structural port plan; teardown required |
| 2.1 | 2026-08-24 | S1 public done; S0 teardown + foundations completed |
| 2.2 | 2026-08-25 | S2 login + ops chrome; Postmark password reset |

*When implementing, check boxes here. Do not mark a wave done for “CSS light mode only.”*
