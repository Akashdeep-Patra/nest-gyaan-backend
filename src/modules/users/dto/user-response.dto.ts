import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsString, IsUUID } from 'class-validator';
import { pick } from 'lodash';
import { ExcludeBaseFieldsDto } from 'src/modules/common/dtos/exclude-base-fields.dto';
import { Role } from 'src/modules/common/entities/role.entity';
import { UserRole } from 'src/modules/common/enums/user-roles.enum';
import { CompanyResponseDto } from 'src/modules/company/dto/company-response.dto';
import { UserPermissionDto } from 'src/modules/users/dto/user-permission.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { ChannelResponseDto } from '../../channel/dto/channel-response.dto';
import { HashtagResponseDto } from '../../hashtag/dto/hashtag-response.dto';

export class UserResponseDto extends ExcludeBaseFieldsDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  readonly manager: any;

  @ApiProperty()
  readonly company: any;

  @ApiProperty()
  readonly roles: Role[];

  @ApiProperty()
  @IsString()
  readonly designation: string;

  @ApiProperty()
  readonly isActive: boolean;

  @ApiProperty({ type: UserPermissionDto })
  @Type(() => UserPermissionDto)
  permissions: UserPermissionDto;

  @ApiProperty({ type: [HashtagResponseDto] })
  @Type(() => HashtagResponseDto)
  followingHashtags: HashtagResponseDto[];

  @ApiProperty({ type: [ChannelResponseDto] })
  @Type(() => ChannelResponseDto)
  followingChannels: ChannelResponseDto[];

  constructor(user: User) {
    super();

    Object.assign(
      this,
      pick(user, [
        'id',
        'email',
        'firstName',
        'lastName',
        'designation',
        'isActive',
        'avatar',
        'createdAt',
      ]),
    );

    this.permissions = UserResponseDto.setPermissions(user);

    if (user.company) {
      this.company = new CompanyResponseDto(user.company);
    }

    if (user.manager) {
      this.manager = UserResponseDto.setGenericUserResponse(user.manager);
    }

    if (user.roles) {
      this.roles = user.roles;
    }

    if (user.followingHashtags) {
      this.followingHashtags = user.followingHashtags.map(
        (tag) => new HashtagResponseDto(tag),
      );
    }
    if (user.followingChannels) {
      this.followingChannels = user.followingChannels.map(
        (channel) => new ChannelResponseDto(channel),
      );
    }
  }

  public static setGenericUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      designation: user.designation,
      avatar: user.avatar,
    };
  }

  public static setPermissions(user: User) {
    const isAdmin = user.roles?.some(
      (role) => role.name == UserRole.COMPANY_ADMIN,
    );
    const canManageContent = user.roles?.some(
      (role) => role.name == UserRole.CONTENT_ADMIN,
    );
    return {
      isAdmin,
      canManageContent,
    };
  }
}
