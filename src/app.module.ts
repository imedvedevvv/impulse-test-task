import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from './config/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      expandVariables: true,
      cache: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
