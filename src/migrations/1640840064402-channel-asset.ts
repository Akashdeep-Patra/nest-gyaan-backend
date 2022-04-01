import { MigrationInterface, QueryRunner } from 'typeorm';

export class channelAsset1640840064402 implements MigrationInterface {
  name = 'channelAsset1640840064402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "channel" ADD "banner_asset" jsonb`);
    await queryRunner.query(`ALTER TABLE "channel" ADD "icon_asset" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "icon_asset"`);
    await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "banner_asset"`);
  }
}
