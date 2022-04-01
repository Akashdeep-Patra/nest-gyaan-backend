import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreatePostDto } from './create-post.dto';
import { PostAttachmentDto } from './post-attachment.dto';

@Expose()
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ValidateNested({ each: true })
  @Type(() => PostAttachmentDto)
  @ApiProperty({ type: [PostAttachmentDto] })
  attachments: PostAttachmentDto[];
}
