import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import { LoginInput, RegisterInput, RefreshInput } from '@repo/shared';

export async function registerHandler(
    request: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply
) {
    const { email, password, name } = request.body;
    const { prisma } = request.server;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return reply.status(409).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    return reply.status(201).send({ message: 'User created', userId: user.id });
}

export async function loginHandler(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
) {
    const { email, password } = request.body;
    const { prisma, jwt } = request.server;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
        { sub: user.id, email: user.email },
        { expiresIn: '15m' }
    );

    // Simple refresh token generation (random string would be better)
    const refreshTokenString = jwt.sign(
        { sub: user.id, type: 'refresh' },
        { expiresIn: '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: refreshTokenString,
            userId: user.id,
            expiresAt,
        },
    });

    return {
        accessToken,
        refreshToken: refreshTokenString,
        user: { email: user.email, name: user.name },
    };
}

export async function refreshHandler(
    request: FastifyRequest<{ Body: RefreshInput }>,
    reply: FastifyReply
) {
    const { refreshToken } = request.body;
    const { prisma, jwt } = request.server;

    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
        return reply.status(401).send({ message: 'Invalid or expired refresh token' });
    }

    const accessToken = jwt.sign(
        { sub: storedToken.user.id, email: storedToken.user.email },
        { expiresIn: '15m' }
    );

    return { accessToken };
}

export async function logoutHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    // Ideally we invalidate refresh tokens here.
    // For now, simple response.
    return reply.send({ message: 'Logged out' });
}
