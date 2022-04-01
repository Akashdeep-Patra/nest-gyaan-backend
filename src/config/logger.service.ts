import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as fs from 'fs';
import { getNamespace } from 'cls-hooked';

import { configService } from './config.service';

if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

const addTraceId = winston.format((info) => {
  const clsNamespace = getNamespace('server-app-tracer');
  const traceId = clsNamespace ? clsNamespace.get('traceId') : undefined;
  if (traceId) {
    info['traceId'] = traceId;
  }
  return info;
})();

export const logTransportConsole = new winston.transports.Console({
  format: winston.format.combine(
    addTraceId,
    nestWinstonModuleUtilities.format.nestLike(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    configService.isProduction()
      ? winston.format.json()
      : winston.format.colorize(),
  ),
  handleExceptions: true,
  level: configService.getLogLevel() || 'debug',
});

const fileTransport = new winston.transports.File({
  filename: './logs/all-logs.log',
  format: winston.format.combine(
    addTraceId,
    nestWinstonModuleUtilities.format.nestLike(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  handleExceptions: true,
  maxFiles: 5,
  maxsize: 5242880, // 5MB
  level: configService.getLogLevel() || 'debug',
});

export class LogService {
  public static configureLogger() {
    return WinstonModule.createLogger({
      transports: [logTransportConsole, fileTransport],
      exitOnError: false,
    });
  }
}
