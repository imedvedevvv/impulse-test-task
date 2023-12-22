import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UserUpdateDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  public readonly email?: string;

  @IsString()
  @IsOptional()
  public readonly username?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  public readonly password?: string;
}
