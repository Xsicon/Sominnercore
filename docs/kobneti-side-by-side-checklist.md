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
| S3 | Overview / LiveChat / Tickets / … | AdminDashboard / SupportHub | |
| S4 | Eng / Time / Payroll | Engineering / Time / People | |
| S5 | Calendar / Files / … | Calendar / Platform / Insights | |
| S6 | Analytics / Users / Teams | Insights / Staff / Teams | |
