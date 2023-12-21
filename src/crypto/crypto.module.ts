import { Module } from '@nestjs/common';

import { Service } from '../enums';
import { CryptoService } from './crypto.service';

@Module({
  providers: [
    {
      provide: Service.Crypto,
      useClass: CryptoService,
    },
  ],
  exports: [Service.Crypto],
})
export class CryptoModule {}
