import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { Channel } from '../entities/channel.entity';

export class AssociatedProductResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  about: string;

  constructor(channel: Channel) {
    this.id = channel.id;
    this.name = channel.name;
    this.about = channel.about;
  }
}
