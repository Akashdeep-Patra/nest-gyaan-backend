import { Injectable } from '@nestjs/common';
import { Signer } from 'aws-sdk/clients/cloudfront';
import * as fs from 'fs';
import { configService } from 'src/config/config.service';

@Injectable()
export class CloudfrontService {
  keyPairId: string;
  privateKey: string;

  constructor() {
    this.keyPairId = configService.getAWSCloudfrontAccessKeyId();
    this.privateKey = fs
      .readFileSync(`./keys/pk-${this.keyPairId}.pem`)
      .toString('ascii');
  }

  getSignedCookie(domain: string): Promise<Signer.CustomPolicy> {
    return new Promise((resolve, reject) => {
      const httpMethod = configService.getValue('IS_SECURE') ? 'https' : 'http';
      const url = `${httpMethod}://${domain}/*`;
      const expiry = Date.now() + 86400 * 1000; // 1day

      const policy = {
        Statement: [
          {
            Resource: url,
            Condition: {
              DateLessThan: { 'AWS:EpochTime': expiry },
            },
          },
        ],
      };
      const policyString = JSON.stringify(policy);

      const signer = new Signer(this.keyPairId, this.privateKey);
      const options = { policy: policyString };
      signer.getSignedCookie(options, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
