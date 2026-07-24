<div align="center">

# SalleHub Frontend

**React + Vite** public booking site and admin dashboard for parish halls.

[← Back to project root](../README.md) · [Backend docs](../backend/README.md)

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## What it does

**Visitors**
- Landing page and hall catalogue
- Hall details and booking request flow
- Booking tracking
- UI in English, French, and Kinyarwanda

**Admins** (`/admin`)
- Login and protected dashboard
- Hall management (including image upload via API → Cloudinary)
- Booking approvals and calendar
- Site settings

---

## Prerequisites

- Node.js 18+
- Running [SalleHub backend](../backend/README.md) (or a deployed API URL)

---

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes* | Backend base URL, no trailing slash |

\* Defaults to `http://localhost:3000` if unset (local only).

```env
VITE_API_URL=http://localhost:3000
```

Production example:

```env
VITE_API_URL=https://your-api.example.com
```

> Vite embeds `VITE_*` values at **build time**. Change the env, then rebuild for production deploys.

**Do not commit `.env`.** Only `.env.example` belongs in git.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on `0.0.0.0:5173` |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build (`4173`) |
| `npm run lint` | Typecheck (`tsc --noEmit`) |

```bash
npm run dev
# → http://localhost:5173
```

---

## Project structure

```
frontend/
├── .env.example
├── index.html
├── package.json
├── vite.config.ts
├── vercel.json          # SPA rewrites for Vercel
├── public/              # favicon, robots, sitemap
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── components/      # Navbar, Footer, HallCard, SEO, …
    ├── contexts/        # Auth, language, data
    ├── lib/             # API client, schemas, helpers
    ├── pages/           # Visitor + admin pages
    ├── translations/
    └── types.ts
```

---

## Main routes

| Path | Audience | Description |
|------|----------|-------------|
| `/` | Public | Landing |
| `/catalogue` | Public | Hall catalogue |
| `/halls/:hallId` | Public | Hall details |
| `/booking` | Public | Booking request |
| `/track` | Public | Track booking |
| `/success` | Public | Booking submitted |
| `/admin` | Admin | Login |
| `/admin/dashboard` | Admin | Stats |
| `/admin/halls` | Admin | Hall list |
| `/admin/halls/add` | Admin | Create hall |
| `/admin/bookings` | Admin | Bookings |
| `/admin/calendar` | Admin | Calendar |
| `/admin/settings` | Admin | Settings |

---

## Talking to the API

All relative `/api/...` calls go through `src/lib/api.ts`, which prefixes `VITE_API_URL`.

Ensure the backend `FRONTEND_URL` (and CORS allowlist) includes your frontend origin, e.g. `http://localhost:5173` or your Vercel domain.

---

## Deployment

### Vercel (recommended)

1. Set project root to `frontend` (or deploy this folder as its own project).
2. Add env: `VITE_API_URL` = your live API URL.
3. Build command: `npm run build`
4. Output directory: `dist`

`vercel.json` rewrites all routes to `index.html` for client-side routing.

### Any static host

```bash
npm run build
# upload / serve the dist/ folder
```

---

## Local admin access

Use the credentials seeded by the backend (see [backend README](../backend/README.md)). Change them before production.

---

## Security notes

- Only `VITE_*` variables are exposed to the browser — never put secrets (JWT, Mongo URI, Cloudinary secret) in frontend env
- Keep production `VITE_API_URL` pointed at HTTPS
- Admin JWT is stored client-side for session use; protect the admin password

---

## Related

- [Root README](../README.md)
- [Backend README](../backend/README.md)
- [Env template](./.env.example)
