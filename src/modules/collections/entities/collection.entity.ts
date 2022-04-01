import { Expose } from 'class-transformer';
import { AuditBaseEntity } from 'src/modules/common/entities/audit-base.entity';
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
  OneToMany,
  Unique,
} from 'typeorm';

@Entity('collections')
@Unique(['name', 'user'])
export class Collection extends AuditBaseEntity {
  @Expose()
  @Index()
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.collections, { eager: true })
  @JoinColumn()
  user: User;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToMany(() => Post, (post) => post.collections, {
    eager: true,
    cascade: ['update'],
  })
  @JoinTable()
  posts: Post[];
}
