import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ required: true })
  @IsString()
  @Length(2)
  content: string;
}
