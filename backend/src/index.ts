import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { GroceryItem } from './entity/GroceryItem';
import { ShoppingList } from './entity/ShoppingList';
import { Product } from './entity/Product';
import groceryRoutes, { initializeRepository } from './routes/groceryRoutes';
import shoppingListRoutes, { initializeRepositories } from './routes/shoppingListRoutes';
import productRoutes, { initializeRepository as initializeProductRepository } from './routes/productRoutes';

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
      groceries: '/api/groceries',
      shoppingLists: '/api/shopping-lists',
      products: '/api/products'
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
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connection initialized successfully');
    
    // Always run migrations since synchronize is disabled
    console.log('Running database migrations...');
    await AppDataSource.runMigrations();
    console.log('Migrations completed successfully');
    
    console.log('Getting repositories...');
    const groceryRepository = AppDataSource.getRepository(GroceryItem);
    const shoppingListRepository = AppDataSource.getRepository(ShoppingList);
    const productRepository = AppDataSource.getRepository(Product);
    
    console.log('Initializing repositories...');
    initializeRepository(groceryRepository);
    initializeRepositories(shoppingListRepository, groceryRepository);
    initializeProductRepository(productRepository);
    
    console.log('Database connection established');
    isDbInitialized = true;
  } catch (error) {
    console.error('Error during Data Source initialization', error);
    
    // Try to close the connection if it was opened
    if (AppDataSource.isInitialized) {
      try {
        await AppDataSource.destroy();
        console.log('Database connection closed after error');
      } catch (destroyError) {
        console.error('Failed to initialize database:', destroyError);
      }
    }
    
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

// Shopping list routes
app.use('/api/shopping-lists', async (req, res, next) => {
  try {
    // Initialize DB if not already initialized
    if (!isDbInitialized) {
      await initializeDb();
    }
    // Continue to the actual routes
    shoppingListRoutes(req, res, next);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Product routes
app.use('/api/products', async (req, res, next) => {
  try {
    // Initialize DB if not already initialized
    if (!isDbInitialized) {
      await initializeDb();
    }
    // Continue to the actual routes
    productRoutes(req, res, next);
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

// Initialize database for production (Vercel)
// This ensures the database is initialized before handling requests
initializeDb().catch(error => {
  console.error('Failed to initialize database:', error);
});

// Export the Express app for Vercel
export default app;

// For compatibility with CommonJS
module.exports = app; 