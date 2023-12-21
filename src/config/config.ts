import { HttpStatus } from '@nestjs/common';

import { AppConfig } from './interfaces';

export const appConfig = (): AppConfig => ({
  validationPipe: {
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    transform: true,
    validateCustomDecorators: true,
    stopAtFirstError: true,
    always: true,
    whitelist: true,
    transformOptions: {
      exposeUnsetFields: false,
      exposeDefaultValues: true,
    },
  },
});
