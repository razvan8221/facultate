import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

export default fp(async (fastify) => {
    await fastify.register(fastifyJwt, {
        secret: process.env.JWT_ACCESS_SECRET || 'secret',
    });

    fastify.decorate('authenticate', async (request: any, reply: any) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: any;
    }
}
