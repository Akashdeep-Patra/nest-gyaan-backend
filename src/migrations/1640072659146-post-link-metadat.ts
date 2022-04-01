import { MigrationInterface, QueryRunner } from 'typeorm';

export class postLinkMetadat1640072659146 implements MigrationInterface {
  name = 'postLinkMetadat1640072659146';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ADD "meta_data" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "meta_data"`);
  }
}
