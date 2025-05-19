import { IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  @ApiProperty({ example: 'Terry', description: '사용자 이름' })
  username?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @ApiProperty({ example: 'newpassword123', description: '사용자 비밀번호' })
  password?: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty({ example: 'ADMIN', description: '사용자 역할' })
  role?: UserRole;
} 