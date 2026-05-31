# JRW Finance — Client Portal

## What this project is

A client-facing mortgage portal and broker admin panel for JRW Finance, an Australian mortgage broking business run by Josh Weiler. Clients log in to view their loans, properties, goals, documents, and alerts. The broker (Josh) logs into a separate admin panel to manage all clients.

## Live URLs

| App | URL | Netlify project |
|-----|-----|----------------|
| Client portal | https://portal.jrwfinance.com.au | `jrw-portal` |
| Broker admin | https://admin.jrwfinance.com.au | `jrw-broker-admin` |

## Tech stack

- **Frontend:** Vanilla JS, single-file HTML (no build system yet — improving this is a priority)
- **Backend/DB:** Supabase (project ID: `amhevyrewmlmwxncujmp`, region: ap-southeast-2)
- **Hosting:** Netlify
- **Auth:** Supabase Auth (email/password)
- **Charts:** Chart.js 4.4.1 (client portal only)

## File structure

```
deploy/
  client-portal/index.html   (~494KB single-file app)
  broker-admin/index.html    (~365KB single-file app)
CLAUDE.md                    (this file)
```

**Immediate priority:** Break these single-file apps into a proper build setup (Vite recommended). Split into components/modules without changing the Netlify hosting or Supabase backend.

## Database schema (Supabase)

| Table | Purpose |
|-------|---------|
| `brokers` | Broker accounts (currently 1: Josh) |
| `clients` | Client accounts, linked to auth.users |
| `properties` | Properties owned by clients |
| `loans` | Loans linked to clients and properties |
| `goals` | Financial goals (5W+H structure) |
| `notes` | Broker/client notes with categories |
| `alerts` | Push alerts shown on client dashboard |
| `documents` | Document links (no upload yet) |
| `research` | Properties clients are researching/watching |
| `invite_tokens` | One-time tokens for client onboarding |
| `audit_log` | All INSERT/UPDATE/DELETE/LOGIN events |

All tables have RLS enabled. Access is controlled by the `is_broker()` function (checks if auth.uid() exists in `brokers` table).

## Security model

- **Clients** can read/write only their own rows (`auth.uid() = client_id` or `auth.uid() = id`)
- **Brokers** can read/write rows where `broker_id = auth.uid()` — scoped to their own clients only
- Edge Function (`create-client`) handles new client creation server-side to avoid exposing service role key
- Anon key is in the frontend HTML — this is intentional and safe given RLS

## What's already been done (do not redo)

### Database migrations applied
1. `add_updated_at_triggers` — `set_updated_at()` trigger function + triggers on all 6 tables with `updated_at` columns. Rows auto-update `updated_at` on every UPDATE.
2. `add_performance_indexes` — indexes on `client_id` and `broker_id` across all child tables, partial index on `fixed_expiry_date`, composite index on `(client_id, dismissed)` for alerts.
3. `broker_scoped_rls_policies` — all RLS policies updated to scope broker access to `broker_id = auth.uid()` rather than a blanket `is_broker()` check. Safe for multi-broker future.
4. `fixed_rate_expiry_cron_alert` — pg_cron job running nightly at 21:00 UTC (7am AEST) that inserts urgent alert rows for loans with `fixed_expiry_date` within 90 days. Function: `create_fixed_rate_expiry_alerts()`.

### Code fixes applied
- `broker-admin/index.html`: All bare `await _sb.from(...).update/delete()` calls now capture `{ error }` and call `showToast('⚠ ...')` on failure. Affects: `saveProp`, `saveLoan`, `saveGoalStatus`, `deleteProp`, `deleteLoan`, `deleteGoal`, `deleteNote`, `deleteAlert`, `deleteDoc`.

## Known issues / next priorities

### High priority
- **No build system** — both apps are monolithic single-file HTML. Move to Vite with separate modules for auth, data, and each tab/section.
- **No real-time updates** — data loads once on login. Add Supabase Realtime subscriptions so clients see broker changes without refreshing.
- **No client document upload** — `documents` table has 0 rows. Clients can only view broker-added links. Build upload flow using Supabase Storage.

### Medium priority
- **Email notifications** — when broker adds an alert or note, client should receive an email. Use a Supabase Edge Function triggered by a Postgres webhook on `alerts` INSERT + Resend (or similar).
- **2FA for broker admin** — appropriate for a financial app with client data. Supabase supports TOTP via `supabase.auth.mfa.*`.
- **Pagination on broker client list** — admin loads all clients/properties/loans with no limit. Add pagination or virtual scrolling before client count grows.

### Low priority
- Remove `broker_name` + `broker_email` denormalised columns from `clients` table — they can go stale. Join to `brokers` table instead.
- Add `updated_at` trigger to `alerts` table (currently only has `created_at`).
- Add `messages` table for two-way broker↔client messaging (currently notes are one-directional).

## Supabase Edge Functions

- `create-client` — called by broker admin to create a new client auth account + insert into `clients`. Accepts broker's JWT in Authorization header.

## Environment / credentials pattern

Both HTML files contain:
```js
const SUPA_URL = 'https://amhevyrewmlmwxncujmp.supabase.co';
const SUPA_KEY = '<anon key>'; // safe to be public — RLS enforced
```

When moving to a build system, these should move to `.env` files (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) and be injected at build time. Do not commit a service role key anywhere in the frontend.

## Josh's preferences

- Keep the existing design system (dark green `#2e3105` / lime `#dfe777` brand colours)
- The portal should feel premium — clients are property investors
- Minimal toast notifications for save feedback (already implemented)
- Australian context: currency in AUD, dates in DD/MM/YYYY, addresses in Australian format
