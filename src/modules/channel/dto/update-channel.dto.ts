import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateChannelDto } from './create-channel.dto';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  bannerUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  bannerFileName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  iconUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  iconAssetName: string;
}
