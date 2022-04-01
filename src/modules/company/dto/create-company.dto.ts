import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, ValidateNested } from "class-validator";
import { AddressDto } from "src/modules/common/dtos/address.dto";

@Expose()
export class CreateCompanyDto {

  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(50)
  email: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @IsString()
  @ApiProperty({
    example: 'Asia/Kolkata',
  })
  timezone?: string;

  @ApiProperty({ maxLength: 255, required: true })
  @IsUrl()
  websiteUrl: string;

  @IsOptional()
  @ApiProperty({ required: false })
  displayName: string;

  @IsOptional()
  @ApiProperty({ required: false })
  portalUrl: string;

  @IsOptional()
  @ApiProperty({ required: false })
  companyLogo: string;

  @IsOptional()
  @ApiProperty({ required: false })
  brandColor: string;

  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @ApiProperty()
  address?: AddressDto;
}
