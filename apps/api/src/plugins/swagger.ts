import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export default fp(async (fastify) => {
    await fastify.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'TaskBoard API',
                description: 'API documentation for TaskBoard',
                version: '1.0.0',
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
        },
    });

    await fastify.register(fastifySwaggerUi, {
        routePrefix: '/docs',
    });
});
