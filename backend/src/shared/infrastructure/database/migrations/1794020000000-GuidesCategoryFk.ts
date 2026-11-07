import { MigrationInterface, QueryRunner } from 'typeorm';

export class GuidesCategoryFk1794020000000 implements MigrationInterface {
  name = 'GuidesCategoryFk1794020000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "guides" WHERE "category_id" NOT IN (SELECT "id"::text FROM "categories")`,
    );
    await queryRunner.query(
      `ALTER TABLE "guides" ALTER COLUMN "category_id" TYPE uuid USING "category_id"::uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "guides" ADD CONSTRAINT "FK_guides_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "guides" DROP CONSTRAINT "FK_guides_category"`);
    await queryRunner.query(
      `ALTER TABLE "guides" ALTER COLUMN "category_id" TYPE character varying(64) USING "category_id"::text`,
    );
  }
}