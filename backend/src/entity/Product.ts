import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  brand!: string | null;

  @Column({ type: 'float', nullable: true })
  price!: number | null;

  @Column({ type: 'varchar', nullable: true })
  barcode!: string | null;

  @Column({ type: 'boolean', default: false })
  favorite!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 