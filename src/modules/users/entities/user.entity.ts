import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { Channel } from 'src/modules/channel/entities/channel.entity';
import { AuditBaseEntity } from 'src/modules/common/entities/audit-base.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Reaction } from 'src/modules/posts/entities/reaction.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Unique
} from 'typeorm';
import { Collection } from '../../collections/entities/collection.entity';
import { Hashtag } from '../../hashtag/entities/hashtag.entity';
import { Comment } from '../../posts/entities/comment.entity';
import { Role } from './../../common/entities/role.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class User extends AuditBaseEntity {
  @Expose()
  @Index()
  @IsEmail()
  @Column({ length: 50 })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  @IsOptional()
  password: string;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  @IsUUID()
  manager: User;

  @IsString()
  @Column()
  designation: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  roles: Role[];

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn()
  company: Company;

  @ManyToMany(() => Channel, (channel) => channel.admins)
  adminOfChannels: Channel[];

  @ManyToMany(() => Channel, (channel) => channel.followers)
  followingChannels: Channel[];

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.followers)
  followingHashtags: Hashtag[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Collection[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment;

  constructor(partialData?: Partial<User>) {
    super();
    partialData && Object.assign(this, partialData);
  }
}
