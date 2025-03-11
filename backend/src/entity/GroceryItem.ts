import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 