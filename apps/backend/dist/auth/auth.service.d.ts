import { JwtService } from '@nestjs/jwt';
export interface UserPayload {
    id: string;
    email: string;
    name: string;
}
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    private readonly demoUser;
    login({ email, password }: {
        email: string;
        password: string;
    }): {
        access_token: string;
        user: UserPayload;
    };
    verify(token: string): any;
}
