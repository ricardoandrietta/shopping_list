import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1741994341713 implements MigrationInterface {
    name = 'CreateProductTable1741994341713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_grocery_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "price" float, "barcode" varchar, "purchased" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "shopping_list_id" integer, CONSTRAINT "FK_3efc27d80c74f1fca4343583025" FOREIGN KEY ("shopping_list_id") REFERENCES "shopping_list" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_grocery_item"("id", "name", "quantity", "price", "barcode", "purchased", "createdAt", "updatedAt", "shopping_list_id") SELECT "id", "name", "quantity", "price", "barcode", "purchased", "createdAt", "updatedAt", "shopping_list_id" FROM "grocery_item"`);
        await queryRunner.query(`DROP TABLE "grocery_item"`);
        await queryRunner.query(`ALTER TABLE "temporary_grocery_item" RENAME TO "grocery_item"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grocery_item" RENAME TO "temporary_grocery_item"`);
        await queryRunner.query(`CREATE TABLE "grocery_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "price" float, "barcode" varchar, "purchased" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "shopping_list_id" integer)`);
        await queryRunner.query(`INSERT INTO "grocery_item"("id", "name", "quantity", "price", "barcode", "purchased", "createdAt", "updatedAt", "shopping_list_id") SELECT "id", "name", "quantity", "price", "barcode", "purchased", "createdAt", "updatedAt", "shopping_list_id" FROM "temporary_grocery_item"`);
        await queryRunner.query(`DROP TABLE "temporary_grocery_item"`);
    }

}
