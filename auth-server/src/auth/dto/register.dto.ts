import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com', description: '사용자 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: '사용자 비밀번호' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: '사용자 이름' })
  @IsString()
  name: string;
} 