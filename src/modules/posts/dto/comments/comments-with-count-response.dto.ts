import { ApiProperty } from '@nestjs/swagger';
import { ExcludeBaseFieldsDto } from 'src/modules/common/dtos/exclude-base-fields.dto';
import { Comment } from '../../entities/comment.entity';
import { CommentResponseDto } from './comment-response.dto';

export class CommentsWithCountResponseDto extends ExcludeBaseFieldsDto {
  @ApiProperty()
  readonly totalComments: number;

  @ApiProperty({ type: [CommentResponseDto] })
  readonly comments: CommentResponseDto[];

  @ApiProperty()
  readonly postId: string;

  constructor(comments: Comment[], count: number, postId: string) {
    super();
    this.comments = comments.map((comm) => new CommentResponseDto(comm));
    this.totalComments = count ?? 0;
    this.postId = postId;
  }
}
