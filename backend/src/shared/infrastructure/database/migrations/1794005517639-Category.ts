import { MigrationInterface, QueryRunner } from "typeorm";

export class Category1794005517639 implements MigrationInterface {
    name = 'Category1794005517639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" character varying(32) NOT NULL, "name" character varying(80) NOT NULL, "slug" character varying(80) NOT NULL, "iconUrl" character varying(255) NOT NULL, "displayOrder" integer NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
