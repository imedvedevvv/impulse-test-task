import { Body, Controller, Delete, Get, Inject, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Service } from '../common/enums';
import { IUsersService } from './users.service';
import { UserCreateDto } from './dto/user-create-dto';
import { ExcludeNullInterceptor } from '../common/interceptors/exclude-null.interceptor';
import { TransformInterceptor } from '../common/interceptors/serialize.interceptor';
import { User } from './entities/user.entity';
import { JwtUser } from '../auth/decorators/jwt-user.decorator';
import { JwtUserPayload } from '../auth/interfaces';
import { Public } from '../auth/decorators/is-public.decorator';
import { UserUpdateDto } from './dto/user-update.dto';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ExcludeNullInterceptor, TransformInterceptor(User))
export class UsersController {
  constructor(@Inject(Service.Users) private readonly usersService: IUsersService) {}

  @Public()
  @Get('all')
  async findAll() {
    return this.usersService.findMany({ select: { email: true } });
  }

  @Get('/details')
  async findById(@JwtUser() { id }: JwtUserPayload) {
    return this.usersService.findById(id);
  }

  @Public()
  @Post()
  async create(@Body() createUserDto: UserCreateDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch()
  async update(@JwtUser() { id }: JwtUserPayload, @Body() userUpdateDto: UserUpdateDto) {
    return this.usersService.update({ where: { id }, data: { ...userUpdateDto } });
  }

  @Delete()
  async delete(@JwtUser() { id }: JwtUserPayload) {
    return this.usersService.deleteById(id);
  }
}
