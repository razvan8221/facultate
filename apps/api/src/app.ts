import Fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import prismaPlugin from './plugins/prisma';
import swaggerPlugin from './plugins/swagger';
import authPlugin from './plugins/auth';
import authRoutes from './modules/auth/auth.routes';
import taskRoutes from './modules/tasks/tasks.routes';

const app = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
    origin: process.env.WEB_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

app.register(swaggerPlugin);
app.register(authPlugin);
app.register(prismaPlugin);

app.register(authRoutes, { prefix: '/auth' });
app.register(taskRoutes, { prefix: '/tasks' });

app.get('/health', async () => {
    return { status: 'ok' };
});

export async function main() {
    try {
        const port = Number(process.env.PORT) || 3001;
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on port ${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

export default app;
