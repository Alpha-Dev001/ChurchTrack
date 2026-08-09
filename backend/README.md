<div align="center">

# ChurchTrack Backend

**Express + TypeScript API** for hall listings, bookings, admin auth, and Cloudinary uploads.

[← Back to project root](../README.md) · [Frontend docs](../frontend/README.md)

![Node.js](https://img.shields.io/badge/Node.js_18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

</div>

---

## What it does

- REST API for halls, bookings, settings, and admin authentication
- JWT-protected admin routes
- Multipart image upload → Cloudinary
- MongoDB via Mongoose (required)
- Seeds configured administrator accounts on first successful DB connection
- Provides protected super-admin insights and administrator-management APIs

---

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

---

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values. **Do not commit `.env`.**

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default `3000`) |
| `JWT_SECRET` | **Yes in production** | Signing key for admin JWTs |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `MONGO_DB_NAME` | No | Database name (default `sallehub`) |
| `CLOUDINARY_CLOUD_NAME` | For uploads | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | For uploads | API key |
| `CLOUDINARY_API_SECRET` | For uploads | API secret |
| `CLOUDINARY_UPLOAD_PRESET` | Optional | Unsigned upload preset if API key lacks create permission |
| `FRONTEND_URL` | Recommended | Frontend origin for CORS |
| `GEMINI_API_KEY` | No | Optional AI features |
| `SUPERADMIN_EMAIL` | Recommended | Private bootstrap super-admin email |
| `SUPERADMIN_PASSWORD` | Recommended | Private bootstrap super-admin password |

Example (placeholders only):

```env
PORT=3000
JWT_SECRET=change-me-to-a-long-random-secret
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER/sallehub
MONGO_DB_NAME=sallehub
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
SUPERADMIN_EMAIL=your-superadmin-email@example.com
SUPERADMIN_PASSWORD=replace-with-a-private-password
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with hot reload (`tsx`) |
| `npm run build` | Bundle to `dist/server.cjs` |
| `npm start` | Run production build |
| `npm run lint` | Typecheck (`tsc --noEmit`) |

```bash
npm run dev
# → http://localhost:3000
# → GET /health → { "status": "ok", "service": "sallehub-api" }
```

---

## Project structure

```
backend/
├── .env.example          # Safe template (commit this)
├── package.json
├── tsconfig.json
└── src/
    ├── server.ts         # Process entry
    ├── app.ts            # Express app, CORS, routes
    ├── config/
    │   └── env.ts        # Env loading & validation
    ├── controllers/      # Auth & stats handlers
    ├── middlewares/      # JWT, upload, errors
    ├── models/           # Mongoose models
    ├── routes/           # Route modules
    ├── services/         # Business logic (halls, bookings, Cloudinary, DB)
    └── utils/
```

---

## API overview

Base URL: `http://localhost:3000`

### Public

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/auth/login` | Admin login → JWT |
| `GET` | `/api/halls` | List halls |
| `GET` | `/api/halls/:id` | Hall details |
| `POST` | `/api/bookings` | Create booking request |
| `GET` | `/api/bookings/track/search?q=` | Public booking track search |
| `GET` | `/api/bookings/:id` | Public booking summary (or full if JWT) |
| `GET` | `/api/settings` | Public site settings |

### Admin (Bearer JWT)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/auth/me` | Current admin |
| `GET` | `/api/stats` | Dashboard stats |
| `POST` | `/api/halls` | Create hall (+ images) |
| `PUT` / `PATCH` | `/api/halls/:id` | Update hall |
| `DELETE` | `/api/halls/:id` | Delete hall |
| `GET` | `/api/bookings` | List all bookings |
| `PATCH` | `/api/bookings/:id/approve` | Approve booking |
| `PATCH` | `/api/bookings/:id/reject` | Reject booking |
| `PUT` | `/api/settings` | Update settings |

### Super-admin only (Bearer JWT with `role=superadmin`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/superadmin/insights` | System totals, service health, runtime data, and recent audit activity |
| `GET` | `/api/superadmin/admins` | List administrators without password hashes |
| `POST` | `/api/superadmin/admins` | Create an administrator or super administrator |
| `PUT` | `/api/superadmin/admins/:id` | Edit administrator identity, role, or password |
| `DELETE` | `/api/superadmin/admins/:id` | Remove an administrator with safety guards |

Auth header:

```http
Authorization: Bearer <token>
```

---

## Bootstrap access

Set `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD` in a private `backend/.env` or deployment secret store before the first database connection. The values are intentionally not documented here. If the account already exists, changing the environment variables does not overwrite its password; update it from the super-admin dashboard or database administration process.

---

## Deployment

1. Set all required env vars on the host (Render, Railway, Fly, VPS, etc.).
2. Ensure `NODE_ENV=production` and a strong `JWT_SECRET`.
3. Set `FRONTEND_URL` to your live frontend origin.
4. Build & start:

```bash
npm run build
npm start
```

---

## Security notes

- Never commit `backend/.env` or real Mongo / Cloudinary credentials
- Never commit bootstrap administrator email addresses or passwords
- Production refuses to start with the insecure default JWT secret
- Prefer Atlas IP allowlists and least-privilege DB users
- Rotate keys if they were ever shared or committed by mistake

---

## Related

- [Root README](../README.md)
- [Frontend README](../frontend/README.md)
- [Env template](./.env.example)
