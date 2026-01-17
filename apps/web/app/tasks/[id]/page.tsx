'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTaskSchema, UpdateTaskInput } from '@repo/shared';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash } from 'lucide-react';

export default function TaskDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const queryClient = useQueryClient();
    const [successMsg, setSuccessMsg] = useState('');

    const { data: task, isLoading, error } = useQuery({
        queryKey: ['task', id],
        queryFn: async () => {
            const res = await api.get(`/tasks/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateTaskInput) => api.put(`/tasks/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task', id] });
            setSuccessMsg('Task updated successfully');
            setTimeout(() => setSuccessMsg(''), 3000);
        },
        onError: (err: any) => {
            console.error('Update failed:', err);
            alert(`Update failed: ${err.response?.data?.message || err.message}`);
        }
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateTaskInput>({
        resolver: zodResolver(updateTaskSchema)
    });

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority
            });
        }
    }, [task, reset]);

    const onSubmit = (data: UpdateTaskInput) => {
        console.log('Submitting data:', data);
        updateMutation.mutate(data);
    };

    if (isLoading) return <div className="p-8">Loading task...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading task</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </button>

                <h1 className="text-2xl font-bold mb-6">Task Details</h1>

                {successMsg && (
                    <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            {...register('title')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register('description')}
                            rows={4}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                {...register('status')}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                            <select
                                {...register('priority')}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center hover:bg-indigo-700"
                        >
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
