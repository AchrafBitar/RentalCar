# Rental Car MVP (Rabat Agdal)

A modular monolith car rental application built with **React, Express, Prisma, and PostgreSQL**.

## Architecture
The application follows a clean, "production-ready" modular monolith architecture:

### Backend (`server/`)
-   **Structure:**
    -   `controllers/`: Handle HTTP requests and responses. strict separation from DB.
    -   `services/`: Contain business logic.
    -   `repositories/`: Handle all database interactions (Prisma).
    -   `routes/`: API endpoint definitions.
-   **Tech:** Express.js, Prisma ORM, PostgreSQL.
-   **Flow:** Route -> Controller -> Service -> Repository -> Database.

### Frontend (`client/`)
-   **Structure:**
    -   `components/`: Reusable UI components (Navbar, etc.).
    -   `pages/`: Route components (Home, CarList, Booking).
-   **Tech:** React, Vite, Tailwind CSS (v4).
-   **Design:** Modern, responsive, and inviting UI with generic "premium" aesthetics.

## Prerequisites
-   Node.js (v18+)
-   PostgreSQL (or configured connection string)

## Setup
### 1. Backend
```bash
cd server
npm install
npx prisma generate
# Create a .env file with DATABASE_URL
npm run dev
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

## Features
-   **Landing Page:** Captivating hero section with brand slogan.
-   **Car Listing:** Browse available cars with pricing.
-   **Booking:** Simple booking form for selected cars.
-   **API:** RESTful API for cars and booking management.

## Deployment
-   Frontend: Netlify/Vercel
-   Backend: Railway (Express) + Managed Postgres
