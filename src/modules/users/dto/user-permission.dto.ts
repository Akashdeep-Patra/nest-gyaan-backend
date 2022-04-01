import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UserPermissionDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  readonly isAdmin: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  readonly canManageContent: boolean;
}
