import { CallHandler, ExecutionContext, mixin, NestInterceptor, Type } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';

export const TransformInterceptor = <T>(cls: ClassConstructor<T>): Type<NestInterceptor> => {
  class TransformInterceptorHost implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(map((data) => plainToInstance(cls, data)));
    }
  }

  return mixin<NestInterceptor>(TransformInterceptorHost);
};
