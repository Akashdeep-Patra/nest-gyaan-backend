import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class AddressDto {
  @IsString()
  @ApiProperty()
  line1: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  line2?: string;

  @IsString()
  @ApiProperty()
  city: string;

  @IsString()
  @Length(2, 4)
  @ApiProperty()
  state: string;

  @IsOptional()
  @IsString()
  @Length(2, 4)
  @ApiProperty()
  country: string;

  @Length(5, 9)
  @ApiProperty()
  zipcode: string;
}
