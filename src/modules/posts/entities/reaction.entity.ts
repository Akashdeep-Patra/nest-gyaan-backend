import { Expose } from 'class-transformer';
import { AuditBaseEntity } from 'src/modules/common/entities/audit-base.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Post } from './post.entity';

export enum ReactionsEnum {
  LIKE = 'like',
}
@Entity({ name: 'reactions' })
@Unique(['user', 'post'])
export class Reaction extends AuditBaseEntity {
  @Column({ type: 'enum', enum: ReactionsEnum, default: ReactionsEnum.LIKE })
  type: ReactionsEnum;

  @Expose()
  @ManyToOne(() => User, (user) => user.reactions)
  @JoinColumn()
  user: User;

  @Expose()
  @ManyToOne(() => Company, (company) => company.reactions)
  @JoinColumn()
  company: Company;

  @Expose()
  @ManyToOne(() => Post, (post) => post.reactions)
  @JoinColumn()
  post: Post;

  constructor(partialData?: Partial<Reaction>) {
    super();
    partialData && Object.assign(this, partialData);
  }
}
