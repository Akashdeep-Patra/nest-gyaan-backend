import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDataURI, IsString, IsUUID } from 'class-validator';
import { pick } from 'lodash';
import { ExcludeBaseFieldsDto } from 'src/modules/common/dtos/exclude-base-fields.dto';
import { Comment } from '../../entities/comment.entity';
import { UserResponsePostDto } from '../user-response-for-post.dto';

export class CommentResponseDto extends ExcludeBaseFieldsDto {
  @ApiProperty()
  @IsUUID()
  readonly id: string;

  @ApiProperty()
  @IsString()
  readonly content: string;

  @ApiProperty()
  @IsBoolean()
  readonly isDirectComment: boolean;

  @ApiProperty()
  @IsDataURI()
  readonly createdAt: Date;

  @ApiProperty()
  @IsDataURI()
  readonly updatedAt: Date;

  @ApiProperty({ type: [CommentResponseDto] })
  children: CommentResponseDto[];

  @ApiProperty({ type: UserResponsePostDto })
  author: UserResponsePostDto;

  constructor(comment: Comment) {
    super();

    Object.assign(
      this,
      pick(comment, ['id', 'content', 'createdAt', 'updatedAt']),
    );

    this.author = new UserResponsePostDto(comment.author);

    if (comment?.children?.length)
      this.children = comment.children.map(
        (comm) => new CommentResponseDto(comm),
      );
  }
}
