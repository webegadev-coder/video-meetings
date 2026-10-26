import { jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service.js';
import { User } from '../user/user.entity.js';

describe('AuthService', () => {
    let service: AuthService;

    const mockUsers = [
        {
            id: 'user-1',
            email: 'user@example.com',
            name: 'Demo User',
            password: '123456',
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'test-secret',
                    signOptions: { expiresIn: '1h' },
                }),
            ],
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn(({ where }) => {
                            const user = mockUsers.find((candidate) =>
                                candidate.email === where.email || candidate.id === where.id,
                            );
                            return Promise.resolve(user ?? null);
                        }),
                        create: jest.fn((dto) => ({
                            id: 'user-2',
                            ...dto,
                        })),
                        save: jest.fn(async (user) => {
                            const existing = mockUsers.find((candidate) => candidate.email === user.email);
                            if (!existing) {
                                mockUsers.push(user);
                            }
                            return user;
                        }),
                        remove: jest.fn(async (user) => user),
                        find: jest.fn(async () => mockUsers),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should sign and verify a token for a valid user', async () => {
        const result = await service.login({
            email: 'user@example.com',
            password: '123456',
        });

        const payload = service.verify(result.access_token);

        expect(payload.sub).toBe('user-1');
        expect(payload.email).toBe('user@example.com');
    });

    it('should create and delete a user from the repository', async () => {
        const created = await service.createUser({
            email: 'new-user@example.com',
            password: 'secret',
            name: 'New User',
        });

        expect(created.email).toBe('new-user@example.com');

        const removed = await service.deleteUser(created.id);
        expect(removed).toBeTruthy();
    });
});
