import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMigrationsTable1700000000002 implements MigrationInterface {
    name = 'CreateMigrationsTable1700000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if migrations table exists
        const migrationsTableExists = await queryRunner.hasTable("migrations");
        
        // Create migrations table if it doesn't exist
        if (!migrationsTableExists) {
            await queryRunner.createTable(
                new Table({
                    name: "migrations",
                    columns: [
                        {
                            name: "id",
                            type: "integer",
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: "increment"
                        },
                        {
                            name: "timestamp",
                            type: "bigint",
                            isNullable: false
                        },
                        {
                            name: "name",
                            type: "varchar",
                            isNullable: false
                        }
                    ]
                }),
                true
            );
            
            // Insert records for our previous migrations to mark them as completed
            await queryRunner.query(`
                INSERT INTO migrations (timestamp, name) 
                VALUES 
                (1700000000000, 'InitialMigration1700000000000'),
                (1700000000001, 'AddShoppingListAndRelation1700000000001')
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // We don't want to drop the migrations table in the down method
        // as it would cause issues with the migration system
    }
} 