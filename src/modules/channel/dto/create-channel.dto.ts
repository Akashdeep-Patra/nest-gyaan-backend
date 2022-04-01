import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ChannelType } from '../entities/channel.entity';

@Expose()
export class CreateChannelDto {
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
  @IsArray()
  readonly adminIds: string[];

  @ApiProperty()
  @IsArray()
  readonly associatedProductIds: string[];

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
}
