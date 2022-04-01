import { BadRequestException } from '@nestjs/common';
import { ChannelType } from 'src/modules/channel/entities/channel.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateChannelDto } from '../../channel/dto/create-channel.dto';
import { UpdateChannelDto } from '../../channel/dto/update-channel.dto';
import { Role } from '../entities/role.entity';
import { UserRole } from '../enums/user-roles.enum';

export class Utilities {
  public static addAuditFields(
    auditInfo: string,
    entity: any = {},
    isUpdate = false,
  ): any {
    if (isUpdate) {
      entity.updatedBy = auditInfo;
      entity.updatedAt = new Date().toUTCString();
    } else {
      entity.createdBy = auditInfo;
    }

    return entity;
  }

  public static validateCompanyName(name: string): boolean {
    const RegExpression = /^[a-zA-Z\s]*$/;
    return RegExpression.test(name);
  }

  public static isSuperAdmin(roles: Role[]): boolean {
    return roles.some((role) => role.name == UserRole.SUPER_ADMIN);
  }

  public static canBeChannelAdmin(user: User) {
    return user.roles.some((role) => role.name === UserRole.CONTENT_ADMIN);
  }

  public static extractHashTagsFromPost(content: string): string[] {
    //gets all words that start with a #  followed by a white space
    const allowedCharacterFormat = /^[A-Za-z0-9_-]+$/;
    const hashtags: string[] = [];
    const hashSeparated = content.split('#');
    hashSeparated.shift();
    for (const word of hashSeparated) {
      let i = 0;
      let concat = '';
      while (i < word.length && allowedCharacterFormat.test(word[i])) {
        concat += word[i];
        i += 1;
      }
      hashtags.push(concat.toLocaleLowerCase());
    }

    return hashtags;
  }

  public static isValidHashtagName(name: string) {
    //return false if includes hyphen
    //returns false if includes white space
    return !(name.includes('-') || name.includes(' '));
  }

  public static isValidChannelRequest(
    dto: CreateChannelDto | UpdateChannelDto,
  ) {
    if (
      (dto.type === ChannelType.PRODUCT || dto.type === ChannelType.COMPANY) &&
      (dto.winLoss === undefined || dto.battleCards === undefined)
    ) {
      return false;
    }
    if (
      dto.type !== ChannelType.PRODUCT &&
      dto.type !== ChannelType.COMPANY &&
      (dto.isSelf !== undefined ||
        dto.winLoss !== undefined ||
        dto.battleCards !== undefined)
    ) {
      return false;
    }

    return true;
  }
  public static isValidChannelUpdateRequest(
    dto: CreateChannelDto | UpdateChannelDto,
  ) {
    if (
      dto.type !== ChannelType.PRODUCT &&
      dto.type !== ChannelType.COMPANY &&
      (dto.isSelf !== undefined ||
        dto.winLoss !== undefined ||
        dto.battleCards !== undefined)
    ) {
      return false;
    }

    return true;
  }
}

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  callback(null, true);
};
