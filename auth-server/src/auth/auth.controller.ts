import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: '사용자 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @EventPattern({ cmd: 'login' })
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: '사용자 회원가입, create USER' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @EventPattern({ cmd: 'register' })
  async register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @EventPattern({ cmd: 'validateUser' })
  async validateUser(@Payload() data: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(data.email, data.password);
      if (!user) {
        return { error: 'Invalid credentials' };
      }
      return user;
    } catch (error) {
      console.error('Validate user error:', error);
      return { error: error.message || 'Authentication failed' };
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 프로필 조회' })
  @ApiResponse({ status: 200, description: '프로필 조회 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  @EventPattern({ cmd: 'getProfile' })
  getProfile(@Payload() req: any) {
    return req.user;
  }
} 