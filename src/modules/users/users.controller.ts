import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { EntityType } from '../common/enums/entity-type.enums';
import { UserRole } from '../common/enums/user-roles.enum';
import { ChannelAdminResponseDto } from './dto/channelAdmin-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':companyId')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('companyId') companyId: string,
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: User,
  ) {
    return this.usersService.create(companyId, createUserDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'type', enum: EntityType, required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('companyId') companyId: string,
    @Query('type') type: EntityType = EntityType.ALL,
    @Query('skip') skip = 0,
    @Query('limit') limit = 50,
    @Query('search') search = '',
    @GetUser() user: User,
  ) {
    return this.usersService.findAll(
      companyId,
      type,
      skip,
      limit,
      search,
      user,
    );
  }

  @Get('/getManagers')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'companyId', required: false })
  findManagers(@Query('companyId') companyId: string, @GetUser() user: User) {
    return this.usersService.findManagers(companyId, user);
  }

  @Get('/channelAdmins')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: [ChannelAdminResponseDto] })
  channelAdmins(
    @GetUser({ mustHaveRoles: [UserRole.CONTENT_ADMIN] }) user: User,
  ): Promise<ChannelAdminResponseDto[]> {
    return this.usersService.findChannelAdmins(user);
  }

  @Get('/self')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: UserResponseDto })
  getLoggedInUser(@GetUser() user: User): Promise<UserResponseDto> {
    return this.usersService.getLoggedInUser(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateUserDto })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  // @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
