import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Service } from '../enums';
import { IUserService } from './users.service';
import { UserCreateDto } from './dto/user-create-dto';
import { ExcludeNullInterceptor } from '../interceptors/exclude-null.interceptor';
import { TransformInterceptor } from '../interceptors/serialize.interceptor';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ExcludeNullInterceptor, TransformInterceptor(User))
export class UsersController {
  constructor(@Inject(Service.Users) private readonly usersService: IUserService) {}

  @Get('all')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Post()
  async create(@Body() createUserDto: UserCreateDto) {
    return this.usersService.create(createUserDto);
  }
}
