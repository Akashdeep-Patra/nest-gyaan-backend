import { Expose } from 'class-transformer';
import { IsAlpha, IsEmail, IsOptional } from 'class-validator';
import { Channel } from 'src/modules/channel/entities/channel.entity';
import { AuditBaseEntity } from 'src/modules/common/entities/audit-base.entity';
import { Reaction } from 'src/modules/posts/entities/reaction.entity';
import { Column, Entity, Index, OneToMany, Unique } from 'typeorm';
import { Hashtag } from '../../hashtag/entities/hashtag.entity';

@Entity('company')
@Unique(['name'])
export class Company extends AuditBaseEntity {
  @Column({ length: 20 })
  @Expose()
  @Index()
  @IsAlpha()
  name: string;

  @Column({ length: 50 })
  @Expose()
  @Index()
  @IsEmail()
  email: string;

  @Column()
  isActive: boolean;

  @Column({ default: 'UTC' })
  timezone?: string;

  @Column({ length: 255 })
  websiteUrl: string;

  @Column()
  @Expose()
  line1: string;

  @Column({ nullable: true })
  @IsOptional()
  line2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ default: 'US' })
  country: string;

  @Column()
  zipcode: number;

  @Column({ length: 20, nullable: true })
  @IsAlpha()
  @IsOptional()
  displayName: string;

  @Column({ length: 255, nullable: true })
  @IsOptional()
  portalUrl: string;

  @Column({ nullable: true })
  @IsOptional()
  companyLogo: string;

  @Column({ nullable: true })
  @IsOptional()
  brandColor: string;

  @OneToMany(() => Channel, (channel) => channel.company, { cascade: true })
  channels: Channel[];

  @OneToMany(() => Hashtag, (hashtag) => hashtag.company)
  hashtags: Hashtag[];

  @OneToMany(() => Reaction, (reaction) => reaction.company)
  reactions: Reaction[];
}
