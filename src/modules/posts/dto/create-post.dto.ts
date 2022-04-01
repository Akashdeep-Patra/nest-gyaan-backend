import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsObject, IsOptional, IsString, Length } from 'class-validator';

@Expose()
export class CreatePostDto {
  @ApiProperty()
  @IsOptional()
  @Length(0, 10000)
  content: string;

  @ApiProperty({ type: JSON })
  @IsOptional()
  @IsObject()
  metaDataForLink?: JSON;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  channelId?: string;

  @ApiProperty({ readOnly: false })
  @IsString()
  @IsOptional()
  rePostedFromPostId?: string;
  // @IsOptional()
  // @ApiProperty({ default: false })
  // @IsBoolean()
  // hasAttachments: boolean;

  // @IsOptional()
  // @ApiProperty({ description: 'A List of name of hashtags' })
  // hashtags: string[];

  // @IsOptional()
  // @ApiProperty({ description: 'A List of user ids of mentioned users' })
  // mentions: string[];

  // TODO: add reactions
}
