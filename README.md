<div align="center">
<img width="1200" height="475" alt="SalleHub Banner" src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80" />
</div>

# SalleHub - Church Hall Booking & Management Platform

A modern church hall booking and management platform featuring a public visitor booking website and a premium admin management dashboard.

## Architecture

The project is split into **two independent applications** that can run on separate servers:

- **Backend**: Express.js + TypeScript API server (port 3000)
- **Frontend**: React + Vite + Tailwind CSS (port 5173)

## Prerequisites

- Node.js 18+ 
- npm

## Quick Start

### 1. Install dependencies

```bash
# From the project root, install both frontend and backend
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

**Backend** (`backend/.env` - already created with defaults):
```
PORT=3000
JWT_SECRET=sallehub-super-secure-jwt-secret-key-2026
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env` - already created with defaults):
```
VITE_API_URL=http://localhost:3000
```

### 3. Run the applications

**Option A: Run both (two terminal windows)**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option B: Run from root**
```bash
npm run dev:backend   # Start backend only
npm run dev:frontend  # Start frontend only
```

### 4. Access the applications

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### 5. Default Admin Credentials

- **Email**: admin@sallehub.rw
- **Password**: admin123

## Project Structure

```
sallehub/
├── backend/                  # Express.js API server
│   ├── .env                  # Backend environment variables
│   ├── package.json
│   ├── tsconfig.json
│   ├── server-db.json        # JSON file database (default storage)
│   └── src/
│       ├── server.ts         # Entry point
│       ├── app.ts            # Express app with CORS
│       ├── config/
│       │   └── env.ts        # Environment config
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       └── utils/
│
├── frontend/                 # React + Vite UI
│   ├── .env                  # Frontend environment variables
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── App.tsx           # Main app with routing
│       ├── lib/
│       │   └── api.ts        # API client (uses VITE_API_URL)
│       ├── components/
│       ├── pages/
│       └── types.ts
│
├── .env.example              # Environment variable template
└── package.json              # Root scripts
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/auth/me` | JWT | Get current admin |
| GET | `/api/stats` | No | Dashboard statistics |
| GET | `/api/halls` | No | List all halls |
| GET | `/api/halls/:id` | No | Get hall details |
| POST | `/api/halls` | JWT | Create a hall |
| PUT | `/api/halls/:id` | JWT | Update a hall |
| PATCH | `/api/halls/:id` | JWT | Partial update hall |
| DELETE | `/api/halls/:id` | JWT | Delete a hall |
| GET | `/api/bookings` | No | List all bookings |
| GET | `/api/bookings/:id` | No | Get booking details |
| POST | `/api/bookings` | No | Create a booking |
| PATCH | `/api/bookings/:id/approve` | JWT | Approve booking |
| PATCH | `/api/bookings/:id/reject` | JWT | Reject booking |
| POST | `/api/admin/reset-db` | No | Reset database |

## Deployment

### Backend Deployment
1. Build: `cd backend && npm run build`
2. Set environment variables on your hosting platform
3. Start: `npm run start` (runs the compiled server)

### Frontend Deployment
1. Build: `cd frontend && npm run build`
2. Set `VITE_API_URL` to your backend URL in the hosting platform
3. Deploy the `dist/` folder to any static host (Vercel, Netlify, etc.)

## Features

- **Public**: Browse halls, filter & sort, book venues, track bookings
- **Admin**: Dashboard with stats, manage halls, approve/reject bookings, settings
- **Trilingual**: English, French, Kinyarwanda
- **Responsive**: Mobile-first design with admin sidebar and bottom navigation