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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Grocery List API is running',
    endpoints: {
      groceries: '/api/groceries'
    }
  });
});

// Initialize database connection
if (process.env.NODE_ENV !== 'production') {
  // In development, initialize the database and start the server
  AppDataSource.initialize()
    .then(() => {
      const groceryRepository = AppDataSource.getRepository(GroceryItem);
      initializeRepository(groceryRepository);
      
      console.log('Database connection established');
      
      // Routes
      app.use('/api/groceries', groceryRoutes);
      
      // Start server
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(error => {
      console.error('Error during Data Source initialization', error);
    });
} else {
  // In production (Vercel), initialize the database but don't start the server
  // Migrations will be run by the vercel-build script
  AppDataSource.initialize()
    .then(() => {
      const groceryRepository = AppDataSource.getRepository(GroceryItem);
      initializeRepository(groceryRepository);
      console.log('Database connection established');
      
      // Routes
      app.use('/api/groceries', groceryRoutes);
    })
    .catch(error => {
      console.error('Error during Data Source initialization', error);
    });
}

// Export the Express app for Vercel
export default app; 