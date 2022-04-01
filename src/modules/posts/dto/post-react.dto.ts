import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ReactionsEnum } from 'src/modules/posts/entities/reaction.entity';

@Expose()
export class PostReactDto {
  @ApiProperty({
    type: 'enum',
    enum: ReactionsEnum,
    default: ReactionsEnum.LIKE,
  })
  @IsEnum(ReactionsEnum)
  type: ReactionsEnum;
}
