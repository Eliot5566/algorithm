import { FastifyInstance } from 'fastify';
import { verifyPassword } from '../auth/hash';
import { signToken } from '../auth/jwt';
import { env } from '../env';
import { requireAuth } from '../middlewares/auth';
import { findUserByEmail } from '../users/store';

interface LoginBody {
  email: string;
  password: string;
}

const secureCookie = env.nodeEnv === 'production';

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: LoginBody }>('/auth/login', {
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      reply.code(400).send({ ok: false, message: 'Email and password are required' });
      return;
    }

    const user = findUserByEmail(email);

    if (!user) {
      reply.code(401).send({ ok: false, message: 'Invalid email or password' });
      return;
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      reply.code(401).send({ ok: false, message: 'Invalid email or password' });
      return;
    }

    const token = signToken({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
    });

    reply.setCookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: secureCookie,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    reply.send({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  });

  app.get('/me', {
    preHandler: requireAuth(),
    schema: {
      tags: ['auth'],
      response: {
        200: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                tenantId: { anyOf: [{ type: 'string' }, { type: 'null' }] },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    if (!request.user) {
      reply.code(401).send({ ok: false, message: 'Unauthorized' });
      return;
    }

    reply.send({
      ok: true,
      user: {
        id: request.user.id,
        name: request.user.name,
        email: request.user.email,
        role: request.user.role,
        tenantId: request.user.tenantId ?? null,
      },
    });
  });
}
