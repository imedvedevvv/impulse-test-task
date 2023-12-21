import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UserCreateDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email!: string;

  @IsString()
  @IsOptional()
  public readonly username?: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public readonly password!: string;
}
