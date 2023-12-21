import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { Response } from 'express';

@Injectable()
export class NoContentInterceptor<T> implements NestInterceptor<T, T> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next.handle().pipe(
      tap((data) => {
        if (data === undefined || data === null) {
          context.switchToHttp().getResponse<Response>().statusCode = HttpStatus.NO_CONTENT;
        }
      })
    );
  }
}
