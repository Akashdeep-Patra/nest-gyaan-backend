import { BadRequestException, Injectable } from '@nestjs/common';
import { FileUploadRequestTypes } from './modules/common/enums/s3-file-upload-features.enum';
import { S3Utils } from './modules/common/utils/s3-utils';
import { Utilities } from './modules/common/utils/utilities';
import { CompanyRepository } from './modules/company/company.repository';
import { User } from './modules/users/entities/user.entity';
import { UserRepository } from './modules/users/user.repository';

@Injectable()
export class AppService {
  constructor(
    private userRepository: UserRepository,
    private companyRepository: CompanyRepository,
  ) {}
  getHello(): string {
    return 'Hello there, you seem lost, please go to "https://gyaan.ai" for more info about us';
  }

  async getUploadUrl(
    id: string,
    filename: string,
    type: FileUploadRequestTypes,
    user: User,
    companyId?: string,
  ) {
    let company = user?.company;

    if (!company && Utilities.isSuperAdmin(user.roles)) {
      company = await this.companyRepository.findById(companyId || id);
      if (!company) {
        throw new BadRequestException('Can not find the company');
      }
    }

    return S3Utils.getUploadUrl(id, filename, type, company);
  }
}
