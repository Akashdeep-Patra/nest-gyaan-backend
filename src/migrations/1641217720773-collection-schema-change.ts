import { MigrationInterface, QueryRunner } from 'typeorm';

export class collectionSchemaChange1641217720773 implements MigrationInterface {
  name = 'collectionSchemaChange1641217720773';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_f83768b20de17c7bd6828525923"`,
    );
    await queryRunner.query(
      `CREATE TABLE "collections_posts_posts" ("collections_id" uuid NOT NULL, "posts_id" uuid NOT NULL, CONSTRAINT "PK_f5e6688a08c5877e23ea2b8ecd7" PRIMARY KEY ("collections_id", "posts_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0690a9be92f09b1235108e9f7e" ON "collections_posts_posts" ("collections_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f213402209077ae93880b87f2" ON "collections_posts_posts" ("posts_id") `,
    );
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "collection_id"`);
    await queryRunner.query(
      `ALTER TABLE "collections_posts_posts" ADD CONSTRAINT "FK_0690a9be92f09b1235108e9f7e5" FOREIGN KEY ("collections_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections_posts_posts" ADD CONSTRAINT "FK_6f213402209077ae93880b87f2c" FOREIGN KEY ("posts_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections_posts_posts" DROP CONSTRAINT "FK_6f213402209077ae93880b87f2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections_posts_posts" DROP CONSTRAINT "FK_0690a9be92f09b1235108e9f7e5"`,
    );

    await queryRunner.query(`ALTER TABLE "posts" ADD "collection_id" uuid`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f213402209077ae93880b87f2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0690a9be92f09b1235108e9f7e"`,
    );
    await queryRunner.query(`DROP TABLE "collections_posts_posts"`);
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_f83768b20de17c7bd6828525923" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
