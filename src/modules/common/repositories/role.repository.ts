import { EntityRepository } from "typeorm";
import { BaseRepository } from "typeorm-transactional-cls-hooked";
import { Role } from "../entities/role.entity";

@EntityRepository(Role)
export class RoleRepository extends BaseRepository<Role> {
  async findByName(name: string) {
    return this.findOne({ name });
  }

}