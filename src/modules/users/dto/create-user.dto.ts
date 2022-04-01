import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserPermissionDto } from './user-permission.dto';

@Expose()
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({ maxLength: 50 })
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly firstName: string;

  @IsString()
  @ApiProperty()
  readonly lastName: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  readonly defaultChannelId: string;

  @IsString()
  @ApiProperty({ nullable: true })
  readonly managerId: string;

  // @ApiProperty()
  // readonly companyId: string;

  @IsString()
  @ApiProperty()
  readonly designation: string;

  @IsBoolean()
  @ApiProperty({ default: true })
  readonly isActive: boolean;

  @ValidateNested({ each: true })
  @Type(() => UserPermissionDto)
  @ApiProperty()
  permissions: UserPermissionDto;
}
