# SpendWise — Personal Finance Manager

A full-stack personal finance management app: JWT authentication, income/expense
tracking, interactive analytics dashboards (charts), and budget monitoring.

**Stack:** React + Vite + Tailwind + Recharts (frontend) · Node.js + Express + MongoDB + JWT (backend)

```
spendwise/
├── server/     # Express + MongoDB REST API
└── client/     # React (Vite) frontend
```

## Features

- Secure JWT-based authentication (register/login, password hashing with bcrypt)
- Income & expense tracking with full CRUD and history
- Interactive analytics dashboard: income vs expense trend, spending by category
  (pie chart), monthly comparison (bar chart), summary cards
- Budget monitoring per category per month, with progress bars and over-budget alerts
- RESTful API with MongoDB (Mongoose) persistence
- Responsive UI (mobile-friendly nav, Tailwind CSS)

## 1. Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (free tier, cloud-hosted), or
  - a local MongoDB instance (`mongodb://localhost:27017/spendwise`)

## 2. Run locally

### Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env: set MONGO_URI and JWT_SECRET
npm run dev
```

The API runs at `http://localhost:5000`.

### Frontend

In a separate terminal:

```bash
cd client
npm install
cp .env.example .env
# VITE_API_URL should point at your backend, e.g. http://localhost:5000/api
npm run dev
```

The app runs at `http://localhost:5173`. Register a new account, then start
adding transactions and budgets.

## 3. Environment variables

**server/.env**

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin, used for CORS |

**client/.env**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

## 4. API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/auth/me` | Get current user (auth required) |
| GET/POST | `/api/transactions` | List / create transactions |
| PUT/DELETE | `/api/transactions/:id` | Update / delete a transaction |
| GET/POST | `/api/budgets` | List / create budgets |
| PUT/DELETE | `/api/budgets/:id` | Update / delete a budget |
| GET | `/api/analytics/summary` | Monthly income/expense/balance summary |
| GET | `/api/analytics/by-category` | Spending breakdown by category |
| GET | `/api/analytics/trend` | Income/expense trend over N months |
| GET | `/api/analytics/budget-status` | Budget vs actual spend per category |

All routes except register/login require an `Authorization: Bearer <token>` header.

## 5. Deploying to GitHub

### Push the code to a new GitHub repository

```bash
cd spendwise
git init
git add .
git commit -m "Initial commit: SpendWise full-stack app"
git branch -M main
git remote add origin https://github.com/<your-username>/spendwise.git
git push -u origin main
```

(Create the empty repo first at https://github.com/new — don't initialize it
with a README so there's no merge conflict, or use `git pull --rebase origin main`
if you did.)

Your `.env` files are already git-ignored, so secrets won't be committed —
double check with `git status` before your first commit.

### 6. Deploying the live app (optional, beyond just GitHub)

Hosting on GitHub itself only stores the code — GitHub Pages can't run the
Node backend or connect to MongoDB. To have a live, working app:

1. **Database:** Create a free cluster on MongoDB Atlas, add a database user,
   whitelist `0.0.0.0/0` (or your host's IPs), and copy the connection string
   into `MONGO_URI`.
2. **Backend:** Deploy the `server/` folder to a Node host such as Render,
   Railway, or Fly.io. Set the environment variables from `server/.env` in
   that platform's dashboard. Note the deployed API URL.
3. **Frontend:** Deploy the `client/` folder to Vercel, Netlify, or GitHub
   Pages (Pages needs `vite build` output in a `gh-pages` branch or use the
   `gh-pages` npm package). Set `VITE_API_URL` to your deployed backend URL.
4. **CORS:** Update `CLIENT_URL` in the backend's environment to your deployed
   frontend URL so the browser isn't blocked by CORS.

Ask if you'd like step-by-step instructions for any specific host (Render,
Vercel, Railway, etc.) — the exact steps vary slightly by provider.
