# idCashier Invoice Generator

React + Vite + Supabase application for creating invoices, delivery notes, and receipts.

## Current product model

- Authentication uses `email/password` only.
- New accounts must:
  1. register
  2. verify email
  3. wait for manual activation by the superuser
- Superuser email: `jho.j80@gmail.com`
- Plans are manual and non-expiring:
  - `free`
  - `starter`
  - `pro`
- Payment gateway and self-service billing are removed.

## Main features

- Invoice, delivery note, and receipt editor
- Localized UI (`en` / `id`)
- PDF export
- Saved documents
- Client management
- Read-only client portal for eligible plans
- Superuser-only user management page

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase Auth / Database / Storage / Edge Functions
- jsPDF

## Run locally

### Requirements

- Node.js 18+
- `pnpm`

### Setup

```powershell
cd C:\Users\LENOVO\Documents\POS\NOTA\INVOICE
Copy-Item .env.example .env.local
corepack pnpm install
corepack pnpm dev
```

Open `http://localhost:5173`.

## Environment files

### `INVOICE/.env`

Safe frontend variables only:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### `INVOICE/.env.local`

Private server-side variables for local tooling and Supabase operations:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
```

Do not commit `.env.local`.

## Auth flow

### Public users

- Register with email and password
- Verify email from the Supabase email link
- Wait for superuser approval
- Pending or disabled accounts cannot use the app

### Superuser

The superuser can open `/admin/users` to:

- list users
- create users
- activate / disable users
- assign plan manually
- reset password
- delete user and their related data

## Database notes

Important tables:

- `documents`
- `clients`
- `recurring_invoices`
- `profiles`
- `pdf_export_quotas`

Recent schema changes:

- `profiles.plan_expires_at` removed
- `profiles.account_status` added
- payment tables removed

## Build

```powershell
corepack pnpm build
```

## Supabase

This repo contains:

- `supabase/migrations`
- `supabase/functions`
- `supabase/tables`

Apply migrations and deploy edge functions after schema/function changes.

## Notes

- Client portal is view-only.
- Free users are limited to:
  - 3 saved documents
  - 3 clients
  - 5 PDF exports
