import { BadRequestException, Injectable } from '@nestjs/common';
import { Utilities } from 'src/modules/common/utils/utilities';
import { UserRepository } from 'src/modules/users/user.repository';
import { PostsRepository } from '../posts/posts.repository';
import { User } from '../users/entities/user.entity';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { GetHashtagFilterDto } from './dto/get-hashtag-filter.dto';
import { HashtagResponseDto } from './dto/hashtag-response.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { Hashtag } from './entities/hashtag.entity';
import { HashtagRepository } from './hashtag.repository';

@Injectable()
export class HashtagService {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly hashtagRepository: HashtagRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async create(
    createHashtagDto: CreateHashtagDto,
    authUser: User,
  ): Promise<Hashtag> {
    const user = await this.userRepository.findOneById(authUser.id);
    //check if this is a valid hashtag
    if (!Utilities.isValidHashtagName(createHashtagDto.name))
      throw new BadRequestException(
        `${createHashtagDto.name} is not a valid Hashtag`,
      );
    //check if this name already exists in the user's company
    if (await this.hashtagRepository.findOneByName(createHashtagDto.name, user))
      throw new BadRequestException('This Hashtag already exits');

    const hashtag: Partial<Hashtag> = {};
    hashtag.name = createHashtagDto.name.toLowerCase();
    //posts are empty array

    hashtag.posts = [];
    hashtag.followers = [user];
    //audit fields
    Utilities.addAuditFields(user.id, hashtag, false);
    //should have the same company as the creator
    hashtag.company = user.company;
    hashtag.frequency = 0;
    hashtag.isActive = true;

    return this.hashtagRepository.addHashtag(hashtag);
  }

  async findAll(
    getHashtagFilterDto: GetHashtagFilterDto,
    authUser: User,
  ): Promise<HashtagResponseDto[]> {
    const user = await this.userRepository.findOneById(authUser.id);

    return await (
      await this.hashtagRepository.findAll(getHashtagFilterDto, user)
    ).map((tag) => new HashtagResponseDto(tag));
  }

  // async batchCreateUpdate(
  //   dto: BatchCreateUpdateDto,
  //   authUser: User,
  // ): Promise<Hashtag[]> {
  //   const user = await this.userRepository.findOneById(authUser.id);

  //   const hashTags: Partial<Hashtag[]> = [];

  //   dto.names.forEach(async (tagName) => {
  //     let hashtagInDb: Partial<Hashtag> =
  //       await this.hashtagRepository.findOneByName(tagName);
  //     if (!hashtagInDb) {
  //       hashtagInDb = {};
  //       hashtagInDb.name = tagName;
  //       hashtagInDb.company = user.company;
  //       hashtagInDb.frequency = 1;
  //       hashtagInDb.isActive = true;
  //       hashtagInDb.posts = [await this.postRepository.findOneById(dto.postId)];
  //       Utilities.addAuditFields(user.id, hashtagInDb, false);
  //       //todo have to think about batch updates , in case of failure
  //       // hashTags.push(await this.hashtagRepository.addHashtag(hashtagInDb));
  //     } else {
  //       hashtagInDb.frequency = hashtagInDb.frequency + 1;
  //       hashtagInDb.posts = [
  //         ...hashtagInDb.posts,
  //         await this.postRepository.findOneById(dto.postId),
  //       ];

  //       // hashTags.push(await this.hashtagRepository.updateHashTag(hashtagInDb));
  //     }

  //     await this.hashtagRepository.manager.save(hashTags);
  //   });

  //   return hashTags;
  // }

  async findOne(name: string, authUser: User): Promise<HashtagResponseDto> {
    const user = await this.userRepository.findOneById(authUser.id);
    const hashtag = await this.hashtagRepository.findOneByName(name, user);

    if (!hashtag) throw new BadRequestException('This hashtag does not exists');
    return new HashtagResponseDto(hashtag);
  }

  async remove(name: string, authUser: User): Promise<{ message: string }> {
    const user = await this.userRepository.findOneById(authUser.id);
    const hashtag = await this.hashtagRepository.findOneByName(name, user);

    if (!hashtag) throw new BadRequestException('This hashtag does not exists');

    hashtag.isActive = false;
    Utilities.addAuditFields(user.id, hashtag, true);
    await this.hashtagRepository.updateHashTag(hashtag);

    return { message: `The Hashtag ${name} has been deactivated` };
  }

  async update(
    id: string,
    authUser: User,
    dto: UpdateHashtagDto,
  ): Promise<HashtagResponseDto> {
    const user = await this.userRepository.findOneById(authUser.id);
    const hashtag = await this.hashtagRepository.findOneById(id, user);

    if (!hashtag) throw new BadRequestException('This hashtag does not exists');

    if (
      dto.name &&
      (await this.hashtagRepository.findOneByName(dto.name, user))
    )
      throw new BadRequestException(
        'Hashtag with provided name already exists',
      );

    hashtag.name = dto?.name?.toLowerCase() ?? hashtag.name;
    Utilities.addAuditFields(user.id, hashtag, true);
    const newHashtag = await this.hashtagRepository.updateHashTag(hashtag);
    return new HashtagResponseDto(newHashtag);
  }

  async follow(name: string, authUser: User): Promise<HashtagResponseDto> {
    const user = await this.userRepository.findOneById(authUser.id);
    const hashtag = await this.hashtagRepository.findOneByName(name, user);

    if (!hashtag) throw new BadRequestException('This hashtag does not exists');
    if (hashtag?.followers?.find((item) => item.id === user.id))
      throw new BadRequestException('You are already following this Hashtag');

    hashtag.followers = hashtag.followers.length
      ? [...hashtag.followers, user]
      : [user];

    const newHashtag = await this.hashtagRepository.updateHashTag(hashtag);
    return new HashtagResponseDto(newHashtag);
  }

  async unFollow(name: string, authUser: User): Promise<HashtagResponseDto> {
    const user = await this.userRepository.findOneById(authUser.id);
    const hashtag = await this.hashtagRepository.findOneByName(name, user);

    if (!hashtag) throw new BadRequestException('This hashtag does not exists');

    if (hashtag.followers.length) {
      hashtag.followers = hashtag.followers.filter(
        (item) => item.id !== user.id,
      );
    }
    const newHashtag = await this.hashtagRepository.updateHashTag(hashtag);
    return new HashtagResponseDto(newHashtag);
  }
}
