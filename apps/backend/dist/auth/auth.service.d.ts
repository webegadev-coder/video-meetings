import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity.js';
export interface UserPayload {
    id: string;
    email: string;
    name: string;
}
export declare class AuthService {
    private readonly jwtService;
    private readonly userRepository;
    constructor(jwtService: JwtService, userRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    private ensureDefaultUser;
    private toPublicUser;
    login({ email, password }: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: UserPayload;
    }>;
    listUsers(): Promise<UserPayload[]>;
    createUser(dto: {
        email: string;
        password: string;
        name: string;
    }): Promise<UserPayload>;
    deleteUser(id: string): Promise<UserPayload>;
    verify(token: string): any;
}
