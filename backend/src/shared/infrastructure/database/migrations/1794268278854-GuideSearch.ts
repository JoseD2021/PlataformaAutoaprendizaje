import { MigrationInterface, QueryRunner } from "typeorm";

export class GuideSearch1794268278854 implements MigrationInterface {
    name = 'GuideSearch1794268278854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS unaccent`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION f_unaccent(text) RETURNS text
            LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT AS
            $$ SELECT public.unaccent('public.unaccent'::regdictionary, $1) $$
        `);

        await queryRunner.query(`ALTER TABLE "guides" ADD "search_keywords" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "guides" ADD "search_doc" text GENERATED ALWAYS AS (f_unaccent(lower(title || ' ' || search_keywords))) STORED NOT NULL`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["plataforma","public","guides","GENERATED_COLUMN","search_doc","f_unaccent(lower(title || ' ' || search_keywords))"]);

        await queryRunner.query(`CREATE INDEX "idx_guides_search_doc_trgm" ON "guides" USING gin ("search_doc" gin_trgm_ops)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_guides_search_doc_trgm"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","search_doc","plataforma","public","guides"]);
        await queryRunner.query(`ALTER TABLE "guides" DROP COLUMN "search_doc"`);
        await queryRunner.query(`ALTER TABLE "guides" DROP COLUMN "search_keywords"`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS f_unaccent(text)`);
    }
}