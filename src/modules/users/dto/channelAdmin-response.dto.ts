import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";
import { User } from "../entities/user.entity";


export class ChannelAdminResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
  }
}