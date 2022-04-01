import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

@Expose()
export class PostAttachmentDto {
  @IsOptional()
  id: number;

  @IsString()
  @ApiProperty()
  url: string;

  @IsString()
  @ApiProperty()
  type: string;

  //size of file in bytes
  @ApiProperty()
  @IsNumberString()
  size: string;
}
