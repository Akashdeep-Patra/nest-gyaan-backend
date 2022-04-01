import { User } from 'src/modules/users/entities/user.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { GetReactionsFilterDto } from './dto/reaction/get-reactions-filter.dto';
import { Reaction } from './entities/reaction.entity';

@EntityRepository(Reaction)
export class ReactionRepository extends BaseRepository<Reaction> {
  public async getAll(
    getReactionsFilterDto: GetReactionsFilterDto,
    user: User,
  ) {
    const query = this.createQueryBuilder('reaction')
      .where('reaction.company_id = :id', { id: user.company.id })
      .leftJoinAndSelect('reaction.user', 'user');

    if (getReactionsFilterDto.type) {
      query.andWhere('reaction.type = :type', {
        type: getReactionsFilterDto.type,
      });
    }
    if (getReactionsFilterDto.postId) {
      query.andWhere('reaction.post_id = :id', {
        id: getReactionsFilterDto.postId,
      });
    }

    return query.getManyAndCount();
  }

  public findByPostAndUser(user: User, postId: string) {
    return this.createQueryBuilder('reaction')
      .where('reaction.user_id = :id', { id: user.id })
      .andWhere('reaction.post_id = :postId', { postId })
      .getOne();
  }
  public findById(id: string) {
    return this.findOne({ id });
  }

  public addReaction(reaction: Partial<Reaction>): Promise<Reaction> {
    return this.save(reaction);
  }

  public updateReaction(reaction: Partial<Reaction>): Promise<Reaction> {
    return this.save(reaction);
  }
}
