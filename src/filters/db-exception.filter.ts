import { QueryFailedError } from 'typeorm';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  private logger = new Logger(QueryFailedExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const exceptionDetail = exception['detail'];
    const statusCode = HttpStatus.BAD_REQUEST;
    const { name } = exception;

    this.logger.error(exception);

    response.status(statusCode).json({
      statusCode,
      message: name,
      error: {
        message: exceptionDetail,
      },
    });
  }
}
