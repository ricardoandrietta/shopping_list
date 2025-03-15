import { DataSource } from 'typeorm';
import { GroceryItem } from '../entity/GroceryItem';
import { ShoppingList } from '../entity/ShoppingList';
import { Product } from '../entity/Product';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Development configuration (SQLite)
const developmentDataSource = new DataSource({
  type: 'sqlite',
  database: 'grocery.sqlite',
  entities: [GroceryItem, ShoppingList, Product],
  synchronize: false, // Disabled for now to avoid issues
  logging: process.env.NODE_ENV === 'development'
});

// Production configuration
// Note: You'll need to set these environment variables in your Vercel project
const productionDataSource = new DataSource({
  type: 'postgres', // You can change this to 'mysql' or 'mongodb' based on your preference
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for some cloud database providers
  },
  entities: [GroceryItem, ShoppingList, Product],
  synchronize: false, // Disabled for production - we'll use migrations instead
  logging: false,
  migrations: ['dist/migrations/*.js'], // Path to migration files
  migrationsTableName: 'migrations' // Table to store migration history
});

// Export the appropriate data source based on environment
export const AppDataSource = process.env.NODE_ENV === 'production' 
  ? productionDataSource 
  : developmentDataSource; 