import { IsString, IsEnum, IsOptional, MinLength, IsEmail } from 'class-validator';
import { UserRole } from '../schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'john@example.com', description: '사용자 이메일' })
  email: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'John Doe', description: '사용자 이름' })
  username: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'password123', description: '사용자 비밀번호' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({ example: 'USER', description: '사용자 역할' })
  role: UserRole = UserRole.USER;
} 