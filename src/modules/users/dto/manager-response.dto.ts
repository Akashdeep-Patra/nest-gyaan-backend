import { IsString, IsUUID } from "class-validator";
import { User } from "../entities/user.entity";

export class ManagerResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = `${user.firstName} ${user.lastName}`
  }
}