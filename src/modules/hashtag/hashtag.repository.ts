import { EntityRepository, In } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { User } from '../users/entities/user.entity';
import { GetHashtagFilterDto } from './dto/get-hashtag-filter.dto';
import { Hashtag } from './entities/hashtag.entity';

@EntityRepository(Hashtag)
export class HashtagRepository extends BaseRepository<Hashtag> {
  public async addHashtag(hashtag: Partial<Hashtag>) {
    return this.save(hashtag);
  }

  public async findOneById(id: string, user: User): Promise<Hashtag> {
    const query = this.createQueryBuilder('hashtag')
      .leftJoinAndSelect('hashtag.company', 'company')
      .leftJoinAndSelect('hashtag.followers', 'hashtag_followers_users')
      .where(`hashtag.company_id = :companyId `, {
        companyId: user.company.id,
      })
      .andWhere('hashtag.id = :id', { id });

    return query.getOne();
  }
  public async findOneByName(name: string, user: User): Promise<Hashtag> {
    const query = this.createQueryBuilder('hashtag')
      .leftJoinAndSelect('hashtag.company', 'company')
      .leftJoinAndSelect('hashtag.followers', 'hashtag_followers_users')
      .where(`hashtag.company_id = :companyId `, {
        companyId: user.company.id,
      })
      .andWhere('hashtag.name = :name', { name: name.toLowerCase() });
    return query.getOne();
  }

  public async findAllForPosts(
    names: string[],
    user: User,
  ): Promise<Hashtag[]> {
    return this.find({ name: In(names), company: user.company });
  }

  public async findAll(
    dto: GetHashtagFilterDto,
    user: User,
  ): Promise<Hashtag[]> {
    const query = this.createQueryBuilder('hashtag')
      .leftJoinAndSelect('hashtag.company', 'company')
      .leftJoinAndSelect('hashtag.followers', 'hashtag_followers_users')
      .where(`hashtag.company_id = :companyId `, {
        companyId: user.company.id,
      })
      .skip(dto.skip ?? 0)
      .limit(dto.limit ?? 10)
      .orderBy('hashtag.name', 'ASC');

    if (dto.isActive !== undefined) {
      query.andWhere('hashtag.is_active = :isActive', {
        isActive: dto.isActive,
      });
    }

    if (dto.nameStartsWith) {
      query.andWhere('starts_with(hashtag.name,:nameStartsWith)', {
        nameStartsWith: dto.nameStartsWith.toLowerCase(),
      });
    }
    const hashtags: Hashtag[] = await query.getMany();
    return hashtags;
  }

  public async updateHashTag(hashtag: Partial<Hashtag>) {
    return this.save(hashtag);
  }
}
