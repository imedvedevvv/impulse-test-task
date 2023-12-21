import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithUser } from '../interfaces';
export const JwtUser = createParamDecorator((data: string, ctx: ExecutionContext): ParameterDecorator => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  const user = request.user;
  return data ? user && user[data] : user;
});
