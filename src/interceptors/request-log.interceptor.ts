import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class RequestLogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = new Logger(context.getClass().name);
    const req = context.getArgByIndex(0);
    const reqContext = {
      userId: req.user?.id,
      httpMethod: req.method,
      path: req.path,
      controllerMethod: context.getHandler().name,
      message: 'Starts processing the request.',
    };
    logger.log(reqContext);

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log('====================================');
    console.log(`Total memory used ${Math.round(used * 100) / 100} MB`);
    console.log('====================================');
    return next
      .handle()
      .pipe(map((res) => this.logRequestDone(res, logger, reqContext)));
  }

  logRequestDone(res, logger: Logger, context: any): any {
    logger.log({ ...context, message: 'Done processing the request' });
    return res;
  }
}
