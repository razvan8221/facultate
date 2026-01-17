import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import {
    createTaskHandler,
    getTasksHandler,
    getTaskHandler,
    updateTaskHandler,
    deleteTaskHandler,
} from './tasks.controller';
import {
    createTaskSchema,
    updateTaskSchema,
    taskQuerySchema,
} from '@repo/shared';

export default async function taskRoutes(app: FastifyInstance) {
    const server = app.withTypeProvider<ZodTypeProvider>();

    server.addHook('preHandler', app.authenticate);

    server.post(
        '/',
        {
            schema: {
                body: createTaskSchema,
                response: {
                    201: z.object({
                        id: z.string(),
                        title: z.string(),
                        status: z.string(),
                    }),
                },
            },
        },
        createTaskHandler
    );

    server.get(
        '/',
        {
            schema: {
                querystring: taskQuerySchema,
            },
        },
        getTasksHandler
    );

    server.get('/:id', getTaskHandler);

    server.put(
        '/:id',
        {
            schema: {
                body: updateTaskSchema,
            },
        },
        updateTaskHandler
    );

    server.delete('/:id', deleteTaskHandler);
}
