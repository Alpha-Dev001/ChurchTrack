<div align="center">

# ChurchTrack

**Parish services platform: ChurchTrack weddings and SalleHub halls**

A public booking experience for visitors, an operations dashboard for parish coordinators, and a protected super-admin command center for complete platform oversight.

[Features](#features) · [Quick start](#quick-start) · [Frontend](./frontend/README.md) · [Backend](./backend/README.md)

<br />

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## Overview

ChurchTrack is split into two independent apps so you can deploy the API and the UI on separate hosts. It provides two services: ChurchTrack wedding ceremony bookings and SalleHub parish hall reservations:

| App | Stack | Default port | Docs |
|-----|--------|--------------|------|
| **Backend** | Express · TypeScript · MongoDB · Cloudinary | `3000` | [backend/README.md](./backend/README.md) |
| **Frontend** | React · Vite · Tailwind CSS | `5173` | [frontend/README.md](./frontend/README.md) |

```
sallehub/
├── backend/          # REST API (Express + MongoDB)
├── frontend/         # Public site + admin dashboard
├── backend/.env.example  # Backend env reference (no secrets)
├── frontend/.env.example # Frontend env reference (no secrets)
└── package.json      # Convenience scripts for both apps
```

---

## Features

**Public site**
- Browse and filter parish halls
- View hall details, capacity, pricing, and availability context
- Submit booking requests
- Track booking status
- English · French · Kinyarwanda

**Admin dashboard**
- Stats overview
- Hall CRUD with Cloudinary image uploads
- Booking approve / reject workflow
- Calendar view
- Site settings

**Super-admin command center**
- Live totals for administrators, halls, bookings, revenue, and pending work
- API, database, runtime, memory, and Cloudinary configuration health indicators
- Recent booking/audit activity visibility
- Create, edit, promote, and delete administrator accounts
- Full access to all standard admin hall, booking, calendar, and settings workflows
- Same English · French · Kinyarwanda language system

---

## Prerequisites

- **Node.js** 18+
- **npm**
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account (for hall image uploads)

---

## Quick start

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/sallehub.git
cd sallehub

npm run install:all
# or:
# cd backend && npm install && cd ../frontend && npm install
```

### 2. Environment files

Copy the examples and fill in **your own** values. Never commit real `.env` files.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**Minimal local setup**

`backend/.env`
```env
PORT=3000
JWT_SECRET=change-me-to-a-long-random-secret
MONGO_URI=mongodb://127.0.0.1:27017/sallehub
MONGO_DB_NAME=sallehub
FRONTEND_URL=http://localhost:5173
# Cloudinary keys required to upload hall images
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`frontend/.env`
```env
VITE_API_URL=http://localhost:3000
```

See [`backend/.env.example`](./backend/.env.example) and [`frontend/.env.example`](./frontend/.env.example) for the full list of variables.

### 3. Run locally

Two terminals (or use the root scripts):

```bash
# Terminal 1 — API
npm run dev:backend

# Terminal 2 — UI
npm run dev:frontend
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Health check | http://localhost:3000/health |

### 4. Bootstrap administrators

On first MongoDB connection, the API seeds administrator accounts when they do not already exist. Configure the super-admin bootstrap account privately with `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD` in `backend/.env`; never place those values in README files, `.env.example`, source control, or screenshots. The super-admin signs in at `/admin` and is redirected to `/admin/super`.

Standard administrators are restricted to operational workflows. Super-admin-only endpoints are protected server-side and cannot be reached by changing frontend routes.

---

## Deployment

### Backend

1. Set env vars on your host (`MONGO_URI`, `JWT_SECRET`, Cloudinary, `FRONTEND_URL`, etc.).
2. Build and start:

```bash
cd backend
npm run build
npm start
```

### Frontend

1. Set `VITE_API_URL` to your live API URL **at build time**.
2. Build and deploy `frontend/dist` (Vercel, Netlify, etc.):

```bash
cd frontend
npm run build
```

`frontend/vercel.json` already includes SPA rewrites for client-side routing.

---

## Security checklist (before GitHub / production)

- [x] Real `.env` files are gitignored
- [ ] `JWT_SECRET` is a unique strong value (not the example placeholder)
- [ ] MongoDB user has a strong password; URI is never committed
- [ ] Cloudinary keys live only in host env / secrets manager
- [ ] Default admin password is changed
- [ ] `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD` are set only in the deployment secret store
- [ ] `FRONTEND_URL` matches your production frontend origin
- [ ] `NODE_ENV=production` on the API host

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 19, React Router, Vite, Tailwind CSS 4, Motion, Zod, React Hook Form |
| Backend | Express, TypeScript, Mongoose, JWT, bcrypt, Multer, Cloudinary |
| Data | MongoDB |
| Media | Cloudinary |

---

## Contributing

1. Fork the repo and create a feature branch
2. Keep secrets out of commits — use `.env.example` only
3. Open a pull request with a clear description

---

## License

Private / all rights reserved unless a license file is added to this repository.

---

<div align="center">

Made for parish venue management · [Frontend docs](./frontend/README.md) · [Backend docs](./backend/README.md)

</div>
