import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { pick } from 'lodash';
import { ExcludeBaseFieldsDto } from 'src/modules/common/dtos/exclude-base-fields.dto';
import { ChannelAdminResponseDto } from 'src/modules/users/dto/channelAdmin-response.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { Channel, ChannelType } from '../entities/channel.entity';
import { AssociatedProductResponseDto } from './associatedProdcuts-response.dto';
import { CompanyResponseChannel } from './company-response-for-channel.dto';

@Expose()
export class ChannelResponseDto extends ExcludeBaseFieldsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  readonly about: string;

  @ApiProperty()
  @IsEnum(ChannelType)
  readonly type: ChannelType;

  @ApiProperty()
  @IsBoolean()
  readonly isActive: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly isSelf: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly battleCards: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly winLoss: boolean;

  @ApiProperty({ type: [AssociatedProductResponseDto] })
  readonly associatedProducts: AssociatedProductResponseDto[];

  @ApiProperty({ type: JSON, nullable: true })
  bannerAsset: { url: string; fileName: string };

  @ApiProperty({ type: JSON, nullable: true })
  iconAsset: { url: string; fileName: string };

  @ApiProperty()
  @IsNumber()
  readonly followers: number;

  @ApiProperty({ type: [User] })
  readonly admins: ChannelAdminResponseDto[];

  @ApiProperty({ type: CompanyResponseChannel })
  readonly company: CompanyResponseChannel;

  constructor(channel: Channel) {
    super();

    Object.assign(
      this,
      pick(channel, [
        'id',
        'name',
        'about',
        'followers',
        'admins',
        'associatedProducts',
        'type',
        'isSelf',
        'winLoss',
        'isActive',
        'battleCards',
        'bannerAsset',
        'iconAsset',
      ]),
    );

    if (channel.company)
      this.company = new CompanyResponseChannel(channel.company);

    if (channel.associatedProducts?.length)
      this.associatedProducts = channel.associatedProducts.map(
        (prod) => new AssociatedProductResponseDto(prod),
      );

    this.followers = channel?.followers?.length ?? 0;
    if (channel.admins) {
      this.admins = channel.admins.map(
        (user) => new ChannelAdminResponseDto(user),
      );
    }
    if (channel.associatedProducts) {
      this.associatedProducts = channel.associatedProducts.map(
        (ch) => new ChannelResponseDto(ch),
      );
    }
  }
}

@Expose()
export class ChannelResponsesDto {
  @ApiProperty({ type: [ChannelResponseDto] })
  readonly channels: ChannelResponseDto[];

  constructor(channels: Channel[]) {
    this.channels = channels.map((channel) => new ChannelResponseDto(channel));
  }
}
