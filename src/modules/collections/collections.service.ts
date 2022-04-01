import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Utilities } from 'src/modules/common/utils/utilities';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRepository } from 'src/modules/users/user.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CollectionsRepository } from './collections.repository';
import { AddPostCollectionsDto } from './dto/add-post-collections.dto';
import { CollectionResponseDto } from './dto/collection-response.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { GetCollectionsFilterDto } from './dto/get-collections-filter.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly collectionsRepository: CollectionsRepository,
    private readonly postRepository: PostsRepository,
  ) {}
  async create(
    createCollectionDto: CreateCollectionDto,
    authUser: User,
  ): Promise<CollectionResponseDto> {
    const user = await this.userRepository.findOneById(authUser.id);
    const exists = await this.collectionsRepository.findOne({
      user: user,
      name: createCollectionDto.name.toLowerCase(),
    });
    if (exists && exists.isActive)
      throw new BadRequestException('This collection already exists');
    if (exists) {
      exists.isActive = true;
      exists.posts = [];
      Utilities.addAuditFields(user.id, exists, false);
      return new CollectionResponseDto(
        await this.collectionsRepository.save(exists),
        user,
      );
    }
    const collection = new Collection();
    collection.name = createCollectionDto.name.toLowerCase();
    collection.user = user;
    Utilities.addAuditFields(user.id, collection, false);

    return new CollectionResponseDto(
      await this.collectionsRepository.addCollection(collection),
      user,
    );
  }

  async findAll(
    getCollectionsFilterDto: GetCollectionsFilterDto,
    authUser: User,
  ) {
    const user = await this.userRepository.findOneById(authUser.id);
    const collections = await this.collectionsRepository.findAllCollections(
      getCollectionsFilterDto,
      user,
    );
    return collections.map(
      (collection) => new CollectionResponseDto(collection, user),
    );
  }

  async findOne(id: string, authUser: User) {
    const user = await this.userRepository.findOneById(authUser.id);
    const exists = await this.collectionsRepository.findOne({
      id,
      isActive: true,
      user: user,
    });

    if (!exists) throw new NotFoundException('This collection does not exits');

    return new CollectionResponseDto(exists, user);
  }

  async update(
    id: string,
    updateCollectionDto: UpdateCollectionDto,
    authUser: User,
  ) {
    const user = await this.userRepository.findOneById(authUser.id);
    const collection = await this.collectionsRepository.findOne({
      id,
      isActive: true,
      user: user,
    });
    const exists = await this.collectionsRepository.findOne({
      name: updateCollectionDto.name,
      isActive: true,
      user: user,
    });

    if (exists) throw new BadRequestException('This new name already exits');

    collection.name = updateCollectionDto.name;

    return new CollectionResponseDto(
      await this.collectionsRepository.save(collection),
      user,
    );
  }

  async addPost(
    id: string,
    addPostCollectionsDto: AddPostCollectionsDto,
    authUser: User,
  ) {
    const user = await this.userRepository.findOneById(authUser.id);
    const post = await this.postRepository.findOne(
      addPostCollectionsDto.postId,
    );

    if (!post) throw new NotFoundException('This post does not exist');

    const collection = await this.collectionsRepository.findOne({
      id,
      isActive: true,
      user: user,
    });

    if (!collection)
      throw new BadRequestException('This collection does not exist');

    collection.posts = collection?.posts?.length
      ? [...collection.posts, post]
      : [post];

    return new CollectionResponseDto(
      await this.collectionsRepository.save(collection),
      user,
    );
  }

  async removePost(
    id: string,
    addPostCollectionsDto: AddPostCollectionsDto,
    authUser: User,
  ) {
    const user = await this.userRepository.findOneById(authUser.id);
    const post = await this.postRepository.findOneById(
      addPostCollectionsDto.postId,
    );

    if (!post) throw new NotFoundException('This post does not exist');

    const collection = await this.collectionsRepository.findOne({
      id,
      isActive: true,
      user: user,
    });

    if (!collection)
      throw new BadRequestException('This collection does not exist');

    if (collection?.posts?.length) {
      collection.posts = collection.posts.filter(
        (post) => post.id !== addPostCollectionsDto.postId,
      );
    }

    return new CollectionResponseDto(
      await this.collectionsRepository.save(collection),
      user,
    );
  }

  async remove(id: string, authUser: User) {
    const user = await this.userRepository.findOneById(authUser.id);
    const exists = await this.collectionsRepository.findOne({
      id,
      isActive: true,
      user: user,
    });

    if (!exists) throw new NotFoundException('This collection does not exits');

    exists.isActive = false;
    await this.collectionsRepository.save(exists);

    return { message: 'Successfully removed' };
  }
}
