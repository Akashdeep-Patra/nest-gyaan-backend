import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddPostCollectionsDto {
  @ApiProperty()
  @IsString()
  postId: string;
}
