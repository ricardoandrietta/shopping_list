import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShoppingList } from './ShoppingList';

@Entity()
export class GroceryItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ default: 1 })
  quantity!: number;

  @Column({ type: 'float', nullable: true })
  price!: number | null;

  @Column({ type: 'varchar', nullable: true })
  barcode!: string | null;

  @Column({ default: false })
  purchased!: boolean;

  @ManyToOne(() => ShoppingList, shoppingList => shoppingList.items, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'shopping_list_id' })
  shoppingList!: ShoppingList;

  @Column({ nullable: true })
  shopping_list_id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 