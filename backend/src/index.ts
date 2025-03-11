import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { GroceryItem } from './entity/GroceryItem';
import groceryRoutes, { initializeRepository } from './routes/groceryRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create TypeORM connection
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'grocery.sqlite',
  entities: [GroceryItem],
  synchronize: true,
  logging: true
});

// Initialize database connection
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