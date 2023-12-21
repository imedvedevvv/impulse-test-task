import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IUsersService } from '../users/users.service';
import { ResponseMessage, Service } from '../common/enums';
import { ICryptoService } from '../crypto/crypto.service';
import { BaseJwtPayload, JwtUserPayload, TokenPair } from './interfaces';
import { ConfigService } from '@nestjs/config';

export interface IAuthService {
  signIn(email: string, password: string): Promise<TokenPair>;
  signOut(userId: number): Promise<void>;
  refresh(token: string): Promise<TokenPair>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Service.Users) private readonly usersService: IUsersService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(Service.Crypto) private readonly cryptoService: ICryptoService,
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {}

  async signIn(email: string, password: string): Promise<TokenPair> {
    const user = await this.usersService.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(ResponseMessage.UserNotFound);
    }

    if (!(await this.cryptoService.compare(password, user.password))) {
      throw new NotFoundException(ResponseMessage.UserNotFound);
    }

    return this.signNewTokensForUser(user.id);
  }

  public async signOut(userId: number): Promise<void> {
    const user = await this.usersService.findById(userId);

    if (!user.refreshToken) {
      throw new BadRequestException(ResponseMessage.RefreshTokenAlreadyDeleted);
    }

    await this.usersService.updateRefreshToken(userId, null);
  }

  public async refresh(token: string): Promise<TokenPair> {
    const payload = await this.jwtService.verifyAsync<JwtUserPayload>(token).catch((e) => {
      throw new UnauthorizedException(e);
    });

    const user = await this.usersService.getUserIfRefreshTokenMatches(token, payload.id);

    if (!user) {
      throw new NotFoundException(ResponseMessage.UserNotFound);
    }

    return this.signNewTokensForUser(user.id);
  }

  private async signNewTokensForUser(userId: number): Promise<TokenPair> {
    const payload: Omit<JwtUserPayload, keyof BaseJwtPayload> = {
      id: userId,
    };

    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken(payload);

    await this.usersService.updateRefreshToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private signAccessToken(payload: Omit<JwtUserPayload, keyof BaseJwtPayload>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: `${this.configService.get<string>('JWT_ACCESS_TOKEN_DURATION')}s`,
    });
  }

  private signRefreshToken(payload: Omit<JwtUserPayload, keyof BaseJwtPayload>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: `${this.configService.get<string>('JWT_REFRESH_TOKEN_DURATION')}s`,
    });
  }
}
