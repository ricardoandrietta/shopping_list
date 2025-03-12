import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { GroceryItem } from './entity/GroceryItem';
import groceryRoutes, { initializeRepository } from './routes/groceryRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

// Simple text response for the root route
app.get('/', (req, res) => {
  res.send('Hello from the Grocery List API!');
});

// JSON info endpoint
app.get('/info', (req, res) => {
  res.json({
    message: 'Grocery List API is running',
    endpoints: {
      groceries: '/api/groceries'
    }
  });
});

// Database connection state
let isDbInitialized = false;

// Initialize database connection
const initializeDb = async () => {
  // Only initialize once
  if (isDbInitialized) return;
  
  try {
    await AppDataSource.initialize();
    const groceryRepository = AppDataSource.getRepository(GroceryItem);
    initializeRepository(groceryRepository);
    console.log('Database connection established');
    isDbInitialized = true;
  } catch (error) {
    console.error('Error during Data Source initialization', error);
    throw error;
  }
};

// Routes with lazy initialization
app.use('/api/groceries', async (req, res, next) => {
  try {
    // Initialize DB if not already initialized
    if (!isDbInitialized) {
      await initializeDb();
    }
    // Continue to the actual routes
    groceryRoutes(req, res, next);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server in development mode only
if (process.env.NODE_ENV !== 'production') {
  // Initialize DB and start server
  initializeDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(error => {
    console.error('Failed to start server:', error);
  });
}

// Export the Express app for Vercel
export default app;

// For compatibility with CommonJS
module.exports = app; 