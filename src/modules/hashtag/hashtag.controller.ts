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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from '../common/enums/user-roles.enum';
import { User } from '../users/entities/user.entity';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { GetHashtagFilterDto } from './dto/get-hashtag-filter.dto';
import { HashtagResponseDto } from './dto/hashtag-response.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { HashtagService } from './hashtag.service';
@ApiBearerAuth()
@ApiTags('Hashtag')
@Controller('hashtags')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createHashtagDto: CreateHashtagDto,
    @GetUser({
      mustHaveRoles: [UserRole.CONTENT_ADMIN],
    })
    user: User,
  ) {
    return this.hashtagService.create(createHashtagDto, user);
  }

  @ApiResponse({ type: [HashtagResponseDto] })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query() getHashtagFilterDto: GetHashtagFilterDto,
    @GetUser() user: User,
  ) {
    return this.hashtagService.findAll(getHashtagFilterDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: HashtagResponseDto })
  @Get(':name')
  findOne(
    @Param('name') name: string,
    @GetUser() user: User,
  ): Promise<HashtagResponseDto> {
    return this.hashtagService.findOne(name, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: HashtagResponseDto })
  @Patch('follow/:name')
  follow(
    @Param('name') name: string,
    @GetUser() user: User,
  ): Promise<HashtagResponseDto> {
    return this.hashtagService.follow(name, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: HashtagResponseDto })
  @Patch('un-follow/:name')
  unFollow(
    @Param('name') name: string,
    @GetUser() user: User,
  ): Promise<HashtagResponseDto> {
    return this.hashtagService.unFollow(name, user);
  }
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: HashtagResponseDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHashtagDto: UpdateHashtagDto,
    @GetUser({
      mustHaveRoles: [UserRole.CONTENT_ADMIN],
    })
    user: User,
  ) {
    return this.hashtagService.update(id, user, updateHashtagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':name')
  async remove(
    @Param('name') name: string,
    @GetUser({
      mustHaveRoles: [UserRole.CONTENT_ADMIN],
    })
    user: User,
  ): Promise<{ message: string }> {
    return this.hashtagService.remove(name, user);
  }
}
