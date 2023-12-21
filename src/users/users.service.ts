import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Service } from '../enums';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseMessage } from './enums';
import { UserCreateDto } from './dto/user-create-dto';
import { ICryptoService } from '../crypto/crypto.service';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';

export interface IUserService {
  findById(id: number): Promise<User>;
  findAll(): Promise<User[]>;
  create(userCreateDto: UserCreateDto): Promise<User>;
}

@Injectable()
export class UsersService implements IUserService {
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

  public async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();

    return users;
  }

  public async create(userCreateDto: UserCreateDto): Promise<User> {
    const { email, password } = userCreateDto;

    const existingUser = await this.prismaService.user.findFirst({ where: { email } });

    if (existingUser) {
      throw new BadRequestException(ResponseMessage.EmailAlreadyExists);
    }

    const hashedPassword = await this.cryptoService.generateSaltAndHash(password);

    return this.prismaService.user.create({
      data: { ...userCreateDto, password: hashedPassword },
    });
  }
}
