import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { pick } from 'lodash';
import { ExcludeBaseFieldsDto } from 'src/modules/common/dtos/exclude-base-fields.dto';
import { PostAttachment } from '../../posts/entities/post-attachment.entity';

@Expose()
export class PostAttachmentResponseDto extends ExcludeBaseFieldsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty()
  readonly url: string;

  @ApiProperty()
  readonly type: string;

  @ApiProperty()
  readonly postId: string;

  //size of file in bytes
  @ApiProperty()
  readonly size: string;

  constructor(attachment: PostAttachment, postId: string) {
    super();

    Object.assign(this, pick(attachment, ['id', 'url', 'type', 'size']));

    this.postId = postId;
  }
}
