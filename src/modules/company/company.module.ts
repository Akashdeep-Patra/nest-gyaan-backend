import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRepository } from './company.repository';
import { S3FileService } from '../common/services/s3-file.services';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, S3FileService],
  imports: [TypeOrmModule.forFeature([CompanyRepository])]
})
export class CompanyModule { }
