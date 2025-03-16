import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1742025866578 implements MigrationInterface {
    name = 'CreateProductTable1742025866578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // For SQLite
        if (queryRunner.connection.options.type === 'sqlite') {
            await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "name" varchar NOT NULL, "brand" varchar, "price" float, "barcode" varchar, "favorite" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        } 
        // For PostgreSQL
        else {
            await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL PRIMARY KEY, "user_id" integer NOT NULL, "name" character varying NOT NULL, "brand" character varying, "price" real, "barcode" character varying, "favorite" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now())`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
    }
}
