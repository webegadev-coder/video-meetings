import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service.js';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'test-secret',
                    signOptions: { expiresIn: '1h' },
                }),
            ],
            providers: [AuthService],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should sign and verify a token for a valid user', () => {
        const result = service.login({
            email: 'user@example.com',
            password: '123456',
        });

        const payload = service.verify(result.access_token);

        expect(payload.sub).toBe('user-1');
        expect(payload.email).toBe('user@example.com');
    });
});
