import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, IsUUID } from 'class-validator';
import { pick } from 'lodash';
import { ExcludeBaseFieldsDto } from 'src/modules/common/dtos/exclude-base-fields.dto';
import { Company } from 'src/modules/company/entities/company.entity';

@Expose()
export class CompanyResponseForPostDto extends ExcludeBaseFieldsDto {
  @IsUUID()
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  companyLogo: string;

  constructor(company: Company) {
    super();

    Object.assign(this, pick(company, ['id', 'name', 'email', 'companyLogo']));
  }
}
