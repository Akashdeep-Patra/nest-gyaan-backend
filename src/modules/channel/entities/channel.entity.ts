import { Expose } from 'class-transformer';
import {
  IsAlpha,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
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
  OneToMany,
} from 'typeorm';

export enum ChannelType {
  GENERAL = 'general',
  SOCIAL = 'social',
  COMPANY = 'company',
  PRODUCT = 'product',
}

@Entity('channel')
export class Channel extends AuditBaseEntity {
  @Column({ length: 20 })
  @Expose()
  @Index()
  @IsAlpha()
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  about: string;

  @Column({ type: 'jsonb', nullable: true })
  bannerAsset: { url: string; fileName: string };

  @Column({ type: 'jsonb', nullable: true })
  iconAsset: { url: string; fileName: string };

  @Column()
  isActive: boolean;

  @IsBoolean()
  @Column({ nullable: true })
  @IsOptional()
  isSelf: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', default: false, nullable: true })
  @IsOptional()
  isDefault: boolean;

  @IsOptional()
  @Column({ nullable: true })
  @IsBoolean()
  battleCards: boolean;

  @IsOptional()
  @Column({ nullable: true })
  @IsBoolean()
  winLoss: boolean;

  @ManyToOne(() => Company, (company) => company.channels, { eager: true })
  @JoinColumn()
  company: Company;

  @ManyToMany(() => User, (user) => user.followingChannels, { eager: true })
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.adminOfChannels, { eager: true })
  @JoinTable()
  admins: User[];

  @OneToMany(() => Post, (post) => post.channel)
  posts: Post[];

  @ManyToMany(() => Channel)
  @JoinTable({ joinColumn: { name: 'channel_id_1' } })
  associatedProducts: Channel[];

  @Column({ enum: ChannelType, type: 'enum', default: ChannelType.GENERAL })
  type: ChannelType;
}
