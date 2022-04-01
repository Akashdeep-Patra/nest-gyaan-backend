import { MigrationInterface, QueryRunner } from 'typeorm';

export class sizeInt1641190401452 implements MigrationInterface {
  name = 'sizeInt1641190401452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_attachments" DROP COLUMN "size"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_attachments" ADD "size" bigint NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_attachments" DROP COLUMN "size"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_attachments" ADD "size" character varying NOT NULL`,
    );
  }
}
