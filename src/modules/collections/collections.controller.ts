import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/modules/users/entities/user.entity';
import { CollectionsService } from './collections.service';
import { AddPostCollectionsDto } from './dto/add-post-collections.dto';
import { CollectionResponseDto } from './dto/collection-response.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { GetCollectionsFilterDto } from './dto/get-collections-filter.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@ApiBearerAuth()
@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @ApiResponse({ type: CollectionResponseDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCollectionDto: CreateCollectionDto,
    @GetUser() user: User,
  ) {
    return this.collectionsService.create(createCollectionDto, user);
  }

  @ApiResponse({ type: [CollectionResponseDto] })
  @ApiQuery({ type: GetCollectionsFilterDto })
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query() getCollectionsFilterDto: GetCollectionsFilterDto,
    @GetUser() user,
  ) {
    return this.collectionsService.findAll(getCollectionsFilterDto, user);
  }

  @ApiResponse({ type: CollectionResponseDto })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.collectionsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: CollectionResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @GetUser() user: User,
  ) {
    return this.collectionsService.update(id, updateCollectionDto, user);
  }

  @Patch(':collectionId/post')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: CollectionResponseDto })
  addPost(
    @Param('collectionId') collectionId: string,
    @Body() addPostCollectionsDto: AddPostCollectionsDto,
    @GetUser() user: User,
  ) {
    return this.collectionsService.addPost(
      collectionId,
      addPostCollectionsDto,
      user,
    );
  }
  @Patch(':collectionId/post/remove')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: CollectionResponseDto })
  removePost(
    @Param('collectionId') collectionId: string,
    @Body() addPostCollectionsDto: AddPostCollectionsDto,
    @GetUser() user: User,
  ) {
    return this.collectionsService.removePost(
      collectionId,
      addPostCollectionsDto,
      user,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @GetUser() user) {
    return this.collectionsService.remove(id, user);
  }
}
