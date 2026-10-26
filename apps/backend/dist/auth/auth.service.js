var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
let AuthService = class AuthService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    demoUser = {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Demo User',
    };
    login({ email, password }) {
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
    verify(token) {
        return this.jwtService.verify(token);
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map