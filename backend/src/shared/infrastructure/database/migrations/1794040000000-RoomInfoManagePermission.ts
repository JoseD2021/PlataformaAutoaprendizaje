import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../../../../modules/users/domain/enums/role.enum';

const PERMISSION = 'room-info:manage';
const ROLES: string[] = [Role.ADMINISTRADOR, Role.PERSONAL_CLENA];

export class RoomInfoManagePermission1794040000000 implements MigrationInterface {
  name = 'RoomInfoManagePermission1794040000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }
}