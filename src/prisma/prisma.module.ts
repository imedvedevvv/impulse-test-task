import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Service } from '../enums';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: Service.Prisma,
      useClass: PrismaService,
    },
  ],
  exports: [Service.Prisma],
})
export class PrismaModule {}
