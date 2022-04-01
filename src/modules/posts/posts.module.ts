import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelRepository } from '../channel/channel.repository';
import { HashtagRepository } from '../hashtag/hashtag.repository';
import { UserRepository } from '../users/user.repository';
import { CommentRepository } from './comments.repository';
import { PostAttachment } from './entities/post-attachment.entity';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { ReactionRepository } from './reactions.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsRepository,
      PostAttachment,
      UserRepository,
      HashtagRepository,
      ChannelRepository,
      ReactionRepository,
      CommentRepository,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
