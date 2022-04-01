import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { useContainer } from 'class-validator';
import { createNamespace } from 'cls-hooked';
import * as CookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as helmet from 'helmet';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';
import { v4 as uuidv4 } from 'uuid';
import { AppModule } from './app.module';
import { jwtConstants } from './auth/constants';
import { configService } from './config/config.service';
import { LogService } from './config/logger.service';
import { QueryFailedExceptionFilter } from './filters/db-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { RequestLogInterceptor } from './interceptors/request-log.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

// {@link https://docs.nestjs.com/techniques/validation#auto-validation}
function addValidationPipe(app: INestApplication): void {
  const validationPipe = new ValidationPipe({
    whitelist: true,
    transform: true,
    // Using exception factory so that we can send back field wise error message
    // https://docs.nestjs.com/migration-guide#validation-errors-schema
    exceptionFactory: (errors) => new BadRequestException(errors),
    validationError: {
      target: false,
      value: false,
    },
  });

  app.useGlobalPipes(validationPipe);
}

// CLS Middleware hook
const clsNamespace = createNamespace('server-app-tracer');
const clsMiddleware = (req, res, next) => {
  // req and res are event emitters. We want to access CLS context
  // inside of their event callbacks
  clsNamespace.bind(req);
  clsNamespace.bind(res);

  const traceId = uuidv4();

  clsNamespace.run(() => {
    clsNamespace.set('traceId', traceId);
    next();
  });
};

// Request Response object transform interceptors
function addInterceptors(app: INestApplication): void {
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new RequestLogInterceptor());
}

// Error/Exceptions respone filters
function addErrorFilter(app: INestApplication): void {
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new QueryFailedExceptionFilter());
}

function initAWSS3() {
  config.update({
    accessKeyId: configService.getValue('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.getValue('AWS_SECRET_ACCESS_KEY'),
    region: configService.getValue('AWS_REGION'),
  });
}

function ignoreFavicon(req, res, next) {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end();
  }
  next();
}

async function bootstrap() {
  const isSecure = configService.isSSL();
  let httpsOptions;
  if (isSecure) {
    httpsOptions = {
      key: fs.readFileSync(configService.getCertKeyPath(), 'utf8'),
      cert: fs.readFileSync(configService.getCertFilePath(), 'utf8'),
    };
  }

  const app = await NestFactory.create(AppModule, {
    logger: LogService.configureLogger(),
    httpsOptions,
  });
  //dependency injection in custom validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(helmet());
  app.enableCors({
    origin: configService.getOrigin(),
    credentials: true,
  });

  app.use(clsMiddleware);
  app.use(ignoreFavicon);
  app.use(CookieParser(jwtConstants.secret));

  // Swagger should be rendered in either development or stage environments
  if (configService.getValue('NODE_ENV') != 'production') {
    // swagger initialization
    const config = new DocumentBuilder()
      .addBearerAuth()
      .addCookieAuth('authCookie', {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      })
      .setTitle('GyaanAI API')
      .setDescription('API Descriptions')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  addValidationPipe(app);
  addInterceptors(app);

  initializeTransactionalContext();
  addErrorFilter(app);

  initAWSS3();
  await app.listen(configService.getPort());
}

bootstrap();
