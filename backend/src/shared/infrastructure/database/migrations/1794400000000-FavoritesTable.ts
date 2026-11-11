import { MigrationInterface, QueryRunner } from 'typeorm';

export class FavoritesTable1794400000000 implements MigrationInterface {
  name = 'FavoritesTable1794400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "favorites" ("user_id" uuid NOT NULL, "guide_id" character varying(80) NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), CONSTRAINT "PK_favorites" PRIMARY KEY ("user_id", "guide_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_favorites_guide_id" ON "favorites" ("guide_id")`);
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_guide" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_guide"`);
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_favorites_guide_id"`);
    await queryRunner.query(`DROP TABLE "favorites"`);
  }
}
