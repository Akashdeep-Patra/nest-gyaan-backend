import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ExcludeBaseFieldsDto {
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;

  @Exclude()
  @IsOptional()
  @ApiHideProperty()
  createdBy?: string;

  @Exclude()
  @IsOptional()
  @ApiHideProperty()
  updatedBy?: string;
}
