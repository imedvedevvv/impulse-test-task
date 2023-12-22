import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiProperty({ example: 'newEmail@gmail.com' })
  @IsEmail()
  @IsString()
  @IsOptional()
  public readonly email?: string;

  @ApiProperty({ example: 'even cooler username' })
  @IsString()
  @IsOptional()
  public readonly username?: string;

  @ApiProperty({ example: 'evenStro$ngerPassword3213215#' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  public readonly password?: string;
}
