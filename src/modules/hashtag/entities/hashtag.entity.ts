import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { AuditBaseEntity } from 'src/modules/common/entities/audit-base.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity('hashtag')
@Unique(['name', 'company'])
export class Hashtag extends AuditBaseEntity {
  @Column({ length: 256 })
  @Expose()
  @Index({ fulltext: true })
  @IsString()
  @IsNotEmpty()
  @Length(1)
  name: string;

  @Column()
  isActive: boolean;

  @Column()
  @IsNumber()
  frequency: number;

  @ManyToOne(() => Company, (company) => company.hashtags, { eager: false })
  @JoinColumn()
  company: Company;

  @ManyToMany(() => Post, (post) => post.hashtags, { eager: false })
  @JoinTable()
  posts: Post[];

  @ManyToMany(() => User, (user) => user.followingHashtags, {
    eager: false,
    cascade: true,
  })
  @JoinTable()
  followers: User[];
}
