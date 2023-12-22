import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty({ example: 'someEmail@gmail.com' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email!: string;

  @ApiProperty({ example: 'cool username' })
  @IsString()
  @IsOptional()
  public readonly username?: string;

  @ApiProperty({ example: 'a strong password' })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public readonly password!: string;
}
