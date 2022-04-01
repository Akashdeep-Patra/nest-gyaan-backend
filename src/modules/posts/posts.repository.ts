import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { User } from '../users/entities/user.entity';
import { GetPostFilterDto } from './dto/get-posts-filter.dto';
import { Post } from './entities/post.entity';

@EntityRepository(Post)
export class PostsRepository extends BaseRepository<Post> {
  public async addPost(post: Partial<Post>) {
    return this.save(post);
  }

  public async findOneById(id: string): Promise<Post> {
    return this.findOne(id, {
      relations: ['rePostedFrom', 'sharedTo'],
      join: {
        alias: 'post',
        leftJoinAndSelect: {
          collections: 'post.collections',
          user: 'collections.user',
        },
      },
    });
  }

  public async findAllPosts(
    dto: GetPostFilterDto,
    user: User,
  ): Promise<Post[]> {
    const query = this.createQueryBuilder('post')
      .leftJoinAndSelect('post.company', 'company')
      .leftJoinAndSelect('post.channel', 'channel')
      .leftJoinAndSelect('post.reactions', 'reactions')
      .leftJoinAndSelect('post.attachments', 'id')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.collections', 'collections')
      .leftJoinAndSelect('collections.user', 'user')
      .loadRelationCountAndMap('post.rePostCount', 'post.sharedTo', 'post')
      // .leftJoinAndMapMany(
      //   'post.comments',
      //   (qb) => qb.from(Comment, 'comments'),
      //   'comments',
      //   'comments.post_id = post.id',
      // )
      .leftJoinAndSelect('post.rePostedFrom', 'posts')
      .leftJoinAndSelect('post.author', 'users')
      .where('post.company_id = :id', { id: user.company.id });
    // .andWhere('comments.is_active = :isActive', { isActive: true });

    query.leftJoinAndSelect('comments.author', 'author');
    if (dto.hashtag) {
      query
        .leftJoin('post.hashtags', 'hashtag')
        .andWhere('hashtag.name = :name', { name: dto.hashtag });
    }
    if (dto.channelId) {
      query.andWhere('post.channel_id = :channelId', {
        channelId: dto.channelId,
      });
    }
    if (dto.hasText) {
      query.andWhere('LOWER(post.content) LIKE LOWER(:text) ', {
        text: `%${dto.hasText ?? ''}%`,
      });
    }
    const posts = await query
      .orderBy('reactions', 'DESC', 'NULLS LAST')
      .limit(dto.limit ?? 20)
      .skip(dto.skip ?? 0)
      .addOrderBy('post.created_at', 'DESC')
      .getMany();

    return posts;
  }

  public async updatePost(post: Partial<Post>) {
    return this.save(post);
  }
}
