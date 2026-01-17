import { z } from 'zod';

export const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
export const taskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: taskStatusSchema.default('TODO'),
    priority: taskPrioritySchema.default('MEDIUM'),
    dueDate: z.string().datetime().optional(), // ISO string from frontend
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskQuerySchema = z.object({
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    page: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
