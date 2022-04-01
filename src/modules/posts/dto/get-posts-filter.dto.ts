import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

@Expose()
export class GetPostFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly hasText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly hashtag?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform((value) => parseInt(value.value))
  @IsInt()
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform((value) => parseInt(value.value))
  @IsInt()
  skip: number;

  @ApiProperty({ required: false })
  @IsOptional()
  channelId: string;
}
