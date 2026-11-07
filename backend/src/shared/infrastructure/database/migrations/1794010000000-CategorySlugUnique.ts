import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategorySlugUnique1794010000000 implements MigrationInterface {
  name = 'CategorySlugUnique1794010000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE UNIQUE INDEX "UQ_categories_slug" ON "categories" ("slug")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX "UQ_categories_slug"',
    );
  }
}
