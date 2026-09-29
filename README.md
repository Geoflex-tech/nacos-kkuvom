# NACOS KKU VOM Chapter Portal

Official website and member portal for the **Nigeria Association of Computing Students** (NACOS), Karl Kumm University, Vom Chapter.

🌐 **Live:** https://nacos-kkuvom.vercel.app

## Features

### Public Website
- Homepage with live stats and President's welcome
- About, Executives, Chapter History
- News, Events, Gallery
- **Tech Hub** — curated free learning resources
- **Certificate Verification** — public verification of issued certificates
- Contact form

### Member Portal
- Registration with profile photos
- Personal dashboard
- Profile management
- Resources library
- Announcements
- Certificates (view + print)
- Chapter dues

### Admin Portal
- Overview dashboard with live stats
- Full CRUD on: News, Events, Executives, Announcements, Resources, Tech Hub, Gallery, Administrations, Certificates
- Member management (approve/reject, role assignment)
- Contact inbox

## Tech Stack

- **Frontend:** Vite + React + Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + Storage + Edge Functions)
- **Payments:** Paystack
- **Hosting:** Vercel
- **Version Control:** GitHub (auto-deploy on push to `main`)

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account
- (Optional) Supabase CLI for Edge Functions

### Setup

```bash
git clone https://github.com/Geoflex-tech/nacos-kkuvom.git
cd nacos-kkuvom
npm install