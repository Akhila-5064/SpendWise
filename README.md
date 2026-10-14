# SpendWise — Personal Finance Manager

SpendWise is a full-stack personal finance management application that helps users track income and expenses, monitor monthly budgets, and understand their spending habits through interactive analytics dashboards.

## Features

- **User Authentication:** Register and log in securely using JWT authentication and bcrypt password hashing.
- **Transaction Management:** Add, view, update, and delete income and expense transactions.
- **Interactive Analytics:** Visualize income and expenses over time, spending by category, and monthly comparisons using charts.
- **Budget Monitoring:** Create monthly category budgets, track spending progress, and identify over-budget categories.
- **REST API:** Communicate between the frontend and backend through RESTful API endpoints.
- **Database Persistence:** Store user, transaction, and budget data in MongoDB using Mongoose.
- **Responsive UI:** Use the application on desktop and mobile screens.

## Technology Stack

| Layer          | Technologies                        |
| -------------- | ----------------------------------- |
| Frontend       | React, Vite, Tailwind CSS, Recharts |
| Backend        | Node.js, Express.js                 |
| Database       | MongoDB, Mongoose                   |
| Authentication | JSON Web Tokens (JWT), bcryptjs     |
| API            | REST                                |

## Project Structure

```text
SpendWise/
├── client/              # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── .env.example
├── server/              # Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js and npm
- MongoDB installed locally or a MongoDB Atlas account
- Git (optional, for cloning and pushing changes)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Akhila-5064/SpendWise.git
cd SpendWise
```

### 2. Configure the backend

Open a terminal in the project root:

```bash
cd server
npm install
```

Create the environment file by copying `.env.example`.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS, Linux, or Git Bash:**

```bash
cp .env.example .env
```

Update `server/.env` with your configuration:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/spendwise
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Use your actual MongoDB Atlas connection string if you are using Atlas instead of a local MongoDB instance.

Start the backend:

```bash
npm run dev
```

The backend is expected to run at `http://localhost:5001`, based on the current configuration.

### 3. Configure the frontend

Open a **second terminal** in the project root:

```bash
cd client
npm install
```

Create the frontend environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS, Linux, or Git Bash:**

```bash
cp .env.example .env
```

Set the API URL in `client/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

Register an account and start managing your transactions and budgets.

## Environment Variables

### Backend — `server/.env`

| Variable         | Description                                         |
| ---------------- | --------------------------------------------------- |
| `PORT`           | Backend server port; currently configured as `5001` |
| `MONGO_URI`      | MongoDB connection string                           |
| `JWT_SECRET`     | Secret used to sign and verify JWTs                 |
| `JWT_EXPIRES_IN` | JWT lifetime, for example `7d`                      |
| `CLIENT_URL`     | Frontend origin used for CORS                       |

### Frontend — `client/.env`

| Variable       | Description                                   |
| -------------- | --------------------------------------------- |
| `VITE_API_URL` | Base URL of the backend API, including `/api` |

**Security:** Never commit actual `.env` files, database credentials, or JWT secrets. Use strong secrets and configure production environment variables through your hosting provider.

## API Documentation

All routes require an `Authorization: Bearer <token>` header, except the registration and login endpoints and any explicitly public routes.

### Authentication

| Method | Endpoint             | Description                                   |
| ------ | -------------------- | --------------------------------------------- |
| POST   | `/api/auth/register` | Register a new account                        |
| POST   | `/api/auth/login`    | Log in and receive a JWT                      |
| GET    | `/api/auth/me`       | Retrieve the authenticated user's information |

### Transactions

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| GET    | `/api/transactions`     | Retrieve transactions           |
| GET    | `/api/transactions/:id` | Retrieve a specific transaction |
| POST   | `/api/transactions`     | Create a transaction            |
| PUT    | `/api/transactions/:id` | Update a transaction            |
| DELETE | `/api/transactions/:id` | Delete a transaction            |

### Budgets

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| GET    | `/api/budgets`     | Retrieve budgets |
| POST   | `/api/budgets`     | Create a budget  |
| PUT    | `/api/budgets/:id` | Update a budget  |
| DELETE | `/api/budgets/:id` | Delete a budget  |

### Analytics

| Method | Endpoint                       | Description                                    |
| ------ | ------------------------------ | ---------------------------------------------- |
| GET    | `/api/analytics/summary`       | Retrieve monthly income, expenses, and balance |
| GET    | `/api/analytics/by-category`   | Retrieve spending breakdown by category        |
| GET    | `/api/analytics/trend`         | Retrieve income and expense trends             |
| GET    | `/api/analytics/budget-status` | Compare budgets with actual spending           |

*Note: This API table documents the intended endpoints. Confirm each path and method against the implementation before relying on it as a complete API reference.*

## Deployment

The application can be deployed by hosting its frontend, backend, and database separately.

1. **Database:** Configure a MongoDB Atlas cluster and set the production `MONGO_URI`.
2. **Backend:** Deploy the `server/` application to a Node.js hosting provider such as Render or Railway. Configure the required environment variables.
3. **Frontend:** Deploy the `client/` application to a frontend hosting provider such as Vercel or Netlify. Set `VITE_API_URL` to the deployed backend API URL.
4. **CORS:** Configure `CLIENT_URL` to match the deployed frontend origin.

For production, use HTTPS, strong secrets, appropriate database access restrictions, and production-ready CORS settings. Test authentication and the main application features after deployment.

Deployment requires additional configuration; these instructions do not imply that a live instance is currently available.

