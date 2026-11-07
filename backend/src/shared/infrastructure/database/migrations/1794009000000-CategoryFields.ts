import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryFields1794009000000 implements MigrationInterface {
  name = 'CategoryFields1794009000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "categories" RENAME COLUMN "iconUrl" TO "iconName"',
    );
    await queryRunner.query(
      'ALTER TABLE "categories" RENAME COLUMN "isActive" TO "isFeatured"',
    );
    await queryRunner.query(
      'ALTER TABLE "categories" DROP COLUMN "displayOrder"',
    );
    await queryRunner.query(
      'ALTER TABLE "categories" ADD "description" character varying(500) NOT NULL DEFAULT \'\'',
    );
    await queryRunner.query(
      'ALTER TABLE "categories" ALTER COLUMN "isFeatured" SET DEFAULT false',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "categories" DROP COLUMN "description"',
    );
    await queryRunner.query(
      'ALTER TABLE "categories" ADD "displayOrder" integer NOT NULL DEFAULT 0',
    );
    await queryRunner.query(
      'ALTER TABLE "categories" RENAME COLUMN "isFeatured" TO "isActive"',
    );
    await queryRunner.query(
      'ALTER TABLE "categories" ALTER COLUMN "isActive" DROP DEFAULT',
    );
    await queryRunner.query(
      'ALTER TABLE "categories" RENAME COLUMN "iconName" TO "iconUrl"',
    );
  }
}
