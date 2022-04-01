import { configService } from 'src/config/config.service';
import { Company } from 'src/modules/company/entities/company.entity';
import {
  FileUploadFeatureType,
  FileUploadRequestTypes,
} from '../enums/s3-file-upload-features.enum';

export class S3Utils {
  public static getPostS3UrlKey(
    postId: string,
    companyName: string,
    filename: string,
  ) {
    return `${companyName}/${FileUploadFeatureType.POSTS}/${postId}/${filename}`;
  }

  public static getPostCloudfrontUrl(
    postId: string,
    companyName: string,
    filename: string,
  ) {
    const domain = configService.getCloudfrontAwsDomain();
    const http = configService.isSecure() ? 'https' : 'http';

    return `${http}://${domain}/assets/${companyName}/${FileUploadFeatureType.POSTS}/${postId}/${filename}`;
  }

  public static getUploadUrl(
    id: string,
    filename: string,
    type: FileUploadRequestTypes,
    company: Company,
  ) {
    const domain = configService.getCloudfrontAwsDomain();
    const http = configService.isSecure() ? 'https' : 'http';
    let key = '';

    switch (type) {
      case FileUploadRequestTypes.COMPANY_LOGO:
        key = `${FileUploadFeatureType.COMPANY_LOGO}/${filename}`;
        break;
      case FileUploadRequestTypes.USER_AVATAR:
        key = `${FileUploadFeatureType.USER_AVATAR}/${filename}`;
        break;
      case FileUploadRequestTypes.POSTS:
        key = `${FileUploadFeatureType.POSTS}/${id}/${filename}`;
        break;

      case FileUploadRequestTypes.CHANNEL_BANNER:
        key = `${FileUploadFeatureType.CHANNEL_BANNER}/${id}/${filename}`;
        break;
      case FileUploadRequestTypes.CHANNEL_ICON:
        key = `${FileUploadFeatureType.CHANNEL_ICON}/${id}/${filename}`;
        break;
    }

    if (key) {
      return `${http}://${domain}/assets/${company.name}/${key}`;
    }

    return null;
  }
}
