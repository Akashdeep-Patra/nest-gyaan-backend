import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { EntityType } from '../common/enums/entity-type.enums';
import { Company } from '../company/entities/company.entity';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  public async addUser(userDto: Partial<User>): Promise<User> {
    return this.save(userDto);
  }

  public async findOneById(id: string): Promise<User> {
    return this.findOne(
      { id },
      { relations: ['followingChannels', 'followingHashtags', 'manager'] },
    );
  }

  public async findAll(): Promise<User[]> {
    return this.find();
  }

  public async findAllByCompany(
    companyId: string,
    type: EntityType,
    skip: number,
    limit: number,
    search: string,
  ) {
    if (type == EntityType.ALL) {
      return this.createQueryBuilder('user')
        .leftJoinAndSelect('user.company', 'companies')
        .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('user.manager', 'users')
        .where(
          `user.company_id = :companyId AND 
           ((LOWER(user.first_name) like :name) OR 
           (LOWER(user.last_name) like :name) OR 
           (LOWER(user.email) like :name))`,
          {
            companyId,
            name: `%${search.toLowerCase()}%`,
          },
        )
        .offset(skip)
        .limit(limit)
        .orderBy('user.created_at', 'ASC')
        .getManyAndCount();
    } else {
      const isActive = type == EntityType.ACTIVE;
      return this.createQueryBuilder('user')
        .leftJoinAndSelect('user.company', 'companies')
        .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('user.manager', 'users')
        .where(
          `user.company_id = :companyId AND 
           user.is_active = :isActive AND 
           ((LOWER(user.first_name) like :name) OR 
           (LOWER(user.last_name) like :name) OR 
           (LOWER(user.email) like :name))`,
          {
            isActive,
            companyId,
            name: `%${search.toLowerCase()}%`,
          },
        )
        .offset(skip)
        .limit(limit)
        .orderBy('user.created_at', 'ASC')
        .getManyAndCount();
    }
  }

  public async findManagersForCompany(company: Company) {
    return this.find({
      select: ['id', 'firstName', 'lastName'],
      where: { company: company },
      order: { firstName: 'ASC' },
    });
  }

  public async getChannelAdmins(company: Company) {
    return this.find({
      select: ['id', 'email'],
      where: { company: company },
      order: { email: 'ASC' },
    });
  }

  public async updateUser(user: Partial<User>): Promise<User> {
    return this.save(user);
  }

  public async findByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }
}
