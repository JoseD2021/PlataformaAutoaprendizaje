import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../../../../modules/users/domain/enums/role.enum';

const PERMISSION = 'doubts:manage';
const ROLES: string[] = [Role.ADMINISTRADOR, Role.PERSONAL_CLENA];

/** Dudas que el personal anota cuando no hay una guía que las responda. */
export class Doubts1795000000000 implements MigrationInterface {
  name = 'Doubts1795000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "doubts" (
        "id" uuid NOT NULL,
        "question" character varying(300) NOT NULL,
        "normalized_question" character varying(300) NOT NULL,
        "category_id" uuid NOT NULL,
        "topic" character varying(80) NOT NULL,
        "times_count" integer NOT NULL DEFAULT 1,
        "last_asked_at" timestamptz NOT NULL DEFAULT now(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_doubts" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_doubts_times_count" CHECK ("times_count" > 0)
      )`,
    );
    // La misma duda (ignorando mayúsculas y espacios) sobre el mismo tema se cuenta una sola vez.
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_doubts_question_category" ON "doubts" ("normalized_question", "category_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_doubts_mas_preguntadas" ON "doubts" ("times_count" DESC, "last_asked_at" DESC)`,
    );
    await queryRunner.query(
      `ALTER TABLE "doubts" ADD CONSTRAINT "FK_doubts_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // Los roles ya sembrados no reciben el permiso nuevo solos: se agrega aquí.
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
    await queryRunner.query(`DROP TABLE "doubts"`);
  }
}
