import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EntityType } from '../common/enums/entity-type.enums';
import { UserRole } from '../common/enums/user-roles.enum';
import { imageFileFilter } from '../common/utils/utilities';
import { User } from '../users/entities/user.entity';
import { CompanyService } from './company.service';
import { CompanyResponseDto } from './dto/company-response.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UploadLogo } from './dto/upload-logo.dto';

@ApiCookieAuth()
@ApiTags('Company')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'type', enum: EntityType, required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('type') type: EntityType = EntityType.ALL,
    @Query('skip') skip = 0,
    @Query('limit') limit = 50,
    @Query('search') search = '',
    @GetUser() user: User,
  ) {
    const companies = await this.companyService.findAll(
      type,
      skip,
      limit,
      search,
      user,
    );
    return companies;
  }

  @Get(':id/getCompanyConfig')
  getCompanyConfig(@Param('id') id: string) {
    return this.companyService.getCompanyConfig(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  // TODO: Add permissions to restrict the non super user admin from creating
  // companies once we add permissions against user
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @GetUser() user: User,
  ): Promise<CompanyResponseDto> {
    const company = await this.companyService.create(createCompanyDto, user);

    return new CompanyResponseDto(company);
  }

  @Get(':id/uploadUrl')
  @UseGuards(JwtAuthGuard)
  async getCompanyAvatarUrl(
    @Param('id') id: string,
    @GetUser({ mustHaveRoles: [UserRole.SUPER_ADMIN] }) user: User,
  ) {
    return this.companyService.getUploadCompanyLogo(id);
  }

  @Patch(':id/uploadLogo')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadLogo })
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { files: 1, fileSize: 10485760 },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile() avatar: Express.Multer.File,
    @Request() request,
  ) {
    const result = await this.companyService.uploadCompanyLogo(
      id,
      avatar,
      request.user,
    );
    return new CompanyResponseDto(result);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetUser() user: User,
  ) {
    return this.companyService.update(id, updateCompanyDto, user);
  }

  // @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
