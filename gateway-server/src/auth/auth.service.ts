import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      return await firstValueFrom(
        this.authClient.emit({ cmd: 'login' }, loginDto)
      );
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(registerData: RegisterDto) {
    try {
      return await firstValueFrom(
        this.authClient.emit({ cmd: 'register' }, registerData)
      );
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async validateUser(email: string, password: string) {
    try {
      return await firstValueFrom(
        this.authClient.emit({ cmd: 'validateUser' }, { email, password })
      );
    } catch (error) {
      console.error('Validate user error:', error);
      throw error;
    }
  }
} 