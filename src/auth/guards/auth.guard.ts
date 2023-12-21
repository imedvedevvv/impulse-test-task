import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { ResponseMessage, Service } from '../../common/enums';
import { IUtilsService } from '../../utils/utils.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(Service.Utils) private readonly utilsService: IUtilsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.utilsService.extractBearerTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.jwtService
      .verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })
      .catch((error) => {
        if (error.name === 'TokenExpiredError') {
          error.message = ResponseMessage.JwtExpired;
        }

        throw new UnauthorizedException(error);
      });

    request['user'] = payload;

    return true;
  }
}
