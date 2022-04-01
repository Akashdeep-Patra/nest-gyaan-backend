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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Channel } from 'src/modules/channel/entities/channel.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRole } from '../common/enums/user-roles.enum';
import { ChannelService } from './channel.service';
import { AssociatedProductResponseDto } from './dto/associatedProdcuts-response.dto';
import {
  ChannelResponseDto,
  ChannelResponsesDto,
} from './dto/channel-response.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { GetChannelFilterDto } from './dto/get-channel-filter.dto';
import { PostAttachmentResponseDto } from './dto/post-attachment-response.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@ApiBearerAuth()
@ApiTags('Channel')
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}
  @ApiBody({ type: CreateChannelDto })
  @ApiResponse({ type: ChannelResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createChannelDto: CreateChannelDto,
    @GetUser({ mustHaveRoles: [UserRole.CONTENT_ADMIN] }) user: User,
  ): Promise<ChannelResponseDto> {
    return new ChannelResponseDto(
      await this.channelService.create(createChannelDto, user),
    );
  }

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @ApiResponse({ type: ChannelResponsesDto })
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() filterDto: GetChannelFilterDto,
    @GetUser() user: User,
  ): Promise<ChannelResponsesDto> {
    return new ChannelResponsesDto(
      await this.channelService.findAll(filterDto, user),
    );
  }

  @Get('/associatedProducts')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: [AssociatedProductResponseDto] })
  async associatedProducts(
    @GetUser({ mustHaveRoles: [UserRole.CONTENT_ADMIN] }) user: User,
  ): Promise<AssociatedProductResponseDto[]> {
    return this.channelService.getAssociatedProducts(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ChannelResponseDto })
  async findOne(
    @Param('id') id: string,
    @GetUser({ mustHaveRoles: [UserRole.CONTENT_ADMIN] }) user: User,
  ): Promise<ChannelResponseDto> {
    return new ChannelResponseDto(await this.channelService.findOne(id, user));
  }

  @Get(':channelId/assets/:type')
  @UseGuards(JwtAuthGuard)
  async getAllAssets(
    @Param('channelId') channelId: string,
    @Param('type') type: string,
    @GetUser({ mustHaveRoles: [UserRole.CONTENT_ADMIN] }) user: User,
  ): Promise<PostAttachmentResponseDto[]> {
    return this.channelService.getAllAssets(type, user, channelId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ChannelResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
    @GetUser({ mustHaveRoles: [UserRole.CONTENT_ADMIN] }) user: User,
  ): Promise<ChannelResponseDto> {
    return new ChannelResponseDto(
      await this.channelService.updateOne(id, updateChannelDto, user),
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ChannelResponseDto })
  @Patch(':id/follow')
  follow(@Param('id') id: string, @GetUser() user: User): Promise<Channel> {
    return this.channelService.follow(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ChannelResponseDto })
  @Patch(':id/un-follow')
  unFollow(@Param('id') id: string, @GetUser() user: User): Promise<Channel> {
    return this.channelService.unFollow(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @GetUser({ mustHaveRoles: [UserRole.CONTENT_ADMIN] }) user: User,
  ): Promise<{ message: string }> {
    return this.channelService.remove(id, user);
  }
}
