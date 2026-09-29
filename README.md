# NACOS KKU VOM Chapter Portal

Official website and member portal for the **Nigeria Association of Computing Students** (NACOS), Karl Kumm University, Vom Chapter.

🌐 **Live:** https://nacos-kkuvom.vercel.app

---

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

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | Vite + React + Tailwind CSS |
| Backend | Supabase (Postgres + Auth + Storage + Edge Functions) |
| Payments | Paystack |
| Hosting | Vercel |
| Version Control | GitHub (auto-deploy on push to `main`) |

---

## Getting Started

### Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** — check with `node --version`. Download from https://nodejs.org
- **npm 9+** — bundled with Node 18
- A **Supabase project** — free at https://supabase.com (you need the URL and anon key)
- *(Optional)* **Supabase CLI** — only needed to run Edge Functions locally

### 1 — Clone & install

```bash
git clone https://github.com/Geoflex-tech/nacos-kkuvom.git
cd nacos-kkuvom
npm install
```

> If `npm install` fails, delete `node_modules/` and `package-lock.json`, then try again.

### 2 — Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Find both values in your Supabase dashboard: **Project Settings → API → Project URL / anon public**.

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

### 3 — Run database migrations

Apply migrations in order (`0001` → `0009`) using one of these methods:

**Option A — Supabase CLI (recommended)**
```bash
supabase login          # only needed once
supabase link           # link to your project
supabase db push
```

**Option B — Supabase Dashboard SQL Editor**

Open each file in `supabase/migrations/` in order and paste + run the SQL in the dashboard SQL Editor.

### 4 — Start the dev server

```bash
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Project Structure

```
nacos-kkuvom/
├── src/
│   ├── components/     # Reusable UI components (Navbar, Footer, Skeleton, ErrorBoundary…)
│   ├── context/        # React context providers (AuthContext)
│   ├── hooks/          # Custom hooks (useDebounce, usePermission, useLeadership…)
│   ├── layouts/        # Route layout wrappers (PublicLayout, DashboardLayout…)
│   ├── lib/            # Third-party client instances (supabase.js)
│   ├── pages/
│   │   ├── admin/      # Admin-only pages
│   │   ├── portal/     # Member portal pages
│   │   └── public/     # Public-facing pages
│   ├── utils/          # Pure utility functions (formatDate, search, compressImage…)
│   ├── App.jsx         # Root router
│   └── main.jsx        # Entry point
├── supabase/
│   ├── functions/      # Edge Functions (paystack-init, paystack-verify)
│   └── migrations/     # Ordered SQL migration files (0001 → 0009)
├── docs/               # Project documentation and data backups
├── public/             # Static assets (logos, OG image)
├── index.html          # App shell with SEO meta tags
└── .env.example        # Environment variable template — copy to .env
```

---

## Deployment

The project auto-deploys to **Vercel** on every push to `main`.

**Manual deploy:**
```bash
npm run build
npx vercel --prod
```

Ensure your Vercel project has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set under **Project Settings → Environment Variables** in the Vercel dashboard.

---

## Common Issues

| Problem | Fix |
|---|---|
| Blank page after `npm run dev` | Check `.env` — missing or wrong Supabase credentials |
| `supabase db push` fails | Run `supabase link` first, then retry |
| Images not loading | Confirm Storage bucket policies in Supabase |
| iOS input zoom | Already handled — all inputs use `font-size: 16px` |

---

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make atomic, well-described commits
3. Open a pull request targeting `main`
4. Request a review before merging

---

## License

© NACOS KKU Vom Chapter. All rights reserved.
