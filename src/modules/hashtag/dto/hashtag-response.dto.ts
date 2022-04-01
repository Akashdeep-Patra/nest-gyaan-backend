import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';
import { pick } from 'lodash';
import { ExcludeBaseFieldsDto } from 'src/modules/common/dtos/exclude-base-fields.dto';
import { Hashtag } from '../../hashtag/entities/hashtag.entity';

export class HashtagResponseDto extends ExcludeBaseFieldsDto {
  @IsUUID()
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNumber()
  readonly frequency: number;

  @ApiProperty()
  @IsBoolean()
  readonly isActive: boolean;

  @ApiProperty()
  @IsNumber()
  readonly followers: number;

  constructor(hashtag: Hashtag) {
    super();

    Object.assign(this, pick(hashtag, ['id', 'name', 'frequency', 'isActive']));
    this.followers = hashtag?.followers?.length ?? 0;
  }
}
