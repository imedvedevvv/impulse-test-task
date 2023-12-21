import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SignInDto {
  @ApiProperty({ example: 'someEmail@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly email!: string;

  @ApiProperty({ example: '12344321' })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly password!: string;
}
