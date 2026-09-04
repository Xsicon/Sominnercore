# KobNeti side-by-side checklist (S0.5)

Use this for every screen port. Open Studio (`kobneti-design`, `npm run dev`) next to Blazor.

## How to use

1. Set Studio to the target view (nav item / public route).
2. Open the matching Blazor route.
3. Fill the checklist. Mark **Done** only when layout/hierarchy match — not colors alone.

## Template

| Field | Value |
|-------|--------|
| Studio component | e.g. `LiveChatView.tsx` |
| Blazor page | e.g. `SupportHub` live tab |
| Date | |
| Reviewer | |

### Structure

- [ ] Page chrome (sidebar + header) matches Studio placement
- [ ] Primary heading hierarchy matches (title / subtitle / actions)
- [ ] Main regions present (filters, list, detail, empty, footer actions)
- [ ] Density / spacing feels like Studio (not old dark admin)
- [ ] No reliance on deleted paint-only CSS

### Interaction

- [ ] Primary CTAs in the same place
- [ ] Empty / loading / error states exist
- [ ] Real API data still loads

### Verdict

- [ ] **Pass** — side-by-side looks like the same product
- [ ] **Fail** — list gaps below

**Gaps:**

1. …
2. …

---

## Screen log

| Wave | Studio | Blazor | Status |
|------|--------|--------|--------|
| S1 | Public* | MainLayout / Home / public pages | Done |
| S2 | LoginPage / Sidebar / Header | AdminLogin / OpsShell | Done |
| S3 | Overview / LiveChat / Tickets / … | AdminDashboard / SupportHub | Done |
| S4 | Eng / Time / Payroll | EngineeringHub / PeopleTimeHub / PeopleOpsHub | Done (see gaps) |
| S5 | Calendar / Platform / Registry / Help / Assets / Internal | CalendarHub / PlatformHub / RegistryHub / HelpHub / AssetsHub / InternalChatHub | Done |
| S6 | Analytics / Users / Teams / Profile | InsightsHub / AdminStaff / AdminTeams / AdminProfile | Done |
| S7 | Hardening | kn-hub responsive + CSS cleanup + build | Done |

### S4 detail (2026-08-31)

| Studio | Blazor route | Verdict | Known gaps |
|--------|--------------|---------|------------|
| `TaskBoardView` + `TaskDetailView` | `/admin/engineering` (Board tab) | Pass | No sprints/backlog tab (deferred) |
| `ProjectRoadmapView` | `/admin/engineering?tab=milestones` | Pass | List + calendar strip; no Gantt |
| `GitHubActivityView` | `/admin/engineering?tab=github` | Pass | Read-only PR/commit list |
| `TimeTrackingView` | `/admin/time` | Pass | Per-device TZ on punch; legacy rows without `@tz` tag use viewer device |
| `ApprovalsView` | `/admin/time?tab=approvals` | Pass | — |
| `PayrollRunsView` | `/admin/people` | Pass (functional) | Period list + admin tools; no per-employee roster grid like Studio mock |

### S6 detail (2026-09-04)

| Studio | Blazor route | Verdict | Known gaps |
|--------|--------------|---------|------------|
| `AnalyticsDashboardView` | `/admin/insights` | Pass | Live metrics + attention queue + bars; no historical trend chart (API has no time series) |
| `UsersView` | `/admin/staff` | Pass | Invite + filters + table; no suspend/impersonate/edit slide-over (API limits) |
| `TeamsView` | `/admin/teams` | Pass | Card grid + members add/remove; no multi-product team edit |
| `ProfileView` (minimal) | `/admin/profile` | Pass | Identity + theme; no activity/2FA tabs |
