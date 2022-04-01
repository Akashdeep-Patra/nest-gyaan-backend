import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/users/user.repository';
import { PostsRepository } from '../posts/posts.repository';
import { HashtagController } from './hashtag.controller';
import { HashtagRepository } from './hashtag.repository';
import { HashtagService } from './hashtag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HashtagRepository,
      PostsRepository,
      UserRepository,
    ]),
  ],
  controllers: [HashtagController],
  providers: [HashtagService],
})
export class HashtagModule {}
