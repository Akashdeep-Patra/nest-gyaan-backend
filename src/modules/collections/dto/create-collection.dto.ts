import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty()
  @IsString()
  @Length(2, 50)
  name: string;
}
