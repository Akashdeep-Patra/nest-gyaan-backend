import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { Company } from '../company/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { GetChannelFilterDto } from './dto/get-channel-filter.dto';
import { Channel } from './entities/channel.entity';

@EntityRepository(Channel)
export class ChannelRepository extends BaseRepository<Channel> {
  public async addChannel(channel: Partial<Channel>) {
    return this.save(channel);
  }

  public async findOneById(id: string): Promise<Channel> {
    const query = this.createQueryBuilder('channel')
      .leftJoinAndSelect('channel.company', 'channel_admins_users')
      .leftJoinAndSelect('channel.followers', 'channel_followers_users')
      .leftJoinAndSelect('channel.admins', 'users')
      .leftJoinAndSelect(
        'channel.associatedProducts',
        'channel_associated_products_channel',
      )
      .where(`channel.id = :id `, {
        id: id,
      });

    return query.getOne();
  }
  public findDefaultChannelForCompany(company: Company) {
    return this.findOne({ company: company, isDefault: true });
  }
  public async findAllChannelsByMyCompany(user: User): Promise<Channel[]> {
    return this.find({ company: user.company });
  }

  public async updateChannel(channel: Partial<Channel>) {
    return this.save(channel);
  }

  public async getChannels(
    dto: GetChannelFilterDto,
    user: User,
  ): Promise<Channel[]> {
    const query = this.createQueryBuilder('channel')
      .leftJoinAndSelect('channel.company', 'channel_admins_users')
      .leftJoinAndSelect('channel.followers', 'channel_followers_user')
      .leftJoinAndSelect('channel.admins', 'user')
      .leftJoinAndSelect(
        'channel.associatedProducts',
        'channel_associated_products_channel',
      )
      .where(`channel.company_id = :companyId `, {
        companyId: user.company.id,
      });
    if (dto.nameText) {
      query.andWhere('LOWER(channel.name) LIKE LOWER(:nameText)', {
        nameText: dto.nameText,
      });
    }
    if (dto.aboutText) {
      query.andWhere('LOWER(channel.about) LIKE LOWER(:aboutText)', {
        aboutText: dto.aboutText,
      });
    }
    if (dto.type) {
      query.andWhere('channel.type = :type', {
        type: dto.type,
      });
    }
    if (dto.isActive !== undefined) {
      query.andWhere('channel.is_active = :isActive', {
        isActive: dto.isActive,
      });
    }
    if (dto.isSelf !== undefined) {
      query.andWhere('channel.is_self = :isSelf', {
        isSelf: dto.isSelf,
      });
    }
    if (dto.winLoss !== undefined) {
      query.andWhere('channel.win_loss = :winLoss', {
        winLoss: dto.winLoss,
      });
    }
    if (dto.battleCards !== undefined) {
      query.andWhere('channel.battle_cards = :battleCards', {
        battleCards: dto.battleCards,
      });
    }
    const channels: Channel[] = await query
      .orderBy('channel.name', 'ASC')
      .getMany();
    return channels;
  }

  async getAssociatedProducts(companyId: string): Promise<Channel[]> {
    return this.createQueryBuilder('channel')
      .where(`channel.company_id = :companyId AND is_active = true`, {
        companyId: companyId,
      })
      .getMany();
  }
}
