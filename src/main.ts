import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import helmet from 'helmet';

import { GlobalConstants } from './common/constants';
import { AppModule } from './app.module';
import { NoContentInterceptor } from './common/interceptors/no-content.interceptor';
import { setupSwagger } from './swagger';
import { HttpExceptionFilter } from './common/exception-filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.get<number>('APP_PORT');
  const validationPipeConfig = configService.get<ValidationPipeOptions>('validationPipe', { infer: true });

  const apiUrl = `${GlobalConstants.localUrl}:${port}`;

  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
  app.useGlobalInterceptors(new NoContentInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(helmet());

  const document = setupSwagger(app);
  await app.listen(port);
  console.log(`Server listening at: ${apiUrl}`);

  if (document) {
    console.log(`Browse your REST API at: ${apiUrl}/${GlobalConstants.swaggerPrefix}`);
  }
}
void bootstrap();
