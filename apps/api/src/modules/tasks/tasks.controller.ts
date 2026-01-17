import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '@repo/shared';

export async function createTaskHandler(
    request: FastifyRequest<{ Body: CreateTaskInput }>,
    reply: FastifyReply
) {
    const { title, description, status, priority, dueDate } = request.body;
    const { prisma, user } = request.server as any; // Cast until types generated
    const userId = request.user.sub; // From JWT

    const task = await prisma.task.create({
        data: {
            title,
            description,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            userId,
        },
    });

    return reply.status(201).send(task);
}

export async function getTasksHandler(
    request: FastifyRequest<{ Querystring: TaskQueryInput }>,
    reply: FastifyReply
) {
    const { status, priority, page, pageSize } = request.query;
    const { prisma } = request.server as any;
    const userId = request.user.sub;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: any = { userId };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.task.count({ where }),
    ]);

    return {
        data: tasks,
        meta: {
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        },
    };
}

export async function getTaskHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const { id } = request.params;
    const { prisma } = request.server as any;
    const userId = request.user.sub;

    const task = await prisma.task.findUnique({
        where: { id },
    });

    if (!task || task.userId !== userId) {
        return reply.status(404).send({ message: 'Task not found' });
    }

    return task;
}

export async function updateTaskHandler(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateTaskInput }>,
    reply: FastifyReply
) {
    const { id } = request.params;
    const { prisma } = request.server as any;
    const userId = request.user.sub;

    const task = await prisma.task.findUnique({
        where: { id },
    });

    if (!task || task.userId !== userId) {
        return reply.status(404).send({ message: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
        where: { id },
        data: {
            ...request.body,
            dueDate: request.body.dueDate ? new Date(request.body.dueDate) : undefined
        },
    });

    return updatedTask;
}

export async function deleteTaskHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const { id } = request.params;
    const { prisma } = request.server as any;
    const userId = request.user.sub;

    const task = await prisma.task.findUnique({
        where: { id },
    });

    if (!task || task.userId !== userId) {
        return reply.status(404).send({ message: 'Task not found' });
    }

    await prisma.task.delete({
        where: { id },
    });

    return reply.status(204).send();
}
