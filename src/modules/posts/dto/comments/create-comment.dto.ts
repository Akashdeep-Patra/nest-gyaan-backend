import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ required: true })
  @IsString()
  @Length(2)
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  commentId: string;
}
