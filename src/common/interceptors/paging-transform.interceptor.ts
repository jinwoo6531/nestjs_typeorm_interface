import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class PagingTransformInterceptor<T, M> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next
      .handle()
      .pipe(
        map(result => ({
          code: context.switchToHttp().getResponse().statusCode,
          message: '',
          meta : result.meta,
          data : result.data,
        }))
      );
  }
}
