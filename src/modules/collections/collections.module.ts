import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/users/user.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CollectionsController } from './collections.controller';
import { CollectionsRepository } from './collections.repository';
import { CollectionsService } from './collections.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsRepository,
      CollectionsRepository,
      UserRepository,
    ]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
