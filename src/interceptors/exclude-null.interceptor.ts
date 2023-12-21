import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { Service } from '../enums';
import { IUtilsService } from '../utils/utils.service';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  constructor(@Inject(Service.Utils) private readonly utilsService: IUtilsService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((value) => this.utilsService.stripNullValues(value)));
  }
}
