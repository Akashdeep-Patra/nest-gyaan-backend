import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/modules/users/entities/user.entity";

export class LoginRequestDto {

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty()
  readonly username: string;

  @IsString()
  @ApiProperty()
  readonly password?: string;

  @IsOptional()
  readonly user: User;
}