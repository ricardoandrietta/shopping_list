# Items to Buy

A full-stack web application for managing shopping lists and items to buy. The application is built with a Vue.js frontend and Node.js/Express backend, using SQLite as the database.

## Project Structure

```
items_to_buy/
├── frontend/         # Vue.js frontend application
│   ├── src/         # Source files
│   └── public/      # Static assets
└── backend/         # Express.js backend application
    ├── src/         # Source files
    └── grocery.sqlite # SQLite database
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
- SQLite3
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

## Features

- Shopping list management
- QR code scanning functionality
- Real-time updates
- Responsive design
- SQLite database for data persistence

## License

This project is licensed under the MIT License - see the LICENSE file for details. 