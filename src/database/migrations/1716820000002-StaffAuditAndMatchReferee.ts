import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Applied after InitLeagueSchema. Do not fold into init once that migration
 * has run in any environment — append-only migration history.
 */
export class StaffAuditAndMatchReferee1716820000002 implements MigrationInterface {
  name = 'StaffAuditAndMatchReferee1716820000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "person"
      ADD COLUMN "type" character varying NOT NULL DEFAULT 'member'
    `);
    await queryRunner.query(`
      ALTER TABLE "person"
      ADD COLUMN "wage" integer
    `);
    await queryRunner.query(`
      ALTER TABLE "person"
      ADD COLUMN "hire_date" date
    `);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN IF EXISTS "age"`);

    await queryRunner.query(`
      CREATE TYPE "public"."audit_entity_enum" AS ENUM ('team', 'match', 'person')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."audit_action_enum" AS ENUM ('add', 'delete', 'update')
    `);
    await queryRunner.query(`
      CREATE TABLE "audit" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "entity" "public"."audit_entity_enum" NOT NULL,
        "action" "public"."audit_action_enum" NOT NULL,
        "new_value" jsonb NOT NULL,
        "modified_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "match"
      ADD COLUMN "referee" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "match"
      ADD CONSTRAINT "FK_match_referee" FOREIGN KEY ("referee") REFERENCES "person"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_match_referee"`);
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "referee"`);

    await queryRunner.query(`DROP TABLE "audit"`);
    await queryRunner.query(`DROP TYPE "public"."audit_action_enum"`);
    await queryRunner.query(`DROP TYPE "public"."audit_entity_enum"`);

    await queryRunner.query(`ALTER TABLE "person" ADD COLUMN "age" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "hire_date"`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "wage"`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "type"`);
  }
}
