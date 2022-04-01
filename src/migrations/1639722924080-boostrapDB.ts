import { MigrationInterface, QueryRunner } from 'typeorm';

export class boostrapDB1639722924080 implements MigrationInterface {
  name = 'boostrapDB1639722924080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "created_by" uuid, "updated_by" uuid, "content" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_direct_comment" boolean NOT NULL DEFAULT true, "post_id" uuid, "parent_id" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b6496f77981b10109fd0fff325" ON "comments" ("content") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a5098caa7fb69425d35ff66539" ON "comments" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a2a3cb54ec3419ab2de3c9433b" ON "comments" ("is_direct_comment") `,
    );
    await queryRunner.query(
      `CREATE TABLE "post_attachments" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "type" character varying NOT NULL, "post_id" uuid, CONSTRAINT "PK_791a1c9044e40ac5c37aab661f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "created_by" uuid, "updated_by" uuid, "content" character varying(10000) NOT NULL, "author_id" uuid, "company_id" uuid, "channel_id" uuid, "re_posted_from_id" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hashtag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "created_by" uuid, "updated_by" uuid, "name" character varying(256) NOT NULL, "is_active" boolean NOT NULL, "frequency" integer NOT NULL, "company_id" uuid, CONSTRAINT "UQ_a9dfabf9ab30e241122752daaf2" UNIQUE ("name", "company_id"), CONSTRAINT "PK_cb36eb8af8412bfa978f1165d78" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_347fec870eafea7b26c8a73bac" ON "hashtag" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "display_name" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "created_by" uuid, "updated_by" uuid, "email" character varying(50) NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "password" character varying, "manager_id" character varying, "designation" character varying NOT NULL, "avatar" character varying, "is_active" boolean NOT NULL DEFAULT true, "company_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reactions_type_enum" AS ENUM('like')`,
    );
    await queryRunner.query(
      `CREATE TABLE "reactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "created_by" uuid, "updated_by" uuid, "type" "public"."reactions_type_enum" NOT NULL DEFAULT 'like', "user_id" uuid, "company_id" uuid, "post_id" uuid, CONSTRAINT "UQ_17fa6c691d35ceae1b920066960" UNIQUE ("user_id", "post_id"), CONSTRAINT "PK_0b213d460d0c473bc2fb6ee27f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "created_by" uuid, "updated_by" uuid, "name" character varying(20) NOT NULL, "email" character varying(50) NOT NULL, "is_active" boolean NOT NULL, "timezone" character varying NOT NULL DEFAULT 'UTC', "website_url" character varying(255) NOT NULL, "line1" character varying NOT NULL, "line2" character varying, "city" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL DEFAULT 'US', "zipcode" integer NOT NULL, "display_name" character varying(20), "portal_url" character varying(255), "company_logo" character varying, "brand_color" character varying, CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a76c5cd486f7779bd9c319afd2" ON "company" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b0fc567cf51b1cf717a9e8046a" ON "company" ("email") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."channel_type_enum" AS ENUM('general', 'social', 'company', 'product')`,
    );
    await queryRunner.query(
      `CREATE TABLE "channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "created_by" uuid, "updated_by" uuid, "name" character varying(20) NOT NULL, "about" character varying, "is_active" boolean NOT NULL, "is_self" boolean, "is_default" boolean DEFAULT false, "battle_cards" boolean, "win_loss" boolean, "type" "public"."channel_type_enum" NOT NULL DEFAULT 'general', "company_id" uuid, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_800e6da7e4c30fbb0653ba7bb6" ON "channel" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "hashtag_posts_posts" ("hashtag_id" uuid NOT NULL, "posts_id" uuid NOT NULL, CONSTRAINT "PK_d05b66daf4437dc76c20658f1ae" PRIMARY KEY ("hashtag_id", "posts_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d691d68a1b51e4708bc16ad2fa" ON "hashtag_posts_posts" ("hashtag_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85003f9ac12eaf4201eab65a30" ON "hashtag_posts_posts" ("posts_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "hashtag_followers_users" ("hashtag_id" uuid NOT NULL, "users_id" uuid NOT NULL, CONSTRAINT "PK_c2b2f5410cd47e294fb2ea96212" PRIMARY KEY ("hashtag_id", "users_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_316f749716710e343177b5c5cc" ON "hashtag_followers_users" ("hashtag_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f878174149b7f90be7f3e13a79" ON "hashtag_followers_users" ("users_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users_roles_roles" ("users_id" uuid NOT NULL, "roles_id" integer NOT NULL, CONSTRAINT "PK_27d0ca9155872fb087086b6a9f5" PRIMARY KEY ("users_id", "roles_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_178c6a2b971c18df6467eaf687" ON "users_roles_roles" ("users_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_291889ab59fe7785020c96066e" ON "users_roles_roles" ("roles_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "channel_followers_users" ("channel_id" uuid NOT NULL, "users_id" uuid NOT NULL, CONSTRAINT "PK_a87dd1711dc489bcda870a7c9d7" PRIMARY KEY ("channel_id", "users_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca3342d9ef29b3eb6cb74bd6fa" ON "channel_followers_users" ("channel_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5eaa020170e1999b54d64eb376" ON "channel_followers_users" ("users_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "channel_admins_users" ("channel_id" uuid NOT NULL, "users_id" uuid NOT NULL, CONSTRAINT "PK_0326bd615e0e8c0382e174e589f" PRIMARY KEY ("channel_id", "users_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_38a16946953d95d136d2b62dd0" ON "channel_admins_users" ("channel_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_20b75340e3f05a680a8b2aeb81" ON "channel_admins_users" ("users_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "channel_associated_products_channel" ("channel_id_1" uuid NOT NULL, "channel_id" uuid NOT NULL, CONSTRAINT "PK_9c5f6362e69811583b11060d93c" PRIMARY KEY ("channel_id_1", "channel_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4aac8be2eceb987258fe2bc20c" ON "channel_associated_products_channel" ("channel_id_1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d51b893ab952d64bb0e8838d11" ON "channel_associated_products_channel" ("channel_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "comments_closure_closure" ("ancestor_id" uuid NOT NULL, "descendant_id" uuid NOT NULL, CONSTRAINT "PK_60c5ad4afa5bb8753d04a43fb32" PRIMARY KEY ("ancestor_id", "descendant_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_de1d135a24cc660444d7845bfd" ON "comments_closure_closure" ("ancestor_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3431adcb8a70fad6922d5007f2" ON "comments_closure_closure" ("descendant_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_d6f93329801a93536da4241e386" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_attachments" ADD CONSTRAINT "FK_4423ea1009e33b8a0a39a8b05af" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_ccf02f530343f29cfe7154ca6bd" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_ac94c0a677f27ef8e2c0343f2e1" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_5a1f9d03ccc1d03cd2987eb0a6d" FOREIGN KEY ("re_posted_from_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashtag" ADD CONSTRAINT "FK_6c107ee9c92d97f8cee23132abd" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_7ae6334059289559722437bcc1c" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reactions" ADD CONSTRAINT "FK_dde6062145a93649adc5af3946e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reactions" ADD CONSTRAINT "FK_dfb0868b95f4a326f9a8e911ff8" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reactions" ADD CONSTRAINT "FK_a1ac38351a456da43cd26d38be8" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel" ADD CONSTRAINT "FK_6c01d14dfdb4afc4309a5eb7514" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashtag_posts_posts" ADD CONSTRAINT "FK_d691d68a1b51e4708bc16ad2fa6" FOREIGN KEY ("hashtag_id") REFERENCES "hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashtag_posts_posts" ADD CONSTRAINT "FK_85003f9ac12eaf4201eab65a30d" FOREIGN KEY ("posts_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashtag_followers_users" ADD CONSTRAINT "FK_316f749716710e343177b5c5cc4" FOREIGN KEY ("hashtag_id") REFERENCES "hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashtag_followers_users" ADD CONSTRAINT "FK_f878174149b7f90be7f3e13a79c" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_178c6a2b971c18df6467eaf687a" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_291889ab59fe7785020c96066e9" FOREIGN KEY ("roles_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_followers_users" ADD CONSTRAINT "FK_ca3342d9ef29b3eb6cb74bd6fa0" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_followers_users" ADD CONSTRAINT "FK_5eaa020170e1999b54d64eb376c" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_admins_users" ADD CONSTRAINT "FK_38a16946953d95d136d2b62dd04" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_admins_users" ADD CONSTRAINT "FK_20b75340e3f05a680a8b2aeb81b" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_associated_products_channel" ADD CONSTRAINT "FK_4aac8be2eceb987258fe2bc20c5" FOREIGN KEY ("channel_id_1") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_associated_products_channel" ADD CONSTRAINT "FK_d51b893ab952d64bb0e8838d118" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments_closure_closure" ADD CONSTRAINT "FK_de1d135a24cc660444d7845bfd2" FOREIGN KEY ("ancestor_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments_closure_closure" ADD CONSTRAINT "FK_3431adcb8a70fad6922d5007f28" FOREIGN KEY ("descendant_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      "INSERT INTO roles (id, name, display_name) VALUES (1, 'super_admin', 'Super Admin'), (2, 'company_admin', 'Admin'), (3, 'content_admin', 'Content Admin'), (4, 'user', 'User')",
    );
    await queryRunner.query(
      "INSERT INTO users (id, created_at, updated_at, created_by, updated_by, email, first_name, last_name, password, manager_id,designation,avatar, is_active, company_id) VALUES('28bd1928-366e-11ec-8d3d-0242ac130003','2021-10-27 11:30:00+05:30','2021-10-27 11:30:00+05:30','795be3be-366e-11ec-8d3d-0242ac130003','795be3be-366e-11ec-8d3d-0242ac130003','support@gyaan.ai','Super','Admin','$2a$12$zuyI/DXxyi33dPfsIjyh3upK5VOwyRHI6DQJwKahyiMpBWV.53BQy','self','super_admin','null',true,null)",
    );
    await queryRunner.query(
      "INSERT INTO users_roles_roles (users_id, roles_id) VALUES  ('28bd1928-366e-11ec-8d3d-0242ac130003', '1'), ('28bd1928-366e-11ec-8d3d-0242ac130003', '2'), ('28bd1928-366e-11ec-8d3d-0242ac130003', '3')",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments_closure_closure" DROP CONSTRAINT "FK_3431adcb8a70fad6922d5007f28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments_closure_closure" DROP CONSTRAINT "FK_de1d135a24cc660444d7845bfd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_associated_products_channel" DROP CONSTRAINT "FK_d51b893ab952d64bb0e8838d118"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_associated_products_channel" DROP CONSTRAINT "FK_4aac8be2eceb987258fe2bc20c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_admins_users" DROP CONSTRAINT "FK_20b75340e3f05a680a8b2aeb81b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_admins_users" DROP CONSTRAINT "FK_38a16946953d95d136d2b62dd04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_followers_users" DROP CONSTRAINT "FK_5eaa020170e1999b54d64eb376c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_followers_users" DROP CONSTRAINT "FK_ca3342d9ef29b3eb6cb74bd6fa0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_291889ab59fe7785020c96066e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_178c6a2b971c18df6467eaf687a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashtag_followers_users" DROP CONSTRAINT "FK_f878174149b7f90be7f3e13a79c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashtag_followers_users" DROP CONSTRAINT "FK_316f749716710e343177b5c5cc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashtag_posts_posts" DROP CONSTRAINT "FK_85003f9ac12eaf4201eab65a30d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashtag_posts_posts" DROP CONSTRAINT "FK_d691d68a1b51e4708bc16ad2fa6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel" DROP CONSTRAINT "FK_6c01d14dfdb4afc4309a5eb7514"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reactions" DROP CONSTRAINT "FK_a1ac38351a456da43cd26d38be8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reactions" DROP CONSTRAINT "FK_dfb0868b95f4a326f9a8e911ff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reactions" DROP CONSTRAINT "FK_dde6062145a93649adc5af3946e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_7ae6334059289559722437bcc1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashtag" DROP CONSTRAINT "FK_6c107ee9c92d97f8cee23132abd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_5a1f9d03ccc1d03cd2987eb0a6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_ac94c0a677f27ef8e2c0343f2e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_ccf02f530343f29cfe7154ca6bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_attachments" DROP CONSTRAINT "FK_4423ea1009e33b8a0a39a8b05af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_d6f93329801a93536da4241e386"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3431adcb8a70fad6922d5007f2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_de1d135a24cc660444d7845bfd"`,
    );
    await queryRunner.query(`DROP TABLE "comments_closure_closure"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d51b893ab952d64bb0e8838d11"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4aac8be2eceb987258fe2bc20c"`,
    );
    await queryRunner.query(`DROP TABLE "channel_associated_products_channel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_20b75340e3f05a680a8b2aeb81"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_38a16946953d95d136d2b62dd0"`,
    );
    await queryRunner.query(`DROP TABLE "channel_admins_users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5eaa020170e1999b54d64eb376"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca3342d9ef29b3eb6cb74bd6fa"`,
    );
    await queryRunner.query(`DROP TABLE "channel_followers_users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_291889ab59fe7785020c96066e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_178c6a2b971c18df6467eaf687"`,
    );
    await queryRunner.query(`DROP TABLE "users_roles_roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f878174149b7f90be7f3e13a79"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_316f749716710e343177b5c5cc"`,
    );
    await queryRunner.query(`DROP TABLE "hashtag_followers_users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_85003f9ac12eaf4201eab65a30"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d691d68a1b51e4708bc16ad2fa"`,
    );
    await queryRunner.query(`DROP TABLE "hashtag_posts_posts"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_800e6da7e4c30fbb0653ba7bb6"`,
    );
    await queryRunner.query(`DROP TABLE "channel"`);
    await queryRunner.query(`DROP TYPE "public"."channel_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b0fc567cf51b1cf717a9e8046a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a76c5cd486f7779bd9c319afd2"`,
    );
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "reactions"`);
    await queryRunner.query(`DROP TYPE "public"."reactions_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_347fec870eafea7b26c8a73bac"`,
    );
    await queryRunner.query(`DROP TABLE "hashtag"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "post_attachments"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a2a3cb54ec3419ab2de3c9433b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a5098caa7fb69425d35ff66539"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b6496f77981b10109fd0fff325"`,
    );
    await queryRunner.query(`DROP TABLE "comments"`);
  }
}
