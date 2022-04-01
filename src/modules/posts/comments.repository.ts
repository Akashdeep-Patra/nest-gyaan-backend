import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { Comment } from './entities/comment.entity';

@EntityRepository(Comment)
export class CommentRepository extends BaseRepository<Comment> {
  public async addComment(post: Partial<Comment>) {
    return this.save(post);
  }

  public async findOneById(id: string): Promise<Comment> {
    return this.findOne({ id }, { relations: ['author'] });
  }

  // public async findAllComments(dto: GetPostFilterDto, user: User) {}

  public async updateComment(post: Partial<Comment>) {
    return this.save(post);
  }

  public async getCommentsBy(
    where: any,
    value: any,
    limit?: number,
    skip?: number,
    active?: boolean,
  ): Promise<{ comments: Comment[]; count: number }> {
    const escapeAlias = (alias: string) =>
      this.manager.connection.driver.escape(alias);
    const escapeColumn = (column: string) =>
      this.manager.connection.driver.escape(column);
    const parentPropertyName =
      this.manager.connection.namingStrategy.joinColumnName(
        this.metadata.treeParentRelation!.propertyName,
        this.metadata.primaryColumns[0].propertyName,
      );

    const [roots, count] = await this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where(
        `${escapeAlias('comment')}.${escapeColumn(parentPropertyName)} IS NULL`,
      )
      .andWhere(`${escapeAlias('comment')}.${escapeColumn(where)} = :value`, {
        value,
      })
      .andWhere('comment.is_active = :active', {
        active: active === undefined ? true : active,
      })
      .orderBy('comment.created_at', 'DESC')
      .limit(limit ?? 20)
      .offset(skip ?? 0)
      .getManyAndCount();

    // const comments = await Promise.all(
    //   roots.map((root) =>
    //     this.manager.getTreeRepository(Comment).findDescendantsTree(root),
    //   ),
    // );
    return { comments: roots, count };
  }
}
