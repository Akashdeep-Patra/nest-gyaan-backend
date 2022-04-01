import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Refer below link for understanding in details
 * {@link https://docs.nestjs.com/exception-filters#exception-filters-1}
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    // Don't log exception for bad requests
    if (statusCode !== HttpStatus.BAD_REQUEST) {
      this.logger.error(exception, 'Http exception');
    }
    const errorMessages = exceptionResponse['message'] || exceptionResponse;

    const errorObject = {};
    if (Array.isArray(errorMessages)) {
      errorMessages.forEach((error) => {
        errorObject[error.property] = Object.values(
          error?.constraints ? error.constraints : error.children,
        );
      });
    } else {
      errorObject['message'] = errorMessages;
    }

    response.status(statusCode).json({
      statusCode,
      message:
        exceptionResponse['error'] ||
        exceptionResponse['message'] ||
        exceptionResponse,
      error: errorObject,
    });
  }
}
