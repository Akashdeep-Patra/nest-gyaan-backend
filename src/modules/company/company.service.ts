import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { configService } from 'src/config/config.service';
import { Channel, ChannelType } from '../channel/entities/channel.entity';
import { AddressDto } from '../common/dtos/address.dto';
import { EntityType } from '../common/enums/entity-type.enums';
import { FileUploadFeatureType } from '../common/enums/s3-file-upload-features.enum';
import { S3FileService } from '../common/services/s3-file.services';
import { Utilities } from '../common/utils/utilities';
import { User } from '../users/entities/user.entity';
import { CompanyRepository } from './company.repository';
import { CompanyResponseDto } from './dto/company-response.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly s3fileUploadService: S3FileService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, currentUser: User) {
    if (!Utilities.isSuperAdmin(currentUser.roles)) {
      throw new BadRequestException(
        'You do not have permissions to perform this action.',
      );
    }

    const existingCompany: Company = await this.findCompanyWithUniqueFields(
      createCompanyDto,
    );
    if (existingCompany) {
      throw new BadRequestException(`The company already exists.`);
    }

    if (!Utilities.validateCompanyName(createCompanyDto.name)) {
      throw new BadRequestException(
        'Company Name must contain only Letters and Spaces.',
      );
    }

    let company: Partial<Company> = createCompanyDto;
    if (createCompanyDto.address) {
      company = this.setPatientAddressFields(company, createCompanyDto.address);
    }
    company = Utilities.addAuditFields(currentUser.id, company);
    const defaultChannel: Channel = new Channel();
    defaultChannel.name = createCompanyDto.name;
    defaultChannel.about = `This is a default channel for ${createCompanyDto.name}`;
    defaultChannel.isActive = true;
    defaultChannel.isDefault = true;
    defaultChannel.type = ChannelType.GENERAL;
    Utilities.addAuditFields(currentUser.id, defaultChannel, false);
    company.channels = [defaultChannel];
    try {
      const createCompany = await this.companyRepository.addCompany(company);
      return createCompany;
    } catch (e) {
      Logger.error('Error while creating company', e);
      throw new BadRequestException('Something went wrong.');
    }
  }

  setPatientAddressFields(
    company: Partial<Company>,
    addressDto: AddressDto,
  ): Partial<Company> {
    if (addressDto) {
      company.line1 = addressDto.line1;
      company.city = addressDto.city;
      company.state = addressDto.state;
      company.country = addressDto.country || 'US';
      company.zipcode = parseInt(addressDto.zipcode);

      return company;
    }
    return null;
  }

  findCompanyWithUniqueFields(
    partialCompany: Partial<Company>,
  ): Promise<Company> {
    return this.companyRepository.findByUniqueFields({
      name: partialCompany.name,
      email: partialCompany.email,
    });
  }

  async findAll(
    type: EntityType,
    skip: number,
    limit: number,
    search: string,
    currentUser: User,
  ) {
    if (!Utilities.isSuperAdmin(currentUser.roles)) {
      throw new BadRequestException(
        'You do not have permissions to perform this action.',
      );
    }

    const [companies, count] = await this.companyRepository.getAll(
      type,
      skip,
      limit,
      search,
    );
    const companyResponse = companies.map(
      (company) => new CompanyResponseDto(company),
    );
    return { companies: companyResponse, count };
  }

  async getCompanyConfig(id: string) {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new BadRequestException('The Company does not exist.');
    }
    return {
      name: company.name,
      displayName: company.displayName,
      logo: company.companyLogo,
      brandColor: company.brandColor,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    currentUser: User,
  ) {
    if (!Utilities.isSuperAdmin(currentUser.roles)) {
      throw new BadRequestException(
        'You do not have permissions to perform this action.',
      );
    }

    let company: Company = await this.companyRepository.findById(id);
    if (!company) {
      throw new BadRequestException(`The company does not exists.`);
    }

    if (!Utilities.validateCompanyName(updateCompanyDto.name)) {
      throw new BadRequestException(
        'Company Name must contain only Letters and Spaces.',
      );
    }

    company = Utilities.addAuditFields(currentUser.id, company, true);
    let updateCompany: Partial<Company> = updateCompanyDto;
    if (updateCompanyDto.address) {
      updateCompany = this.setPatientAddressFields(
        updateCompany,
        updateCompanyDto.address,
      );
    }

    try {
      const updatedCompany = { ...company, ...updateCompany };
      await this.companyRepository.updateCompany(updatedCompany);
      return new CompanyResponseDto(updatedCompany);
    } catch (err) {
      Logger.error('Error while updating company', err);
      throw new BadRequestException('Something went wrong.');
    }
  }

  async getUploadCompanyLogo(id: string) {
    const company = await this.companyRepository.findById(id);
    if (company) {
      const domain = configService.getCloudfrontAwsDomain();
      const http = configService.isSecure() ? 'https' : 'http';
      return `${http}://${domain}/assets/${company.name}/${FileUploadFeatureType.COMPANY_LOGO}/${id}`;
    } else {
      throw new BadRequestException('Company does not exist.');
    }
  }

  async uploadCompanyLogo(
    id: string,
    file: Express.Multer.File,
    user: any,
  ): Promise<Company> {
    if (id && file) {
      const company = await this.companyRepository.findById(id);
      if (company) {
        const uploadKey = `${company.name}/${FileUploadFeatureType.COMPANY_LOGO}/${id}`;
        const uploadResult = await this.s3fileUploadService.uploadFile(
          file,
          uploadKey,
        );

        company.companyLogo = uploadResult.Location;
        Utilities.addAuditFields(user.id, company, true);

        await this.companyRepository.update(id, company);

        return company;
      } else {
        throw new BadRequestException('Company does not exist.');
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
