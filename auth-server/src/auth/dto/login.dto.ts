import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: '사용자 이메일' })
  @IsEmail()
  username: string;

  @ApiProperty({ example: 'password123', description: '사용자 비밀번호' })
  @IsString()
  password: string;
} 