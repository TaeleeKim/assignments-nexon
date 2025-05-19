import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.authClient.emit({ cmd: 'validateUser' }, { email, password })
      );
      if (!response) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return response;
    } catch (error) {
      console.error('Local strategy validation error:', error);
      throw new UnauthorizedException(error.message || 'Invalid credentials');
    }
  }
} 