import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository } from '../posts/posts.repository';
import { UserRepository } from '../users/user.repository';
import { ChannelController } from './channel.controller';
import { ChannelRepository } from './channel.repository';
import { ChannelService } from './channel.service';
import { AreAdminsValid } from './validators/are-valid-admins.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelRepository,
      UserRepository,
      PostsRepository,
    ]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, AreAdminsValid],
})
export class ChannelModule {}
