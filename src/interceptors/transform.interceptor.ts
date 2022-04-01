/* eslint-disable @typescript-eslint/no-explicit-any */
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { isArray, isObject } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((res) => (isObject(res) ? this.transformResponse(res) : res)));
  }

  transformResponse(response: any): any {
    if (isArray(response)) {
      return response.map((item) => this.transformToPlain(item));
    }

    return this.transformToPlain(response);
  }

  transformToPlain(plainOrClass: any): any {
    return plainOrClass && plainOrClass.constructor !== Object
      ? classToPlain(plainOrClass)
      : plainOrClass;
  }
}
