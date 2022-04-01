import { MigrationInterface, QueryRunner } from 'typeorm';

export class collections1640759230891 implements MigrationInterface {
  name = 'collections1640759230891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "collections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "created_by" uuid, "updated_by" uuid, "name" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "user_id" uuid, CONSTRAINT "UQ_e42c3328523c8c83900f656243f" UNIQUE ("name", "user_id"), CONSTRAINT "PK_21c00b1ebbd41ba1354242c5c4e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ed225078e8bf65b448b69105b4" ON "collections" ("name") `,
    );
    await queryRunner.query(`ALTER TABLE "posts" ADD "collection_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "collections" ADD CONSTRAINT "FK_728c4a63e823bcd4c687fe46747" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_f83768b20de17c7bd6828525923" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_f83768b20de17c7bd6828525923"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP CONSTRAINT "FK_728c4a63e823bcd4c687fe46747"`,
    );
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "collection_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ed225078e8bf65b448b69105b4"`,
    );
    await queryRunner.query(`DROP TABLE "collections"`);
  }
}
