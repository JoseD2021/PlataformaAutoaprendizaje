import { MigrationInterface, QueryRunner } from 'typeorm';

export class GuidesTables1793930000000 implements MigrationInterface {
  name = 'GuidesTables1793930000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "guides" ("id" character varying(80) NOT NULL, "title" character varying(160) NOT NULL, "category_id" character varying(64) NOT NULL, "estimated_minutes" integer NOT NULL, "is_most_requested" boolean NOT NULL DEFAULT false, "tag" character varying(120), "status" character varying(16) NOT NULL DEFAULT 'draft', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_guides" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_guides_category_id" ON "guides" ("category_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_guides_status" ON "guides" ("status")`);
    await queryRunner.query(
      `CREATE TABLE "guide_steps" ("id" uuid NOT NULL, "guide_id" character varying(80) NOT NULL, "position" integer NOT NULL, "short_title" character varying(20) NOT NULL, "action" character varying(200) NOT NULL, "description" text NOT NULL, "image_url" character varying(512), "image_caption" character varying(255), CONSTRAINT "PK_guide_steps" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_guide_steps_guide_position" ON "guide_steps" ("guide_id", "position")`,
    );
    await queryRunner.query(
      `ALTER TABLE "guide_steps" ADD CONSTRAINT "FK_guide_steps_guide" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "guide_steps" DROP CONSTRAINT "FK_guide_steps_guide"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_guide_steps_guide_position"`);
    await queryRunner.query(`DROP TABLE "guide_steps"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_guides_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_guides_category_id"`);
    await queryRunner.query(`DROP TABLE "guides"`);
  }
}