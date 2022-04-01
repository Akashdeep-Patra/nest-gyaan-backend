import {MigrationInterface, QueryRunner} from "typeorm";

export class userUpdate1639760760304 implements MigrationInterface {
    name = 'userUpdate1639760760304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_attachments" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "manager_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "manager_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fba2d8e029689aa8fea98e53c91" UNIQUE ("manager_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fba2d8e029689aa8fea98e53c91" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fba2d8e029689aa8fea98e53c91"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fba2d8e029689aa8fea98e53c91"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "manager_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "manager_id" character varying`);
        await queryRunner.query(`ALTER TABLE "post_attachments" ALTER COLUMN "type" SET NOT NULL`);
    }

}
