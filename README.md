# V-Chron Frontend

Healthcare Attendance Tracking System — React frontend.

## Stack

| Tool | Version | Purpose |
| :--- | :--- | :--- |
| React | 19 | UI framework |
| Vite | 6 | Build tool (replaces CRA/craco) |
| React Router | 7 | Client-side routing |
| Tailwind CSS | 3 | Utility-first styling |
| Shadcn UI / Radix | Latest | Accessible component primitives |
| react-day-picker | 9 | Date picker (date-fns v4 native) |
| date-fns | 4 | Date utilities |
| ESLint | 9 | Linting (flat config) |
| localforage | 1.10 | Offline attendance storage |

## Getting Started

```bash
npm install
cp .env.example .env        # set VITE_BACKEND_URL
npm run dev                 # http://localhost:3000
```

## Build

```bash
npm run build               # outputs to dist/
npm run preview             # preview production build locally
```

## Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | Fastify backend base URL | `https://your-backend.vercel.app` |

## Vercel Deployment

Set `VITE_BACKEND_URL` in Vercel project settings → Environment Variables.
No additional configuration needed — Vite is auto-detected by Vercel.

## Pages

| Route | Page | Access |
| :--- | :--- | :--- |
| `/` | Landing | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Attendance Dashboard | Authenticated |
| `/history` | Attendance History | Authenticated |
| `/admin` | Admin Dashboard | Admin / Superuser |
| `/superuser` | Superuser Dashboard | Superuser only |
