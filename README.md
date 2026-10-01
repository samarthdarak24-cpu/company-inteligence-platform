# Signalpost

**Verified company intelligence, backed by evidence.**

Signalpost is a Norwegian company-intelligence and public-information research platform: search a Norwegian
organisation number and build a current, evidence-backed company profile from permitted public sources — with every
fact connected to the source it came from.

This repository contains both experiences:

- **Marketing website** — `/`, `/features`, `/how-it-works`, `/sources`, `/about`, `/login`, `/signup`
- **Research workspace** — `/app`, `/app/search`, `/app/companies`, `/app/company/:organisationNumber`,
  `/app/company/:organisationNumber/report`, `/app/compare`, `/app/activity`, `/app/sources`, `/app/history`,
  `/app/settings`

> All company data in this environment is **demo data**. It is labelled as such throughout the interface and must never
> be presented as a live verified result.

---

## Stack

| Layer      | Technology |
| ---------- | ---------- |
| Framework  | Next.js 16 (App Router, React 19, TypeScript) |
| Styling    | Tailwind CSS v4 with a CSS-variable design system (light + dark) |
| Data layer | PostgreSQL via Drizzle ORM |
| Client data| TanStack Query |
| Motion     | Framer Motion (150–300 ms, restrained) |
| Icons      | Lucide React |
| Charts     | Hand-built accessible SVG charts (no heavy chart dependency) |

> The original brief suggested Vite + React Router. This workspace is a Next.js + PostgreSQL environment, so the same
> architecture is delivered with the App Router (file-based routing) and server route handlers instead — the component
> design system, API layer and demo-mode behaviour are unchanged.

## Folder structure

```
src/
  app/
    (marketing)/            Marketing site (layout, home, features, how-it-works, sources, about, login, signup)
    app/                    Authenticated research workspace
      layout.tsx            Dashboard shell (sidebar, topbar, command menu, evidence drawer)
      page.tsx / view.tsx   Overview dashboard
      search/               Search + research progress experience
      companies/            Company table
      company/[companyNumber]/
        view.tsx            Company header, tab navigation, states
        tabs.tsx            Overview / Financials / People / Locations / Website / Hiring / Activity / History / Sources
        report/             Printable export report
      compare/ activity/ sources/ history/ settings/
      error.tsx             Friendly, non-technical error boundary
    api/                    Route handlers (see API below)
    layout.tsx globals.css  Root layout, design tokens, theme bootstrapping
  components/
    ui/                     Design system: primitives, data-table, charts, drawer, tooltip
    app/                    Shell, sidebar, command menu, evidence drawer, page shell
    marketing/              Site header/footer, hero preview, marketing sections
    logo.tsx theme-provider.tsx providers.tsx
  db/                       Drizzle client + schema
  lib/
    demo-data.ts            Deterministic Norwegian demo dataset
    repo.ts                 Data access with auto-seeding and in-memory fallback
    client-api.ts           Typed client API layer (configurable base URL)
    utils.ts                Formatting helpers (currency, dates, organisation numbers)
```

## API

All endpoints return JSON and are tagged `"mode": "demo"`.

```
GET    /api/health
GET    /api/companies
GET    /api/company/:organisationNumber
GET    /api/company/:organisationNumber/financials
GET    /api/company/:organisationNumber/people
GET    /api/company/:organisationNumber/locations
GET    /api/company/:organisationNumber/jobs
GET    /api/company/:organisationNumber/activity
GET    /api/company/:organisationNumber/history
GET    /api/company/:organisationNumber/sources
GET    /api/search?q=
POST   /api/search                 { "query": "979543883" }  → records the lookup
GET    /api/compare?orgs=a,b,c
GET    /api/activity
GET    /api/sources?type=official|financial|jobs|news|other
GET    /api/history
DELETE /api/history
GET    /api/stats
GET    /api/export/:organisationNumber?format=json|csv
```

The database is seeded automatically on first request. If PostgreSQL is unavailable, the repository layer falls back to
the in-memory demo dataset, so **demo mode always works without a backend database**.

## Setup

```bash
npm install
cp .env.example .env        # adjust DATABASE_URL if needed
npx drizzle-kit push        # create tables
npm run dev                 # http://localhost:3000
```

### Environment variables

```
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
NEXT_PUBLIC_API_BASE_URL=        # optional: point the client at an external Signalpost backend
```

### Commands

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npx drizzle-kit push` | Apply schema changes |

### Deployment

1. Provision a PostgreSQL database and set `DATABASE_URL`.
2. Run `npx drizzle-kit push` against the production database.
3. `npm run build && npm run start` (or deploy to any Node host / Vercel — `output` is the default Next.js server
   build). Route handlers are dynamic, pages are statically rendered where possible.
4. Optional: set `NEXT_PUBLIC_API_BASE_URL` when the frontend should call a separately hosted API.

## Dependencies

Runtime: `next`, `react`, `react-dom`, `drizzle-orm`, `pg`, `dotenv`, `@tanstack/react-query`, `framer-motion`,
`lucide-react`, `clsx`, `tailwind-merge`.

Dev: `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `drizzle-kit`, `eslint`, `eslint-config-next`,
`@types/*`.

## Product details

- **Evidence drawer** — click any fact or source to inspect the source, published/retrieved dates, excerpt, page
  reference and verification status.
- **Command menu** — `⌘K` / `Ctrl+K` (or `/`) for company search and workspace actions; organisation-number matches rank
  highest.
- **Change history** — previous and current values with the date each change was observed.
- **Export** — JSON, CSV (financials) and a printable report layout.
- **Theme** — light, dark or system; the preference persists per browser and is applied before first paint.
- **Accessibility** — semantic landmarks, ARIA roles on tabs/dialogs/switches, visible focus rings, keyboard-navigable
  tables, drawers and command menu, and reduced-motion support.
- **Demo labelling** — demo badges and explicit disclaimers wherever figures are displayed.
