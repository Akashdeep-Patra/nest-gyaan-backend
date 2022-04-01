import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import * as ormConfig from './config/ormConfig';
import { CloudfrontService } from './modules/aws/cloudfront/cloudfront.service';
import { ChannelModule } from './modules/channel/channel.module';
import { CompanyModule } from './modules/company/company.module';
import { CompanyRepository } from './modules/company/company.repository';
import { HashtagModule } from './modules/hashtag/hashtag.module';
import { PostsModule } from './modules/posts/posts.module';
import { UserRepository } from './modules/users/user.repository';
import { UsersModule } from './modules/users/users.module';
import { CollectionsModule } from './modules/collections/collections.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature([UserRepository, CompanyRepository]),
    AuthModule,
    UsersModule,
    CompanyModule,
    ChannelModule,
    PostsModule,
    HashtagModule,
    CollectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, CloudfrontService],
})
export class AppModule {}
