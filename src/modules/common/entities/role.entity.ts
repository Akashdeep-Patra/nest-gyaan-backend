import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'roles' })
export class Role {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  displayName: string
}