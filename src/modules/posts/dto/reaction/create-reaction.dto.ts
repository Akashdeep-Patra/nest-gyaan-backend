import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ReactionsEnum } from '../../entities/reaction.entity';

@Expose()
export class CreateReactionDto {
  @ApiProperty({ required: false })
  @IsEnum(ReactionsEnum)
  @IsOptional()
  type?: ReactionsEnum;

  @ApiProperty({ required: true })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  postId: string;
}
