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