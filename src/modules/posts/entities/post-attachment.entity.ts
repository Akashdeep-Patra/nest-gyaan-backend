import { IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('post_attachments')
export class PostAttachment {
  @IsOptional()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  type: string;

  //size of file in bytes
  @Column({ type: 'bigint' })
  size: string;

  @ManyToOne(() => Post, (post) => post.attachments, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  post: Post;
}
