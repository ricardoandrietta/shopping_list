# Items to Buy

A full-stack web application for managing shopping lists and items to buy. The application is built with a Vue.js frontend and Node.js/Express backend, using SQLite for development and PostgreSQL for production.

## Project Structure

```
items_to_buy/
├── frontend/         # Vue.js frontend application
│   ├── src/         # Source files
│   └── public/      # Static assets
└── backend/         # Express.js backend application
    ├── src/         # Source files
    │   ├── migrations/  # Database migrations
    │   └── entity/      # TypeORM entities
    ├── typeorm.config.ts # TypeORM configuration for migrations
    └── grocery.sqlite # SQLite database (development only)
```

## Technologies Used

### Frontend
- Vue.js 3
- TypeScript
- Vite
- Pinia (State Management)
- Vue Router
- Tailwind CSS
- HTML5-QRCode (for QR code scanning)
- Axios (for API requests)

### Backend
- Node.js
- Express.js
- TypeScript
- TypeORM
- SQLite3 (development)
- PostgreSQL (production)
- CORS

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd items_to_buy
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the values as needed

## Development

### Running the Backend
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:3000` (or your configured port)

### Running the Frontend
```bash
cd frontend
npm run dev
```
The frontend development server will start on `http://localhost:5173`

## Database Migrations

The project uses TypeORM migrations to manage database schema changes.

### Generate a Migration

After making changes to entity files, generate a migration:

```bash
cd backend
npm run migration:generate -- src/migrations/MigrationName
```

### Run Migrations

To apply pending migrations:

```bash
cd backend
npm run migration:run
```

### Revert Migrations

To revert the most recent migration:

```bash
cd backend
npm run migration:revert
```

## Building for Production

### Backend
```bash
cd backend
npm run build
```

### Frontend
```bash
cd frontend
npm run build
```

## Deployment to Vercel

The backend is configured for deployment to Vercel:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Set the following environment variables in Vercel:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `CORS_ORIGIN`: Your frontend URL

Migrations will automatically run during the build process.

## Features

- Shopping list management
- QR code scanning functionality
- Real-time updates
- Responsive design
- Database persistence with SQLite (dev) and PostgreSQL (prod)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 