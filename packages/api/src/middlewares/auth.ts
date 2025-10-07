import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../auth/jwt';
import { findUserById, User } from '../users/store';

export interface RequestUser extends Omit<User, 'passwordHash'> {}

declare module 'fastify' {
  interface FastifyRequest {
    user?: RequestUser;
    authToken?: string;
  }
}

const extractToken = (request: FastifyRequest): string | null => {
  const cookieToken = (request.cookies as Record<string, string | undefined> | undefined)?.token;
  if (cookieToken) {
    return cookieToken;
  }

  const header = request.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7);
  }

  return null;
};

const unauthorized = (reply: FastifyReply) => {
  reply.code(401).send({ ok: false, message: 'Unauthorized' });
};

export const requireAuth = () =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const token = extractToken(request);

    if (!token) {
      unauthorized(reply);
      return;
    }

    try {
      const payload = verifyToken(token);
      const user = findUserById(payload.userId);

      if (!user) {
        unauthorized(reply);
        return;
      }

      request.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      };
      request.authToken = token;
    } catch (error) {
      request.log.error({ err: error }, 'Failed to verify token');
      unauthorized(reply);
      return;
    }
  };

export const requireRole = (roles: string[]) => {
  const allowed = new Set(roles);

  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      unauthorized(reply);
      return;
    }

    if (allowed.size === 0 || !allowed.has(request.user.role)) {
      reply.code(403).send({ ok: false, message: 'Forbidden' });
      return;
    }
  };
};
