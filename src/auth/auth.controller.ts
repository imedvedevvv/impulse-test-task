import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { IAuthService } from './auth.service';
import { Public } from './decorators/is-public.decorator';
import { ResponseMessage, Service } from '../common/enums';
import { SignInDto } from './dto/sign-in.dto';
import { JwtUser } from './decorators/jwt-user.decorator';
import { JwtUserPayload } from './interfaces';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(@Inject(Service.Auth) private readonly authService: IAuthService) {}

  @ApiOperation({ summary: `Sign-in for existing user` })
  @Public()
  @Post('sign-in')
  async signIn(@Body() signIn: SignInDto) {
    return this.authService.signIn(signIn.email, signIn.password);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Sign-out for existing user` })
  @HttpCode(200)
  @Post('sign-out')
  async signOut(@JwtUser() user: JwtUserPayload) {
    await this.authService.signOut(user.id);

    return { message: ResponseMessage.OK };
  }

  @ApiOperation({ summary: `Refresh expired access token` })
  @Public()
  @Post('refresh')
  async refresh(@Body() { token }: RefreshTokenDto) {
    return this.authService.refresh(token);
  }
}
