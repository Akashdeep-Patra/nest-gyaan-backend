import { MigrationInterface, QueryRunner } from 'typeorm';

export class attachmentSize1640761634232 implements MigrationInterface {
  name = 'attachmentSize1640761634232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_attachments" ADD "size" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_attachments" DROP COLUMN "size"`,
    );
  }
}
