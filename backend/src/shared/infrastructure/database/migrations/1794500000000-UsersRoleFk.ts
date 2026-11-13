import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersRoleFk1794500000000 implements MigrationInterface {
  name = 'UsersRoleFk1794500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_role" FOREIGN KEY ("role") REFERENCES "roles"("role") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_role"`,
    );
  }
}
