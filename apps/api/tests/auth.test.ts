import Fastify from 'fastify';
import authRoutes from '../src/modules/auth/auth.routes';
import fp from 'fastify-plugin';

// Mock Prism and plugins
jest.mock('../src/plugins/prisma', () => fp(async (fastify) => {
    fastify.decorate('prisma', {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        refreshToken: {
            create: jest.fn(),
            findUnique: jest.fn()
        }
    });
}));

jest.mock('../src/plugins/auth', () => fp(async (fastify) => {
    fastify.decorate('authenticate', async () => { }); // Mock auth
    fastify.register(require('@fastify/jwt'), { secret: 'test' });
}));
jest.mock('../src/plugins/swagger', () => fp(async () => { }));

import appBuild from '../src/app';
// Note: app import might trigger side effects. Better to test isolated modules or refactor app.ts to export factory.
// For now, let's unit test controller or routes directly if possible.

// We will test the routes by constructing a clean instance.
const buildTestServer = async () => {
    const app = Fastify();
    // Register mocks/plugins
    app.decorate('prisma', {
        user: {
            findUnique: jest.fn(),
            create: jest.fn().mockResolvedValue({ id: '1', email: 'test@test.com' })
        },
        refreshToken: { create: jest.fn() }
    });
    app.register(require('@fastify/jwt'), { secret: 'test' });
    app.decorate('authenticate', async () => { });

    await app.register(authRoutes);
    return app;
};

describe('Auth Routes', () => {
    let app;

    beforeAll(async () => {
        app = await buildTestServer();
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /register should create user', async () => {
        const res = await app.inject({
            method: 'POST',
            url: '/register',
            payload: {
                email: 'test@test.com',
                password: 'password123',
                name: 'Test'
            }
        });

        expect(res.statusCode).toBe(201);
        expect(res.json()).toHaveProperty('userId');
    });
});
