import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../../../../modules/users/domain/enums/role.enum';

const PERMISSION = 'help-requests:manage';
const ROLES: string[] = [Role.ADMINISTRADOR, Role.PERSONAL_CLENA];

export class HelpRequests1794900000000 implements MigrationInterface {
  name = 'HelpRequests1794900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "help_requests" ("id" uuid NOT NULL, "station_number" smallint, "guide_id" character varying(80), "guide_title" character varying(160), "step_number" smallint, "user_id" uuid, "requester_name" character varying(120), "status" character varying(20) NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "resolved_at" timestamptz, "resolved_by" uuid, CONSTRAINT "PK_help_requests" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_help_requests_status" ON "help_requests" ("status")`);
    await queryRunner.query(
      `ALTER TABLE "help_requests" ADD CONSTRAINT "FK_help_requests_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "help_requests" ADD CONSTRAINT "FK_help_requests_resolved_by" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "help_requests" ADD CONSTRAINT "FK_help_requests_guide" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
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
    await queryRunner.query(`ALTER TABLE "help_requests" DROP CONSTRAINT "FK_help_requests_guide"`);
    await queryRunner.query(`ALTER TABLE "help_requests" DROP CONSTRAINT "FK_help_requests_resolved_by"`);
    await queryRunner.query(`ALTER TABLE "help_requests" DROP CONSTRAINT "FK_help_requests_user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_help_requests_status"`);
    await queryRunner.query(`DROP TABLE "help_requests"`);
  }
}
