'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { TaskQueryInput, CreateTaskInput, UpdateTaskInput, createTaskSchema } from '@repo/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit2, LogOut, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

// Types (simplified as I can't import types easily if transpilation fails, but assuming it works)
type Task = {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
};

export default function DashboardPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterPriority, setFilterPriority] = useState<string>('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Protected Route Check
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const { data: tasksData, isLoading } = useQuery({
        queryKey: ['tasks', filterStatus, filterPriority],
        queryFn: async () => {
            const params: any = {};
            if (filterStatus) params.status = filterStatus;
            if (filterPriority) params.priority = filterPriority;
            const res = await api.get('/tasks', { params });
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateTaskInput) => api.post('/tasks', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setIsFormOpen(false);
            reset();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
            api.put(`/tasks/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setEditingTask(null);
            setIsFormOpen(false);
            reset();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/tasks/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CreateTaskInput>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            status: 'TODO',
            priority: 'MEDIUM'
        }
    });

    useEffect(() => {
        if (editingTask) {
            setValue('title', editingTask.title);
            setValue('description', editingTask.description);
            setValue('status', editingTask.status);
            setValue('priority', editingTask.priority);
            // Date handling omitted for brevity
            setIsFormOpen(true);
        }
    }, [editingTask, setValue]);

    const onSubmit = (data: CreateTaskInput) => {
        if (editingTask) {
            updateMutation.mutate({ id: editingTask.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/login');
    };

    if (isLoading) return <div className="p-8">Loading tasks...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">TaskBoard</h1>
                    <button onClick={handleLogout} className="flex items-center text-gray-600 hover:text-red-600">
                        <LogOut className="w-5 h-5 mr-2" /> Logout
                    </button>
                </header>

                <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-4">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border rounded p-2 text-sm"
                        >
                            <option value="">All Statuses</option>
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="border rounded p-2 text-sm"
                        >
                            <option value="">All Priorities</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            setEditingTask(null);
                            reset({ status: 'TODO', priority: 'MEDIUM', title: '', description: '' });
                            setIsFormOpen(!isFormOpen);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700"
                    >
                        <Plus className="w-5 h-5" /> New Task
                    </button>
                </div>

                {isFormOpen && (
                    <div className="bg-white p-6 rounded-lg shadow mb-6 border-l-4 border-indigo-500">
                        <h3 className="text-lg font-semibold mb-4">{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <input
                                    {...register('title')}
                                    placeholder="Task Title"
                                    className="w-full border p-2 rounded"
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                            </div>
                            <div>
                                <textarea
                                    {...register('description')}
                                    placeholder="Description"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="flex gap-4">
                                <select {...register('status')} className="border p-2 rounded w-1/2">
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                </select>
                                <select {...register('priority')} className="border p-2 rounded w-1/2">
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Save Task
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tasksData?.data?.map((task: any) => (
                        <div key={task.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{task.title}</h3>
                                <div className={clsx(
                                    "px-2 py-0.5 rounded text-xs font-medium uppercase",
                                    task.priority === 'HIGH' ? "bg-red-100 text-red-800" :
                                        task.priority === 'MEDIUM' ? "bg-yellow-100 text-yellow-800" :
                                            "bg-green-100 text-green-800"
                                )}>
                                    {task.priority}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-10">{task.description || 'No description'}</p>

                            <div className="flex items-center justify-between mt-4 border-t pt-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    {task.status === 'DONE' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4" />}
                                    <span>{task.status.replace('_', ' ')}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push(`/tasks/${task.id}`)}
                                        className="p-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure?')) deleteMutation.mutate(task.id);
                                        }}
                                        className="p-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasksData?.data?.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No tasks found. Create one to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
