import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Reaction } from 'src/modules/posts/entities/reaction.entity';
import { ChannelRepository } from '../channel/channel.repository';
import { S3FileService } from '../common/services/s3-file.services';
import { S3Utils } from '../common/utils/s3-utils';
import { Utilities } from '../common/utils/utilities';
import { Hashtag } from '../hashtag/entities/hashtag.entity';
import { HashtagRepository } from '../hashtag/hashtag.repository';
import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/user.repository';
import { CommentRepository } from './comments.repository';
import { CommentsWithCountResponseDto } from './dto/comments/comments-with-count-response.dto';
import { CreateCommentDto } from './dto/comments/create-comment.dto';
import { GetCommentsForPostFilterDto } from './dto/comments/get-comments-for-post-filter.dto';
import { UpdateCommentDto } from './dto/comments/update-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostFilterDto } from './dto/get-posts-filter.dto';
import { GetUrlRequestDto } from './dto/get-url-request.dto';
import { GetUrlResponseDto } from './dto/get-url-response.dto';
import { PostReactDto } from './dto/post-react.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Comment } from './entities/comment.entity';
import { PostAttachment } from './entities/post-attachment.entity';
import { Post } from './entities/post.entity';
import { PostsRepository } from './posts.repository';
import { ReactionRepository } from './reactions.repository';
import { PostUtls } from './utils/post.utils';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private userRepository: UserRepository,
    private hashtagRepository: HashtagRepository,
    private channelRepository: ChannelRepository,
    private reactionsRepository: ReactionRepository,
    private commentRepository: CommentRepository,
  ) {}

  async create(createPostDto: CreatePostDto, currentUser: any) {
    const user = await this.userRepository.findOneById(currentUser.id);
    // console.log('user', user);
    if (!user) {
      throw new BadRequestException('Invalid user.');
    } else if (Utilities.isSuperAdmin(user.roles)) {
      throw new BadRequestException(
        'Yuu do not have permissions to create posts',
      );
    }
    const post: Partial<Post> = createPostDto;
    post.metaData = JSON.stringify(createPostDto?.metaDataForLink);
    Utilities.addAuditFields(user.id, post, false);
    if (createPostDto.rePostedFromPostId) {
      const parentPost = await this.postsRepository.findOneById(
        createPostDto.rePostedFromPostId,
      );
      if (!parentPost)
        throw new BadRequestException(
          'Error Sharing post. Sharing Invalid post.',
        );

      post.rePostedFrom = parentPost;
    }
    const hashtags: Partial<Hashtag>[] = [];
    const extractedHashtags = Utilities.extractHashTagsFromPost(
      createPostDto.content,
    );
    const hashtagsInDb = await this.hashtagRepository.findAllForPosts(
      extractedHashtags,
      user,
    );

    for (let i = 0; i < extractedHashtags.length; i++) {
      const tagInDb = hashtagsInDb.find(
        (tag) => tag.name === extractedHashtags[i].toLowerCase(),
      );
      if (tagInDb) {
        tagInDb.frequency += 1;
        Utilities.addAuditFields(user.id, tagInDb, true);
        hashtags.push(tagInDb);
      } else {
        const newTag = new Hashtag();
        newTag.name = extractedHashtags[i].toLowerCase();
        newTag.isActive = true;
        newTag.frequency = 1;
        //name with company should unique
        newTag.company = user.company;
        Utilities.addAuditFields(user.id, newTag, false);
        hashtags.push(newTag);
      }
    }
    post.hashtags = (await this.hashtagRepository.manager.save(
      hashtags,
    )) as Hashtag[];
    post.author = user;
    post.company = user.company;
    //take the default channel if not already provided
    post.channel = createPostDto.channelId
      ? await this.channelRepository.findOneById(createPostDto.channelId)
      : await this.channelRepository.findDefaultChannelForCompany(user.company);

    try {
      console.log('before saving post');
      const savedPost = await this.postsRepository.addPost(post);
      console.log('savedPost', savedPost);
      return new PostResponseDto(savedPost, user);
    } catch (err) {
      console.log(err);
      Logger.error('Error in creating new Post.', err);
      return err;
    }
  }

  async generateSignedUrls(
    id: string,
    requestUrls: GetUrlRequestDto[],
    currentUser: any,
  ) {
    const user = await this.userRepository.findOneById(currentUser.id);
    if (!user) {
      throw new BadRequestException('Invalid user.');
    }

    const post = await this.postsRepository.findOneById(id);
    if (!post) {
      throw new BadRequestException('The post is not valid.');
    }

    const s3FileService: S3FileService = new S3FileService();
    const responseUrls: Partial<GetUrlResponseDto>[] = [];
    for (let i = 0; i < requestUrls.length; i++) {
      const requestUrl = requestUrls[i];
      const url = S3Utils.getPostCloudfrontUrl(
        post.id,
        post.company.name,
        requestUrl.fileName,
      );

      const responseUrl: Partial<GetUrlResponseDto> = requestUrl;
      responseUrl.fileUrl = url;
      responseUrls.push(responseUrl);
    }

    return responseUrls;
  }

  async findAll(dto: GetPostFilterDto, currentUser: User) {
    const user = await this.userRepository.findOneById(currentUser.id);
    if (!user) {
      throw new BadRequestException('Invalid user.');
    }

    const posts = await this.postsRepository.findAllPosts(dto, user);

    const filteredPosts = posts.map(
      (post) =>
        new PostResponseDto(
          {
            ...post,
            comments: post.comments.filter((comm) => comm.isActive).slice(0, 3),
          },
          user,
          post.comments.filter((comm) => comm.isActive).length,
        ),
    );
    return filteredPosts;
  }

  async findOne(id: string, currentUser: any) {
    const user = await this.userRepository.findOneById(currentUser.id);
    if (!user) {
      throw new BadRequestException('Invalid user.');
    }

    const post = await this.postsRepository.findOneById(id);
    if (
      !Utilities.isSuperAdmin(user.roles) &&
      post.company.id != user.company.id
    ) {
      throw new BadRequestException('The requested post is invalid.');
    }
    const commentsWithCount = await this.commentRepository.getCommentsBy(
      'post_id',
      post.id,
    );

    post.comments = commentsWithCount.comments
      .filter((comm) => comm.isActive)
      .slice(0, 3);
    return new PostResponseDto(post, user, commentsWithCount.comments.length);
  }

  async update(id: string, updatePostDto: UpdatePostDto, currentUser: any) {
    const user = await this.userRepository.findOneById(currentUser.id);
    if (!user) {
      throw new BadRequestException('Invalid user.');
    }

    const post = await this.postsRepository.findOneById(id);
    if (!post) {
      throw new BadRequestException('The post is not valid.');
    }

    const hashtags: Partial<Hashtag>[] = [];
    const extractedHashtags = Utilities.extractHashTagsFromPost(
      updatePostDto?.content ?? '',
    );

    const hashtagsInDb = await this.hashtagRepository.findAllForPosts(
      extractedHashtags,
      user,
    );
    for (let i = 0; i < extractedHashtags.length; i++) {
      const tagInDb = hashtagsInDb.find(
        (tag) => tag.name === extractedHashtags[i],
      );
      if (tagInDb) {
        tagInDb.frequency += 1;
        Utilities.addAuditFields(user.id, tagInDb, true);
        hashtags.push(tagInDb);
      } else {
        const newTag = new Hashtag();
        newTag.name = extractedHashtags[i];
        newTag.isActive = true;
        newTag.frequency = 1;
        //name with company should unique
        newTag.company = user.company;
        Utilities.addAuditFields(user.id, newTag, false);
        hashtags.push(newTag);
      }
    }

    if (updatePostDto.attachments) {
      if (PostUtls.hasMixedMimeTypes(updatePostDto.attachments)) {
        throw new BadRequestException(
          'Post can not contain mixed attachment types.',
        );
      }

      if (updatePostDto.attachments.length > 10) {
        throw new BadRequestException(
          'Total attachments to the posts cannot be more than 10.',
        );
      }

      const videos = updatePostDto.attachments.filter((at) => {
        at.type.includes('video');
      });
      if (videos.length > 1) {
        throw new BadRequestException(
          'Total video attachments to the posts cannot be more than 1.',
        );
      }

      const audios = updatePostDto.attachments.filter((at) => {
        at.type.includes('audio');
      });
      if (videos.length > 1) {
        throw new BadRequestException(
          'Total video attachments to the posts cannot be more than 1.',
        );
      }

      const newAttachments: PostAttachment[] = updatePostDto.attachments.map(
        (at) => {
          const existingAt = post.attachments.find((a) => at.url == a.url);
          // return the existing attachment or create a new attachment obj
          return (
            existingAt ??
            ({
              type: at.type,
              url: at.url,
              post: post,
              size: at.size,
            } as PostAttachment)
          );
        },
      );

      post.attachments = newAttachments;
    }

    try {
      if (updatePostDto.content) {
        post.hashtags = (await this.hashtagRepository.manager.save(
          hashtags,
        )) as Hashtag[];
      }
      const savedPost = await this.postsRepository.updatePost(post);
      return new PostResponseDto(savedPost, user);
    } catch (error) {
      Logger.error('Error in creating new Post.', error);
      return error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async likeOrUnlike(id: string, postReactDto: PostReactDto, authUser: User) {
    const user = await this.userRepository.findOneById(authUser.id);
    const foundReaction = await this.reactionsRepository.findByPostAndUser(
      user,
      id,
    );
    if (foundReaction) {
      await this.reactionsRepository.remove(foundReaction);
      return new PostResponseDto(
        await this.postsRepository.findOneById(id),
        user,
      );
    }
    const post = await this.postsRepository.findOneById(id);
    const newReaction = new Reaction();
    newReaction.company = user.company;
    newReaction.user = user;
    if (postReactDto.type) {
      newReaction.type = postReactDto.type;
    }
    Utilities.addAuditFields(user.id, newReaction, false);
    post.reactions = [...post.reactions, newReaction];
    return new PostResponseDto(await this.postsRepository.save(post), user);
  }
  async comment(postId: string, dto: CreateCommentDto, authUser: User) {
    const user = await this.userRepository.findOneById(authUser.id);
    const post = await this.postsRepository.findOneById(postId);
    if (!post) throw new NotFoundException('Post not found');
    const comment = new Comment();
    comment.content = dto.content;
    if (dto.commentId) {
      comment.isDirectComment = false;
      comment.parent = await this.commentRepository.findOneById(dto.commentId);
    } else {
      comment.parent = null;
    }
    comment.author = user;
    Utilities.addAuditFields(user.id, comment, false);
    post.comments = post?.comments?.length
      ? [...post.comments, comment]
      : [comment];

    const newPost = await this.postsRepository.save(post);
    const commentsAndCount = await this.commentRepository.getCommentsBy(
      'post_id',
      newPost.id,
    );
    newPost.comments = commentsAndCount.comments;
    newPost.totalComments = commentsAndCount.count;
    return new PostResponseDto(post, user);
  }

  async editComment(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
    authUser: User,
  ) {
    const user = await this.userRepository.findOneById(authUser.id);
    const comment = await this.commentRepository.findOneById(commentId);
    if (comment?.createdBy !== user.id)
      throw new BadRequestException('You are not authorized');

    comment.content = updateCommentDto.content;
    Utilities.addAuditFields(user.id, comment, true);
    await this.commentRepository.save(comment);

    return { message: 'Comment successfully updated' };
  }

  async deactivateComment(commentId: string, authUser: User) {
    const user = await this.userRepository.findOneById(authUser.id);
    const comment = await this.commentRepository.findOneById(commentId);
    if (comment?.createdBy !== user.id)
      throw new BadRequestException('You are not authorized');
    // await this.commentRepository.save()
    const lineOfNodes = [
      comment,
      ...(await this.commentRepository.manager
        .getTreeRepository(Comment)
        .findDescendants(comment)),
    ];
    await this.commentRepository.save(
      lineOfNodes.map((comm) => {
        comm.isActive = false;
        Utilities.addAuditFields(user.id, comm, true);
        return comm;
      }),
    );

    return { message: 'Comment successfully Deleted' };
  }

  async getComments(
    postId: string,
    getCommentsForPostFilterDto: GetCommentsForPostFilterDto,
    authUser: User,
  ): Promise<CommentsWithCountResponseDto> {
    const user = await this.userRepository.findOneById(authUser.id);
    if (!user) {
      throw new BadRequestException('Invalid user.');
    }

    const post = await this.postsRepository.findOneById(postId);
    if (!post) {
      throw new BadRequestException('The post is not valid.');
    }
    const commentsAndCount = await this.commentRepository.getCommentsBy(
      'post_id',
      post.id,
      getCommentsForPostFilterDto.limit,
      getCommentsForPostFilterDto.skip,
    );

    return new CommentsWithCountResponseDto(
      commentsAndCount.comments,
      commentsAndCount.count,
      post.id,
    );
  }
}
