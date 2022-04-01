import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl, IsUUID } from 'class-validator';
import { pick } from 'lodash';
import { ExcludeBaseFieldsDto } from 'src/modules/common/dtos/exclude-base-fields.dto';
import { User } from 'src/modules/users/entities/user.entity';

export class UserResponsePostDto extends ExcludeBaseFieldsDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsUrl()
  readonly avatar: string;

  constructor(user: User, manager: User = null) {
    super();

    Object.assign(
      this,
      pick(user, [
        'id',
        'email',
        'firstName',
        'lastName',
        'designation',
        'avatar',
      ]),
    );
  }
}
