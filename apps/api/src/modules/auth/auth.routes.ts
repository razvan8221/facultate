import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { registerHandler, loginHandler, refreshHandler, logoutHandler } from './auth.controller';
import { registerSchema, loginSchema, refreshSchema } from '@repo/shared';
import { z } from 'zod';

export default async function authRoutes(app: FastifyInstance) {
    const server = app.withTypeProvider<ZodTypeProvider>();

    server.post(
        '/register',
        {
            schema: {
                body: registerSchema,
                response: {
                    201: z.object({
                        message: z.string(),
                        userId: z.string(),
                    }),
                },
            },
        },
        registerHandler
    );

    server.post(
        '/login',
        {
            schema: {
                body: loginSchema,
                response: {
                    200: z.object({
                        accessToken: z.string(),
                        refreshToken: z.string(),
                        user: z.object({
                            email: z.string(),
                            name: z.string().nullable(),
                        }),
                    }),
                },
            },
        },
        loginHandler
    );

    server.post(
        '/refresh',
        {
            schema: {
                body: refreshSchema,
                response: {
                    200: z.object({
                        accessToken: z.string(),
                    }),
                },
            },
        },
        refreshHandler
    );

    server.post('/logout',
        {
            preHandler: [app.authenticate]
        },
        logoutHandler
    );
}
