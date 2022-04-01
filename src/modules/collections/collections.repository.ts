import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { User } from '../users/entities/user.entity';
import { GetCollectionsFilterDto } from './dto/get-collections-filter.dto';
import { Collection } from './entities/collection.entity';

@EntityRepository(Collection)
export class CollectionsRepository extends BaseRepository<Collection> {
  public async addCollection(collection: Partial<Collection>) {
    return this.save(collection);
  }

  public async findOneById(id: string): Promise<Collection> {
    return this.findOne(id);
  }

  public async findAllCollections(dto: GetCollectionsFilterDto, user: User) {
    return this.find({
      relations: ['user', 'posts'],
      where: {
        user: user,
        isActive: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: dto?.skip ?? 0,
      take: dto?.limit ?? 20,
    });
  }

  public async updateCollection(collection: Partial<Collection>) {
    return this.save(collection);
  }
}
