import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async validateToken(token: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'validate_token' }, { token }),
    );
  }

  async login(email: string, password: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'login' }, { email, password }),
    );
  }

  async register(userData: any) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'register' }, userData),
    );
  }

  async getProfile(userId: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'get_profile' }, { userId }),
    );
  }
} 