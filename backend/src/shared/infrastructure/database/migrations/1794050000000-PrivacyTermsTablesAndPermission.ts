import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../../../../modules/users/domain/enums/role.enum';

const PERMISSION = 'privacy-terms:manage';
const ROLES: string[] = [Role.ADMINISTRADOR, Role.PERSONAL_CLENA];

export class PrivacyTermsTablesAndPermission1794050000000 implements MigrationInterface {
  name = 'PrivacyTermsTablesAndPermission1794050000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "privacy_terms" ("id" uuid NOT NULL, "version" character varying(32) NOT NULL, "effective_date" character varying(10) NOT NULL, "title" character varying(160) NOT NULL, CONSTRAINT "PK_privacy_terms" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "privacy_terms_sections" ("id" uuid NOT NULL, "privacy_terms_id" uuid NOT NULL, "title" character varying(160) NOT NULL, "paragraphs" jsonb NOT NULL, "display_order" integer NOT NULL, CONSTRAINT "PK_privacy_terms_sections" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_privacy_terms_sections_order" ON "privacy_terms_sections" ("privacy_terms_id", "display_order")`,
    );
    await queryRunner.query(
      `ALTER TABLE "privacy_terms_sections" ADD CONSTRAINT "FK_privacy_terms_sections_terms" FOREIGN KEY ("privacy_terms_id") REFERENCES "privacy_terms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // La semilla del contenido inicial la realiza PrivacyTermsSeedService para seguir el patrón de seeding.

    await queryRunner.query(
      `UPDATE "roles"
       SET "permissions" = CASE
         WHEN "permissions" = '' THEN $2::text
         ELSE "permissions" || ',' || $2::text
       END
       WHERE "role" = ANY($1::text[])
         AND NOT ($2::text = ANY(string_to_array("permissions", ',')))`,
      [ROLES, PERMISSION],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "roles"
       SET "permissions" = array_to_string(
         array_remove(string_to_array("permissions", ','), $2::text), ','
       )
       WHERE "role" = ANY($1::text[])
         AND $2::text = ANY(string_to_array("permissions", ','))`,
      [ROLES, PERMISSION],
    );
    await queryRunner.query(`ALTER TABLE "privacy_terms_sections" DROP CONSTRAINT "FK_privacy_terms_sections_terms"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_privacy_terms_sections_order"`);
    await queryRunner.query(`DROP TABLE "privacy_terms_sections"`);
    await queryRunner.query(`DROP TABLE "privacy_terms"`);
  }
}
