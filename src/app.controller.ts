import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Country, State } from 'country-state-city';
import * as urlMetadata from 'url-metadata';
import { AppService } from './app.service';
import { GetUser } from './auth/decorators/get-current-user.decorator';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { FileUploadRequestTypes } from './modules/common/enums/s3-file-upload-features.enum';
import { User } from './modules/users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getCountryStates')
  @ApiQuery({
    name: 'country',
    required: false,
    description:
      'A country for which list of states should be returned, defaults to US',
  })
  getStates(@Query('country') country: string = 'US') {
    const countries = State.getStatesOfCountry(country);

    return countries?.map((country) => {
      return { name: country.name, shortCode: country.isoCode };
    });
  }

  @Get('urlInfo')
  @ApiQuery({
    name: 'url',
    required: true,
    description: 'A url for which the meta info needs to be fetched',
  })
  async urlInfo(@Query('url') url: string) {
    try {
      return await urlMetadata(url);
    } catch (err) {
      return { err };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getCountryTimeZones')
  @ApiQuery({
    name: 'country',
    required: false,
    description:
      'A country for which list of timezones should be returned, defaults to US',
  })
  getCountryTimeZones(@Query('country') country: string = 'US') {
    const cDetails = Country.getCountryByCode(country);
    return cDetails?.timezones?.map((tz) => tz.zoneName);
  }

  @ApiQuery({
    name: 'companyId',
    required: false,
    description:
      'Company Id is completely optional, this shall be used in case super admin is \
       making some requests to get urls for requests other than company logo',
  })
  @ApiQuery({
    name: 'requestType',
    enum: FileUploadRequestTypes,
  })
  @UseGuards(JwtAuthGuard)
  @Get('uploadUrl')
  getUploadUrl(
    @Query('id') id: string,
    @Query('fileName') filename: string,
    @Query('requestType') requestType: FileUploadRequestTypes,
    @Query('companyId') companyId: string,
    @GetUser() user: User,
  ) {
    console.log({ user, roles: user.roles });
    return this.appService.getUploadUrl(
      id,
      filename,
      requestType,
      user,
      companyId,
    );
  }
}
