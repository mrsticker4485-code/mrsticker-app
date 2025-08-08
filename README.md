# Mr. Sticker — Full Stack (Backend + Frontend)

## Backend (Node/Express/MongoDB)
- Configure `.env` (copy from `.env.example`):
```
MONGODB_URI=
DB_NAME=mrsticker_production
JWT_SECRET=change-me-please-32-characters-min
CORS_ORIGIN=http://localhost:5173
PORT=8080
```
- Install & run:
```
cd backend
npm install
npm run dev
```

## Frontend (React + Vite)
- Configure `.env` (copy from `.env.example` and set API base):
```
VITE_API_BASE=http://localhost:8080
```
- Install & run:
```
cd frontend
npm install
npm run dev
```

## First user
Use `/api/auth/register` to create the first user (POST JSON `{ "email": "...", "password": "..." }`), then login via UI.

## Deploy
- **Railway (backend)**: Set environment variables from `.env.example`.
- **Netlify (frontend)**: Build command `npm run build`, publish `dist/`, and set env `VITE_API_BASE` to your Railway API URL.
