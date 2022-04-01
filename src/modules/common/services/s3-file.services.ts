import { Injectable, Logger } from "@nestjs/common";
import { S3 } from 'aws-sdk';
import { configService } from "src/config/config.service";

@Injectable()
export class S3FileService {

  async uploadFile(file: Express.Multer.File, key: string) {
    const s3 = new S3();
    const uploadResult = await s3.upload({
      ACL: 'public-read',
      Bucket: configService.getValue('AWS_PUBLIC_BUCKET_NAME'),
      Body: file.buffer,
      ContentType: file.mimetype,
      Key: key,
    })
      .promise();

    Logger.log(`Uploaded file to AWS for ${ key }`);
    return uploadResult;
  }

  async getSignedUrl(key: string, fileType: string): Promise<string> {
    const params: any = {
      Bucket: configService.getValue('AWS_PUBLIC_BUCKET_NAME'),
      Key: key,
      Expires: 3600, // TODO: take this from either env or constants
      ACL: 'bucket-owner-full-control',
      ContentType: fileType,
    };

    const s3 = new S3();

    try {
      return s3.getSignedUrl('putObject', params);
    } catch (error) {
      Logger.error('Error while generating presigned url', error);
      return null;
    }
  }
}