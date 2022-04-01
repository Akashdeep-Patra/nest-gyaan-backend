import { EntityRepository } from "typeorm";
import { BaseRepository } from "typeorm-transactional-cls-hooked";
import { EntityType } from "../common/enums/entity-type.enums";
import { Company } from "./entities/company.entity";
import ICompanyUniqueFields from "./interface/company-unique-fields.interface";

@EntityRepository(Company)
export class CompanyRepository extends BaseRepository<Company> {

  public getAll(type?: EntityType, skip?: number, limit?: number, search: string = '') {
    console.log('search', search)
    if (!type || type == EntityType.ALL) {
      return this.createQueryBuilder()
        .select()
        .where(`(LOWER(name) like :name)`, { name: `%${search.toLowerCase()}%` })
        .offset(skip)
        .limit(limit)
        .orderBy('created_at', "ASC")
        .getManyAndCount();
    } else {
      return this.createQueryBuilder()
        .select()
        .where(
          `is_active = :active AND (LOWER(name) like :name)`,
          {
            active: type == EntityType.ACTIVE,
            name: `%${search.toLowerCase()}%`
          }
        )
        .offset(skip)
        .limit(limit)
        .orderBy('created_at', "ASC")
        .getManyAndCount();
    }
  }

  public findById(id: string) {
    return this.findOne({ id });
  }

  public addCompany(company: Partial<Company>): Promise<Company> {
    return this.save(company);
  }

  public updateCompany(company: Partial<Company>): Promise<Company> {
    return this.save(company);
  }

  public findByUniqueFields(companyRequiredFields: ICompanyUniqueFields) {
    return this.createQueryBuilder()
      .select()
      .where(
        `LOWER(name) = :companyName`,
        {
          companyName: companyRequiredFields.name.toLowerCase(),
        }
      )
      .getOne();
  }

}