// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getLogLevel() {
    return this.getValue('LOG_LEVEL', true);
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV', false);
    return mode === 'production';
  }
  public isHeroku() {
    const isHeroku = this.getValue('IS_HEROKU', false);
    return isHeroku == 'true';
  }

  public getRootUrl() {
    return this.getValue('ROOT_URL', true);
  }

  public getOrigin() {
    const origin = this.getValue('ORIGIN', true);
    return new RegExp(origin);
  }
  public getMailerHost() {
    return this.getValue('MAILER_SERVICE_HOST', true);
  }
  public getMailerPort() {
    return parseInt(this.getValue('MAILER_SERVICE_PORT', true));
  }
  public getMailerEmail() {
    return this.getValue('MAILER_SERVICE_EMAIL', true);
  }
  public getCacheHost() {
    return this.getValue('CACHE_SERVICE_HOST', true);
  }
  public getCachePort() {
    return parseInt(this.getValue('CACHE_SERVICE_HOST', true));
  }
  public getEnv() {
    return this.getValue('NODE_ENV', true);
  }

  public getCloudfrontAwsDomain() {
    return configService.getValue('AWS_CLOUDFRONT_DOMAIN');
  }

  public getAWSCloudfrontAccessKeyId() {
    return configService.getValue('AWS_CLOUDFRONT_ACCESSKEY_ID');
  }

  public isSecure() {
    return this.getValue('IS_SECURE', true) == 'true';
  }

  public getCertKeyPath() {
    return configService.getValue('CERT_KEY_PATH', true);
  }

  public getCertFilePath() {
    return configService.getValue('CERT_FILE_PATH', true);
  }

  public isSSL() {
    return this.getValue('IS_SSL', true) == 'true';
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'PORT',
  'ROOT_URL',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_PUBLIC_BUCKET_NAME',
  'IS_HEROKU',
  'ORIGIN',
  'NODE_ENV',
  'MAILER_SERVICE_HOST',
  'MAILER_SERVICE_PORT',
  'CACHE_SERVICE_HOST',
  'CACHE_SERVICE_PORT',
  'MAILER_SERVICE_EMAIL',
  'AWS_CLOUDFRONT_ACCESSKEY_ID',
  'AWS_CLOUDFRONT_DOMAIN',
  'IS_SECURE',
]);

export { configService };
