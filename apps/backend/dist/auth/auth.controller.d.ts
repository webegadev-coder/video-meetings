import { AuthService } from './auth.service.js';
import { LoginDto } from './login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): {
        access_token: string;
        user: import("./auth.service.js").UserPayload;
    };
    getProfile(user: Record<string, unknown>): {
        user: Record<string, unknown>;
    };
}
