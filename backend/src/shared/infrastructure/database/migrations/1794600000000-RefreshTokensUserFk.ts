import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefreshTokensUserFk1794600000000 implements MigrationInterface {
  name = 'RefreshTokensUserFk1794600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "refresh_tokens" rt WHERE NOT EXISTS (SELECT 1 FROM "users" u WHERE u."id" = rt."user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_refresh_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user"`,
    );
  }
}
