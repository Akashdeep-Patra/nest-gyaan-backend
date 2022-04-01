import { Expose } from 'class-transformer';
import { PrimaryGeneratedColumn } from "typeorm"

export class BaseEntity {

  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
