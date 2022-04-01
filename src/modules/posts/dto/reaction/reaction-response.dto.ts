import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { pick } from 'lodash';
import { Reaction } from 'src/modules/posts/entities/reaction.entity';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { ReactionsEnum } from '../../entities/reaction.entity';

export class ReactionResponseDto {
  @ApiProperty()
  @IsUUID()
  @IsString()
  id: string;

  @ApiProperty({ type: UserResponseDto })
  readonly user: UserResponseDto;

  @ApiProperty({ type: 'enum', enum: ReactionsEnum })
  @IsEnum(ReactionsEnum)
  readonly type: ReactionsEnum;

  constructor(reaction: Reaction) {
    Object.assign(this, pick(reaction, ['id', 'type']));

    // if (reaction.user) this.user = new UserResponseDto(reaction.user);
  }
}
