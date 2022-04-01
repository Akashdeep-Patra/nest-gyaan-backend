import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { User } from '../users/entities/user.entity';
import { CommentsWithCountResponseDto } from './dto/comments/comments-with-count-response.dto';
import { CreateCommentDto } from './dto/comments/create-comment.dto';
import { GetCommentsForPostFilterDto } from './dto/comments/get-comments-for-post-filter.dto';
import { UpdateCommentDto } from './dto/comments/update-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostFilterDto } from './dto/get-posts-filter.dto';
import { GetUrlRequestDto } from './dto/get-url-request.dto';
import { PostReactDto } from './dto/post-react.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiBearerAuth()
@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ): Promise<UserResponseDto> {
    return this.postsService.create(createPostDto, req.user);
  }

  @Post(':id/uploadUrls')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: [GetUrlRequestDto] })
  getSignedUrls(
    @Param('id') id: string,
    @Body() getUrlRequestDto: GetUrlRequestDto[],
    @Request() req: any,
  ) {
    return this.postsService.generateSignedUrls(id, getUrlRequestDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() filterDto: GetPostFilterDto, @GetUser() user: User) {
    return this.postsService.findAll(filterDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.postsService.findOne(id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.update(id, updatePostDto, req.user);
  }
  //adding comment to a post
  @Post(':postId/comment')
  @ApiResponse({ type: PostResponseDto })
  @UseGuards(JwtAuthGuard)
  comment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user,
  ) {
    return this.postsService.comment(postId, createCommentDto, user);
  }
  //getting  comments to a post
  @Get(':postId/comment')
  @ApiResponse({ type: CommentsWithCountResponseDto })
  @UseGuards(JwtAuthGuard)
  getComments(
    @Param('postId') postId: string,
    @Query() getCommentsForPostFilterDto: GetCommentsForPostFilterDto,
    @GetUser() user,
  ) {
    return this.postsService.getComments(
      postId,
      getCommentsForPostFilterDto,
      user,
    );
  }
  //update comment
  @Patch(':commentId/comment')
  @UseGuards(JwtAuthGuard)
  editComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user,
  ) {
    return this.postsService.editComment(commentId, updateCommentDto, user);
  }
  //delete comment
  @Delete(':commentId/comment')
  @UseGuards(JwtAuthGuard)
  deleteComment(@Param('commentId') commentId: string, @GetUser() user) {
    return this.postsService.deactivateComment(commentId, user);
  }

  // @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  // @react(':id')
  @UseGuards(JwtAuthGuard)
  @Patch(':id/react')
  react(
    @Param('id') id: string,
    @Body() postReactDto: PostReactDto,
    @GetUser() user: User,
  ) {
    return this.postsService.likeOrUnlike(id, postReactDto, user);
  }
}
