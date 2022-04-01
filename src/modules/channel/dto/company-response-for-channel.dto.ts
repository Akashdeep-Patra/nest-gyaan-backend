import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { pick } from 'lodash';
import { ExcludeBaseFieldsDto } from 'src/modules/common/dtos/exclude-base-fields.dto';
import { Company } from 'src/modules/company/entities/company.entity';

@Expose()
export class CompanyResponseChannel extends ExcludeBaseFieldsDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  timezone?: string;

  @ApiProperty()
  @IsUrl()
  websiteUrl: string;

  @ApiProperty()
  @IsOptional()
  displayName?: string;

  @ApiProperty()
  @IsOptional()
  portalUrl?: string;

  constructor(company: Company) {
    super();

    Object.assign(
      this,
      pick(company, [
        'id',
        'name',
        'email',
        'timezone',
        'websiteUrl',
        'displayName',
        'portalUrl',
      ]),
    );
  }
}
