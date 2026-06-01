import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitLeagueSchema1716820000000 implements MigrationInterface {
  name = 'InitLeagueSchema1716820000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TYPE "public"."person_role_enum" AS ENUM (
        'goalkeeper',
        'defender',
        'midfielder',
        'forward',
        'coach',
        'assistant_coach',
        'manager',
        'staff'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."person_status_enum" AS ENUM ('active', 'inactive', 'suspended')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."team_status_enum" AS ENUM ('active', 'inactive')
    `);

    await queryRunner.query(`
      CREATE TABLE "person" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(120) NOT NULL,
        "last_name" character varying(120) NOT NULL,
        "phone" character varying(20),
        "email" character varying(180),
        "dob" date NOT NULL,
        "role" "public"."person_role_enum" NOT NULL,
        "status" "public"."person_status_enum" NOT NULL DEFAULT 'active',
        "age" integer NOT NULL DEFAULT 0,
        "team_id" uuid,
        "stats" jsonb NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT "PK_person_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "team" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(120) NOT NULL,
        "coach" uuid NOT NULL,
        "captain" uuid,
        "status" "public"."team_status_enum" NOT NULL DEFAULT 'active',
        CONSTRAINT "UQ_team_name" UNIQUE ("name"),
        CONSTRAINT "PK_team_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "match" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "home" uuid NOT NULL,
        "away" uuid NOT NULL,
        "home_score" integer NOT NULL DEFAULT 0,
        "away_score" integer NOT NULL DEFAULT 0,
        "played" TIMESTAMP WITH TIME ZONE NOT NULL,
        "location" character varying(200) NOT NULL,
        CONSTRAINT "PK_match_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "person"
      ADD CONSTRAINT "FK_person_team_id" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE SET NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "team"
      ADD CONSTRAINT "FK_team_coach" FOREIGN KEY ("coach") REFERENCES "person"("id") ON DELETE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "team"
      ADD CONSTRAINT "FK_team_captain" FOREIGN KEY ("captain") REFERENCES "person"("id") ON DELETE SET NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "match"
      ADD CONSTRAINT "FK_match_home" FOREIGN KEY ("home") REFERENCES "team"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "match"
      ADD CONSTRAINT "FK_match_away" FOREIGN KEY ("away") REFERENCES "team"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_match_away"`);
    await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_match_home"`);
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_team_captain"`);
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_team_coach"`);
    await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "FK_person_team_id"`);

    await queryRunner.query(`DROP TABLE "match"`);
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP TABLE "person"`);

    await queryRunner.query(`DROP TYPE "public"."team_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."person_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."person_role_enum"`);
  }
}
