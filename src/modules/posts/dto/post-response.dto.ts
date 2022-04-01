import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { pick } from 'lodash';
import { ExcludeBaseFieldsDto } from 'src/modules/common/dtos/exclude-base-fields.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { ChannelResponseDto } from '../../channel/dto/channel-response.dto';
import { HashtagResponseDto } from '../../hashtag/dto/hashtag-response.dto';
import { Post } from '../entities/post.entity';
import { CommentResponseDto } from './comments/comment-response.dto';
import { CompanyResponseForPostDto } from './company-response-for-post.dto';
import { PostAttachmentDto } from './post-attachment.dto';
import { UserResponsePostDto } from './user-response-for-post.dto';

export class PostResponseDto extends ExcludeBaseFieldsDto {
  @IsString()
  @ApiProperty()
  readonly content: string;

  readonly attachments: PostAttachmentDto[];

  @ApiProperty({ type: UserResponsePostDto })
  readonly author: UserResponsePostDto;

  @ApiProperty({ type: CompanyResponseForPostDto })
  readonly company: CompanyResponseForPostDto;

  @ApiProperty({ type: ChannelResponseDto })
  readonly channel: ChannelResponseDto;

  @ApiProperty({ type: [HashtagResponseDto] })
  readonly hashtags: HashtagResponseDto[];

  @ApiProperty({ type: PostResponseDto })
  readonly rePostedFrom: PostResponseDto;

  @ApiProperty({ default: 0 })
  readonly reactions: number;
  @ApiProperty({ type: [CommentResponseDto] })
  readonly comments: CommentResponseDto[];

  @ApiProperty()
  readonly totalComments: number;

  @ApiProperty({ default: false })
  readonly isLikedByCurrentUser: boolean;

  @ApiProperty({ type: JSON })
  readonly metaData: JSON;

  @ApiProperty({ default: 0 })
  readonly rePostCount: number;

  @ApiProperty()
  readonly collectionId: string;

  constructor(post: Post, user: User, totalComments?: number) {
    super();

    Object.assign(
      this,
      pick(post, ['id', 'content', 'createdAt', 'updatedAt']),
    );

    this.isLikedByCurrentUser =
      user &&
      post?.reactions?.find((reaction) => reaction.createdBy === user.id)
        ? true
        : false;

    if (totalComments) this.totalComments = totalComments;
    if (post.attachments) {
      this.attachments = post.attachments.map((at) => {
        return {
          type: at.type,
          url: at.url,
          size: at.size,
        } as PostAttachmentDto;
      });
    }

    if (post?.collections?.length) {
      this.collectionId = post.collections.find(
        (coll) => coll.user.id === user?.id,
      )?.id;
    }

    if (post.metaData) this.metaData = JSON.parse(post.metaData);

    if (post?.sharedTo?.length) this.rePostCount = post?.sharedTo.length;
    else this.rePostCount = 0;

    if (post?.rePostCount) this.rePostCount = post?.rePostCount;

    if (post.hashtags) {
      this.hashtags = post.hashtags.map((tag) => new HashtagResponseDto(tag));
    }

    this.reactions = post?.reactions?.length ?? 0;

    if (post.channel) {
      this.channel = new ChannelResponseDto(post.channel);
    }

    if (post.rePostedFrom)
      this.rePostedFrom = new PostResponseDto(post.rePostedFrom, user);
    if (post.comments)
      this.comments = post.comments.map((comm) => new CommentResponseDto(comm));

    if (post.author) this.author = new UserResponsePostDto(post.author);

    if (post.company)
      this.company = new CompanyResponseForPostDto(post.company);
  }
}
