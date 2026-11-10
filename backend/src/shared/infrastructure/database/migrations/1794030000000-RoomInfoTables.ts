import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoomInfoTables1794030000000 implements MigrationInterface {
  name = 'RoomInfoTables1794030000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "room_schedules" ("id" uuid NOT NULL, "days" character varying(80) NOT NULL, "hours" character varying(80) NOT NULL, "display_order" integer NOT NULL, CONSTRAINT "PK_room_schedules" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_room_schedules_display_order" ON "room_schedules" ("display_order")`,
    );
    await queryRunner.query(
      `CREATE TABLE "room_rules" ("id" uuid NOT NULL, "text" character varying(300) NOT NULL, "display_order" integer NOT NULL, CONSTRAINT "PK_room_rules" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_room_rules_display_order" ON "room_rules" ("display_order")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UQ_room_rules_display_order"`);
    await queryRunner.query(`DROP TABLE "room_rules"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_room_schedules_display_order"`);
    await queryRunner.query(`DROP TABLE "room_schedules"`);
  }
}