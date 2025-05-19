import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}
  @EventPattern('login')
  async login(email: string, password: string) {
    return await firstValueFrom(this.authClient.send({ cmd: 'login' }, { email, password }));
  }

  
  async register(registerData: RegisterDto) {
    return await firstValueFrom(this.authClient.send({ cmd: 'register' }, registerData));
  }

  @EventPattern('validateUser')
  async validateUser(email: string, password: string) {
    return await firstValueFrom(this.authClient.send({ cmd: 'validateUser' }, { email, password }));
  }
} 