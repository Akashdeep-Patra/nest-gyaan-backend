import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
@Expose()
export class GetHashtagFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nameStartsWith?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform((value) => parseInt(value.value))
  @IsInt()
  skip?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform((value) => parseInt(value.value))
  @IsInt()
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  isActive?: boolean;
}
