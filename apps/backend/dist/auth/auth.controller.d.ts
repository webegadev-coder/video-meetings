import { AuthService } from './auth.service.js';
import { LoginDto } from './login.dto.js';
declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: import("./auth.service.js").UserPayload;
    }>;
    listUsers(): Promise<import("./auth.service.js").UserPayload[]>;
    createUser(dto: CreateUserDto): Promise<import("./auth.service.js").UserPayload>;
    deleteUser(id: string): Promise<import("./auth.service.js").UserPayload>;
    getProfile(user: Record<string, unknown>): {
        user: Record<string, unknown>;
    };
}
export {};
