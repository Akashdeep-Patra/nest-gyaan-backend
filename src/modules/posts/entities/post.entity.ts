import { Channel } from 'src/modules/channel/entities/channel.entity';
import { AuditBaseEntity } from 'src/modules/common/entities/audit-base.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Collection } from '../../collections/entities/collection.entity';
import { Hashtag } from '../../hashtag/entities/hashtag.entity';
import { Comment } from './comment.entity';
import { PostAttachment } from './post-attachment.entity';
import { Reaction } from './reaction.entity';

@Entity('posts')
export class Post extends AuditBaseEntity {
  @Column({ length: 10000 })
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn()
  author: User;

  @Column({ nullable: true })
  metaData: string;

  rePostCount: number;

  totalComments: number;

  @ManyToOne(() => Company, { eager: true })
  company: Company;

  @ManyToOne(() => Channel, { eager: true })
  channel: Channel;

  @OneToMany(() => PostAttachment, (attachments) => attachments.post, {
    cascade: true,
    eager: true,
  })
  attachments: PostAttachment[];

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  hashtags: Hashtag[];

  @OneToMany(() => Reaction, (reaction) => reaction.post, {
    cascade: true,
    eager: true,
  })
  reactions: Reaction[];

  @ManyToOne(() => Post, (post) => post.sharedTo, { nullable: true })
  @JoinColumn()
  rePostedFrom?: Post;

  @OneToMany(() => Post, (post) => post.rePostedFrom)
  sharedTo: Post[];
  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
    eager: true,
  })
  // @JoinColumn()
  comments: Comment[];

  @ManyToMany(() => Collection, (collection) => collection.posts)
  collections: Collection[];
}
