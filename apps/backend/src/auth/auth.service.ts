import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private readonly demoUser: UserPayload = {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Demo User',
  };

  login({ email, password }: { email: string; password: string }) {
    if (email !== this.demoUser.email || password !== '123456') {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: this.demoUser.id,
      email: this.demoUser.email,
      name: this.demoUser.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: this.demoUser,
    };
  }

  verify(token: string) {
    return this.jwtService.verify(token);
  }
}
