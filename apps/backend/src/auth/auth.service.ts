import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity.js';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.ensureDefaultUser();
  }

  private async ensureDefaultUser() {
    const existing = await this.userRepository.findOne({ where: { email: 'user@example.com' } });

    if (!existing) {
      await this.userRepository.save(
        this.userRepository.create({
          email: 'user@example.com',
          password: '123456',
          name: 'Demo User',
        }),
      );
    }
  }

  private toPublicUser(user: User): UserPayload {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: this.toPublicUser(user),
    };
  }

  async listUsers(): Promise<UserPayload[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.toPublicUser(user));
  }

  async createUser(dto: { email: string; password: string; name: string }) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const created = this.userRepository.create(dto);
    const saved = await this.userRepository.save(created);

    return this.toPublicUser(saved);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    return this.toPublicUser(user);
  }

  verify(token: string) {
    return this.jwtService.verify(token);
  }
}
