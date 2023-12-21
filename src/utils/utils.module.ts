import { Module } from '@nestjs/common';

import { Service } from '../common/enums';
import { UtilsService } from './utils.service';

@Module({
  imports: [],
  providers: [
    {
      useClass: UtilsService,
      provide: Service.Utils,
    },
  ],
  exports: [Service.Utils],
})
export class UtilsModule {}
