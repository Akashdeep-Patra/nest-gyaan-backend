import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ChannelType } from '../entities/channel.entity';

@Expose()
export class GetChannelFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly nameText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  readonly aboutText?: string;

  @ApiProperty({ required: false })
  @IsEnum(ChannelType)
  @IsOptional()
  readonly type?: ChannelType;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly isSelf?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly battleCards?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly winLoss?: boolean;
}
