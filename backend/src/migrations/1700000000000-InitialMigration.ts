import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1700000000000 implements MigrationInterface {
    name = 'InitialMigration1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // For SQLite
        if (queryRunner.connection.options.type === 'sqlite') {
            await queryRunner.query(`
                CREATE TABLE "grocery_item" (
                    "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    "name" varchar NOT NULL,
                    "quantity" integer NOT NULL DEFAULT (1),
                    "price" float,
                    "barcode" varchar,
                    "purchased" boolean NOT NULL DEFAULT (0),
                    "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                    "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
                )
            `);
        } 
        // For PostgreSQL
        else {
            await queryRunner.query(`
                CREATE TABLE "grocery_item" (
                    "id" SERIAL PRIMARY KEY,
                    "name" character varying NOT NULL,
                    "quantity" integer NOT NULL DEFAULT 1,
                    "price" real,
                    "barcode" character varying,
                    "purchased" boolean NOT NULL DEFAULT false,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
                )
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "grocery_item"`);
    }
} 