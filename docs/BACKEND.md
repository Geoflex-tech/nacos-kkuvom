# NACOS KKU VOM — Backend Documentation

## Overview

The backend is built on **Supabase** (Postgres + Auth + Storage + Edge Functions).

## Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User profiles (linked to auth.users) |
| `news` | Chapter news posts |
| `events` | Chapter events |
| `executives` | Executive records |
| `gallery` | Photo gallery |
| `contact_messages` | Contact form submissions |
| `resources` | Past questions & study materials |
| `announcements` | Member announcements |
| `payments` | Dues/payment records |
| `rsvps` | Event RSVPs |
| `administrations` | Chapter administrations (legacy) |
| `certificates` | Issued certificates |
| `permissions` | Permission catalog |
| `role_permissions` | Role → permission mapping |
| `tech_hub_resources` | Curated learning resources |

## Roles

- `member` — basic portal access
- `exec` — general executive
- `secretary` — can post news, events, announcements, certificates
- `treasurer` — can view payments
- `ict` — tech-focused exec
- `president` — full access
- `super_admin` — full access

## Helper Functions

- `has_permission(perm text) → boolean` — check if current user has permission
- `is_exec_or_admin() → boolean` — any exec-level role
- `verify_certificate(code text)` — public certificate verification

## Edge Functions

Located in `supabase/functions/`:

- `paystack-init` — initialize Paystack payment
- `paystack-verify` — verify Paystack payment

## Storage Buckets

- `avatars` — profile photos & exec photos (public)
- `gallery` — gallery photos (public)

## Migrations

Run in order to set up a fresh environment:

## Paystack Setup

### Test Mode
1. Get test keys from https://dashboard.paystack.com/#/settings/developers
2. Copy the **Test Secret Key** (starts with `sk_test_`)
3. Set in Supabase: Edge Functions → Secrets → `PAYSTACK_SECRET_KEY`
4. Set `SITE_URL=https://nacos-kkuvom.vercel.app`
5. Test card: `4084 0840 8408 4081` / CVV `408` / PIN `0000` / OTP `123456`

### Live Mode
1. Complete Paystack business verification
2. Get the **Live Secret Key** (`sk_live_...`)
3. Replace `PAYSTACK_SECRET_KEY` in Supabase Secrets
4. Real payments now flow to the chapter's bank account