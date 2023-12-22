import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { ResponseMessage, Service } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';
import { UserCreateDto } from './dto/user-create-dto';
import { ICryptoService } from '../crypto/crypto.service';
import { User } from './entities/user.entity';

export interface IUsersService {
  findById(id: number): Promise<User>;
  findMany(options?: Prisma.UserFindManyArgs): Promise<User[]>;
  findOne(options: Prisma.UserFindFirstArgs): Promise<User>;
  update(options: Prisma.UserUpdateArgs): Promise<User>;
  create(userCreateDto: UserCreateDto): Promise<User>;
  updateRefreshToken(userId: number, refreshToken?: string): Promise<void>;
  getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User>;
  deleteById(userId: number): Promise<{ count: number }>;
}

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(Service.Prisma) private readonly prismaService: PrismaService,
    @Inject(Service.Crypto) private readonly cryptoService: ICryptoService
  ) {}

  public async findById(id: number): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(ResponseMessage.UserNotFound);
    }

    return user;
  }

  public async update(options: Prisma.UserUpdateArgs): Promise<User> {
    if (options.data.email && !(await this.isEmailUnique(options.data.email.toString()))) {
      throw new BadRequestException(ResponseMessage.EmailAlreadyExists);
    }

    if (options.data.password) {
      options.data.password = await this.cryptoService.generateSaltAndHash(options.data.password.toString());
    }

    return this.prismaService.user.update(options);
  }

  public async findMany(options?: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prismaService.user.findMany(options);
  }

  public async findOne(options: Prisma.UserFindFirstArgs): Promise<User> {
    return this.prismaService.user.findFirst(options);
  }

  private async isEmailUnique(email: string): Promise<boolean> {
    return !(await this.prismaService.user.findFirst({ where: { email } }));
  }

  public async create(userCreateDto: UserCreateDto): Promise<User> {
    const { email, password } = userCreateDto;

    if (!(await this.isEmailUnique(email))) {
      throw new BadRequestException(ResponseMessage.EmailAlreadyExists);
    }

    const hashedPassword = await this.cryptoService.generateSaltAndHash(password);

    return this.prismaService.user.create({
      data: { ...userCreateDto, password: hashedPassword },
    });
  }

  public async updateRefreshToken(userId: number, refreshToken?: string): Promise<void> {
    const hashedRefreshToken = refreshToken ? await this.cryptoService.generateSaltAndHash(refreshToken) : null;

    await this.update({ where: { id: userId }, data: { refreshToken: hashedRefreshToken } });
  }

  public async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User> {
    const user = await this.findById(userId);

    const isRefreshTokenMatching = await this.cryptoService.compare(refreshToken, user.refreshToken);

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  public async deleteById(userId: number): Promise<{ count: number }> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException(ResponseMessage.UserNotFound);
    }

    await this.prismaService.user.delete({ where: { id: userId } });
    return { count: 1 };
  }
}
