import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersPrivacyTerms1794700000000 implements MigrationInterface {
  name = 'UsersPrivacyTerms1794700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "privacy_terms_accepted_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "privacy_terms_version" character varying(32)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "privacy_terms_version"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "privacy_terms_accepted_at"`);
  }
}
