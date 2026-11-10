import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../../../../modules/users/domain/enums/role.enum';

const PERMISSIONS = ['guides:create', 'guides:manage'];
const ROLES: string[] = [Role.ADMINISTRADOR, Role.PERSONAL_CLENA];

export class GuidesPermissions1794050000000 implements MigrationInterface {
  name = 'GuidesPermissions1794050000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const permission of PERMISSIONS) {
      await queryRunner.query(
        `UPDATE "roles"
         SET "permissions" = CASE
           WHEN "permissions" = '' THEN $2::text
           ELSE "permissions" || ',' || $2::text
         END
         WHERE "role" = ANY($1::text[])
           AND NOT ($2::text = ANY(string_to_array("permissions", ',')))`,
        [ROLES, permission],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "roles"
       SET "permissions" = array_to_string(
         array_remove(string_to_array("permissions", ','), 'guides:manage'), ','
       )
       WHERE "role" = ANY($1::text[])`,
      [ROLES],
    );
  }
}