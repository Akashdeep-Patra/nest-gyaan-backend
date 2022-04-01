import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { pick } from 'lodash';
import { ExcludeBaseFieldsDto } from 'src/modules/common/dtos/exclude-base-fields.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { PostResponseDto } from '../../posts/dto/post-response.dto';
import { Collection } from '../entities/collection.entity';

export class CollectionResponseDto extends ExcludeBaseFieldsDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: [PostResponseDto] })
  readonly posts: PostResponseDto[];

  constructor(collection: Collection, user: User) {
    super();

    Object.assign(this, pick(collection, ['id', 'name']));
    this.posts = collection?.posts?.length
      ? collection.posts.map((post) => new PostResponseDto(post, user))
      : [];
  }
}
