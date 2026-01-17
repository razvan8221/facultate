'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@repo/shared';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            await api.post('/auth/register', data);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="bg-white p-8 shadow rounded-lg">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-6">
                Create an account
            </h2>
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Full Name
                    </label>
                    <div className="mt-1">
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            {...register('name')}
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            {...register('email')}
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            {...register('password')}
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating account...' : 'Sign up'}
                    </button>
                </div>
            </form>
            <div className="mt-6 text-center text-sm">
                <Link
                    href="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Already have an account? Sign in
                </Link>
            </div>
        </div>
    );
}
