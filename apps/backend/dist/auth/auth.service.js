var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ConflictException, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity.js';
let AuthService = class AuthService {
    jwtService;
    userRepository;
    constructor(jwtService, userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }
    async onModuleInit() {
        await this.ensureDefaultUser();
    }
    async ensureDefaultUser() {
        const existing = await this.userRepository.findOne({ where: { email: 'user@example.com' } });
        if (!existing) {
            await this.userRepository.save(this.userRepository.create({
                email: 'user@example.com',
                password: '123456',
                name: 'Demo User',
            }));
        }
    }
    toPublicUser(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }
    async login({ email, password }) {
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
    async listUsers() {
        const users = await this.userRepository.find();
        return users.map((user) => this.toPublicUser(user));
    }
    async createUser(dto) {
        const existing = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new ConflictException('User with this email already exists');
        }
        const created = this.userRepository.create(dto);
        const saved = await this.userRepository.save(created);
        return this.toPublicUser(saved);
    }
    async deleteUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.userRepository.remove(user);
        return this.toPublicUser(user);
    }
    verify(token) {
        return this.jwtService.verify(token);
    }
};
AuthService = __decorate([
    Injectable(),
    __param(1, InjectRepository(User)),
    __metadata("design:paramtypes", [JwtService,
        Repository])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map