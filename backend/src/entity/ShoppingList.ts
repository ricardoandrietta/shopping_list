import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { GroceryItem } from './GroceryItem';

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => GroceryItem, groceryItem => groceryItem.shoppingList, {
    cascade: true
  })
  items!: GroceryItem[];
} 