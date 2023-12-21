import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RefreshTokenDto {
  @ApiProperty({ example: 'jwtencodedstring' })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly token!: string;
}
