import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import helmet from 'helmet';

import { GlobalConstants } from './constants';
import { AppModule } from './app.module';
import { NoContentInterceptor } from './query/interceptors/no-content.interceptor';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.get<number>('APP_PORT');
  const validationPipeConfig = configService.get<ValidationPipeOptions>('validationPipe', { infer: true });

  const apiUrl = `${GlobalConstants.localUrl}:${port}`;

  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
  app.useGlobalInterceptors(new NoContentInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(helmet());

  await app.listen(port);
  console.log(`Server listening at: ${apiUrl}`);

  const document = setupSwagger(app);

  if (document) {
    console.log(`Browse your REST API at: ${apiUrl}/${GlobalConstants.swaggerPrefix}`);
  }
}
void bootstrap();
