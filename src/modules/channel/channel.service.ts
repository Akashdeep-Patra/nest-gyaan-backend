import { BadRequestException, Injectable } from '@nestjs/common';
import { Utilities } from 'src/modules/common/utils/utilities';
import { User } from 'src/modules/users/entities/user.entity';
import { PostsRepository } from '../posts/posts.repository';
import { UserRepository } from '../users/user.repository';
import { ChannelRepository } from './channel.repository';
import { AssociatedProductResponseDto } from './dto/associatedProdcuts-response.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { GetChannelFilterDto } from './dto/get-channel-filter.dto';
import { PostAttachmentResponseDto } from './dto/post-attachment-response.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly channelRepository: ChannelRepository,
    private readonly postRepository: PostsRepository,
  ) {}
  async create(
    createChannelDto: CreateChannelDto,
    authUser: User,
  ): Promise<Channel> {
    let channel: Partial<Channel> = {};
    const user = await this.userRepository.findOneById(authUser.id);

    channel.name = createChannelDto.name;
    channel.about = createChannelDto.about;
    channel.isActive = createChannelDto.isActive;
    channel.type = createChannelDto.type;
    channel.winLoss = createChannelDto.winLoss;
    channel.battleCards = createChannelDto.battleCards;
    //the current user should be a part of the followers
    channel.followers = [user];
    // current user company
    channel.company = user.company;
    channel = Utilities.addAuditFields(user.id, channel, false);
    if (createChannelDto.associatedProductIds) {
      channel.associatedProducts = await this.channelRepository.findByIds(
        createChannelDto.associatedProductIds,
      );
    }

    //default admin
    let channelAdmins: User[] = [user];

    if (!Utilities.isValidChannelRequest(createChannelDto))
      throw new BadRequestException(
        'This is not a valid request for this channel type',
      );
    //default to true in case this is a company or product channel
    else channel.isSelf = createChannelDto?.isSelf ?? true;

    if (createChannelDto?.adminIds?.length > 0) {
      channelAdmins = [
        ...channelAdmins,
        ...(await this.userRepository.findByIds(createChannelDto.adminIds)),
      ];
    }

    channel.admins = channelAdmins;
    return await this.channelRepository.addChannel(channel);
  }

  async findAll(
    filterDto: GetChannelFilterDto,
    authUser: User,
  ): Promise<Channel[]> {
    const user = await this.userRepository.findOneById(authUser.id);
    return this.channelRepository.getChannels(filterDto, user);
  }

  async getAssociatedProducts(
    authUser: User,
  ): Promise<AssociatedProductResponseDto[]> {
    const channels = await this.channelRepository.getAssociatedProducts(
      authUser.company.id,
    );

    const associatedProducts = channels.map((channel) => {
      return new AssociatedProductResponseDto(channel);
    });

    return associatedProducts;
  }

  async updateOne(
    id: string,
    updateChannelDto: UpdateChannelDto,
    authUser: User,
  ): Promise<Channel> {
    const user = await this.userRepository.findOneById(authUser.id);
    let channel = await this.channelRepository.findOneById(id);
    if (!channel) throw new BadRequestException('No such channel exists');
    if (channel.company.id !== user.company.id)
      throw new BadRequestException(
        'This user does not have appropriate permissions',
      );
    //updating about
    channel.about = updateChannelDto.about ?? channel.about;
    //updating name
    channel.name = updateChannelDto.name ?? channel.name;
    //adding new admins
    let channelAdmins: User[] = [];
    if (updateChannelDto?.adminIds?.length) {
      channelAdmins = await this.userRepository.findByIds(
        updateChannelDto.adminIds,
      );
    }
    channel.admins = channelAdmins;
    channel.associatedProducts = updateChannelDto.associatedProductIds?.length
      ? await this.channelRepository.findByIds(
          updateChannelDto.associatedProductIds,
        )
      : channel.associatedProducts;
    // only product and company are allowed to have certain fields
    if (!Utilities.isValidChannelUpdateRequest(updateChannelDto))
      throw new BadRequestException(
        'This is not a valid request for this channel type',
      );
    //default to true in case this is a company or product channel
    else channel.isSelf = updateChannelDto?.isSelf ?? channel.isSelf;

    channel = Utilities.addAuditFields(user.id, channel, true);
    //update type
    channel.type =
      updateChannelDto.type !== undefined
        ? updateChannelDto.type
        : channel.type;
    //update state
    channel.isActive =
      updateChannelDto.isActive !== undefined
        ? updateChannelDto.isActive
        : channel.isActive;

    //update battleCards
    channel.battleCards =
      updateChannelDto.battleCards !== undefined
        ? updateChannelDto.battleCards
        : channel.battleCards;
    //update win-loss
    channel.winLoss =
      updateChannelDto.winLoss !== undefined
        ? updateChannelDto.winLoss
        : channel.winLoss;

    if (updateChannelDto.bannerFileName && updateChannelDto.bannerUrl) {
      channel.bannerAsset = {
        url: updateChannelDto.bannerUrl,
        fileName: updateChannelDto.bannerFileName,
      };
    }
    if (updateChannelDto.iconAssetName && updateChannelDto.iconUrl) {
      channel.iconAsset = {
        url: updateChannelDto.iconUrl,
        fileName: updateChannelDto.iconAssetName,
      };
    }

    return this.channelRepository.updateChannel(channel);
  }

  async findOne(id: string, authUser: User): Promise<Channel> {
    const user = await this.userRepository.findOneById(authUser.id);
    const channel = await this.channelRepository.findOneById(id);
    if (!channel) throw new BadRequestException('This channel does not exist');
    if (channel?.company?.id !== user.company.id)
      throw new BadRequestException(
        'This user does not have appropriate permissions',
      );
    return this.channelRepository.findOneById(id);
  }

  async follow(id: string, user: User): Promise<Channel> {
    const channel = await this.findOne(id, user);
    if (channel?.followers?.find((item) => item.id === user.id)) {
      throw new BadRequestException('You are already following this channel');
    }
    channel.followers = channel.followers.length
      ? [...channel.followers, user]
      : [user];

    return this.channelRepository.updateChannel(channel);
  }

  async unFollow(id: string, user: User): Promise<Channel> {
    const channel = await this.findOne(id, user);
    if (!channel?.followers?.find((item) => item.id === user.id))
      throw new BadRequestException('You are not following this channel');

    if (channel.followers.length) {
      channel.followers = channel.followers.filter(
        (item) => item.id !== user.id,
      );
    }
    return this.channelRepository.updateChannel(channel);
  }

  async remove(id: string, authUser: User): Promise<{ message: string }> {
    const user = await this.userRepository.findOneById(authUser.id);
    const channel = await this.findOne(id, user);
    channel.isActive = false;
    this.channelRepository.updateChannel(channel);
    return { message: 'The channel was successfully deleted' };
  }

  async getAllAssets(
    type: string,
    authUser: User,
    channelId: string,
  ): Promise<PostAttachmentResponseDto[]> {
    const user = await this.userRepository.findOneById(authUser.id);
    const channel = await this.findOne(channelId, user);
    let attachments: PostAttachmentResponseDto[] = [];

    //get all the attachments for the asset type
    (
      await this.postRepository.find({
        where: {
          channel: channel,
        },
      })
    ).forEach((post) => {
      attachments = [
        ...attachments,
        ...post.attachments
          .filter((attachment) => attachment.type.includes(type))
          .map((at) => new PostAttachmentResponseDto(at, post.id)),
      ];
    });

    return attachments;
  }
}
