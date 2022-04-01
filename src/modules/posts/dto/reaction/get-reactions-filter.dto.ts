import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ReactionsEnum } from '../../entities/reaction.entity';

@Expose()
export class GetReactionsFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  readonly postId?: string;

  @ApiProperty({ required: false })
  @IsEnum(ReactionsEnum)
  @IsOptional()
  readonly type?: ReactionsEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly skip?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly limit?: number;
}
