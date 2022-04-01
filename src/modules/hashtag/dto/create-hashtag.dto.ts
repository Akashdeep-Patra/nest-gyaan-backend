import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateHashtagDto {
  @ApiProperty()
  @IsString()
  @Length(2, 256)
  name: string;
}
