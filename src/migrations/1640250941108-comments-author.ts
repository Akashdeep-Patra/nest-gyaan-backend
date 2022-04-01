import { MigrationInterface, QueryRunner } from 'typeorm';

export class commentsAuthor1640250941108 implements MigrationInterface {
  name = 'commentsAuthor1640250941108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comments" ADD "author_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_e6d38899c31997c45d128a8973b" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "collection_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_f83768b20de17c7bd6828525923" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
