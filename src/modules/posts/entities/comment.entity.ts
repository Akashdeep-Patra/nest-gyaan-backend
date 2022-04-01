import { Expose } from 'class-transformer';
import { IsAlpha, IsBoolean } from 'class-validator';
import { AuditBaseEntity } from 'src/modules/common/entities/audit-base.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity('comments')
@Tree('closure-table', {
  closureTableName: 'comments_closure',
  ancestorColumnName: (column) => 'ancestor_' + column.propertyName,
  descendantColumnName: (column) => 'descendant_' + column.propertyName,
})
export class Comment extends AuditBaseEntity {
  @Column()
  @Expose()
  @Index()
  @IsAlpha()
  content: string;

  @Column({ type: 'boolean', default: true })
  @Expose()
  @Index()
  @IsBoolean()
  isActive: boolean;

  @Expose()
  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn()
  post: Post;

  @Column({ type: 'boolean', default: true })
  @Index()
  @IsBoolean()
  isDirectComment: boolean;
  //Closure table stores relations between parent and child in a
  // separate table in a special way. It's efficient in both reads and writes
  @TreeChildren({ cascade: true })
  children: Comment[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Comment;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  @JoinColumn()
  author: User;
}
