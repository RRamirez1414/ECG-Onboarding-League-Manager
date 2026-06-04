import { MigrationInterface, QueryRunner } from 'typeorm';

export class MemberFee1716820000003 implements MigrationInterface {
  name = 'MemberFee1716820000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "person"
      ADD COLUMN "fee" integer NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "fee"`);
  }
}
