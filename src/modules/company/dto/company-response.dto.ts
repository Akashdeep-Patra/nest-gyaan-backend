import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";
import { AddressDto } from "src/modules/common/dtos/address.dto";
import { ExcludeBaseFieldsDto } from "src/modules/common/dtos/exclude-base-fields.dto";
import { Company } from "../entities/company.entity";
import { pick } from "lodash"

@Expose()
export class CompanyResponseDto extends ExcludeBaseFieldsDto {
  @IsUUID()
  id: string

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  timezone?: string;

  @IsUrl()
  websiteUrl: string;

  @IsOptional()
  displayName?: string;

  @IsOptional()
  portalUrl?: string;

  @IsOptional()
  companyLogo?: string;

  @IsOptional()
  brandColor?: string;

  @Type(() => AddressDto)
  address: AddressDto;


  constructor(company: Company) {
    super();

    Object.assign(
      this,
      pick(company, [
        'id',
        'name',
        'email',
        'isActive',
        'timezone',
        'websiteUrl',
        'displayName',
        'brandColor',
        'companyLogo',
        'portalUrl',
        'createdAt'
      ])
    );
    this.address = CompanyResponseDto.setAddress(company);
  }

  private static setAddress(company: Company): AddressDto {
    return {
      line1: company.line1,
      line2: company.line2,
      city: company.city,
      state: company.state,
      country: company.country,
      zipcode: company.zipcode + '',
    };
  }
}