import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShoppingListAndRelation1700000000001 implements MigrationInterface {
    name = 'AddShoppingListAndRelation1700000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if shopping_list table already exists
        const tableExists = await queryRunner.hasTable("shopping_list");
        
        // Only create the table if it doesn't exist
        if (!tableExists) {
            // For SQLite
            if (queryRunner.connection.options.type === 'sqlite') {
                await queryRunner.query(`
                    CREATE TABLE "shopping_list" (
                        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                        "title" varchar NOT NULL,
                        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
                    )
                `);
            } 
            // For PostgreSQL
            else {
                await queryRunner.query(`
                    CREATE TABLE "shopping_list" (
                        "id" SERIAL PRIMARY KEY,
                        "title" character varying NOT NULL,
                        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
                    )
                `);
            }
        }

        // Check if shopping_list_id column exists in grocery_item table
        const hasColumn = await queryRunner.hasColumn("grocery_item", "shopping_list_id");
        
        // Only add the column if it doesn't exist
        if (!hasColumn) {
            // For SQLite
            if (queryRunner.connection.options.type === 'sqlite') {
                await queryRunner.query(`
                    ALTER TABLE "grocery_item" ADD COLUMN "shopping_list_id" integer
                `);
            } 
            // For PostgreSQL
            else {
                await queryRunner.query(`
                    ALTER TABLE "grocery_item" ADD COLUMN "shopping_list_id" integer
                `);
                
                // Add foreign key constraint (SQLite doesn't support this well)
                await queryRunner.query(`
                    ALTER TABLE "grocery_item" 
                    ADD CONSTRAINT "FK_grocery_item_shopping_list" 
                    FOREIGN KEY ("shopping_list_id") 
                    REFERENCES "shopping_list"("id") 
                    ON DELETE CASCADE
                `);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // For PostgreSQL, drop the foreign key constraint first
        if (queryRunner.connection.options.type !== 'sqlite') {
            await queryRunner.query(`
                ALTER TABLE "grocery_item" DROP CONSTRAINT "FK_grocery_item_shopping_list"
            `);
        }
        
        // Drop the column
        await queryRunner.query(`
            ALTER TABLE "grocery_item" DROP COLUMN "shopping_list_id"
        `);
        
        // Drop the table
        await queryRunner.query(`DROP TABLE "shopping_list"`);
    }
} 