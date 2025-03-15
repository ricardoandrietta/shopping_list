import { DataSource, DataSourceOptions } from 'typeorm';
import { GroceryItem } from './src/entity/GroceryItem';
import { ShoppingList } from './src/entity/ShoppingList';
import { Product } from './src/entity/Product';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define configuration based on environment
const options: DataSourceOptions = process.env.NODE_ENV === 'production' 
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      entities: [GroceryItem, ShoppingList, Product],
      migrations: ['src/migrations/*.ts'],
      migrationsTableName: 'migrations'
    } 
  : {
      type: 'sqlite',
      database: 'grocery.sqlite',
      entities: [GroceryItem, ShoppingList, Product],
      migrations: ['src/migrations/*.ts'],
      migrationsTableName: 'migrations'
    };

// This configuration is used by TypeORM CLI for migrations
const dataSource = new DataSource(options);

export default dataSource; 