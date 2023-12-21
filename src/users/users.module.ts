import { Module } from '@nestjs/common';

import { Service } from '../common/enums';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CryptoModule } from '../crypto/crypto.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [PrismaModule, CryptoModule, UtilsModule],
  controllers: [UsersController],
  providers: [
    {
      provide: Service.Users,
      useClass: UsersService,
    },
  ],
  exports: [Service.Users],
})
export class UsersModule {}
