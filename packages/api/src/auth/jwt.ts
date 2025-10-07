import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../env';

export type AuthRole = string;

export interface AuthTokenPayload {
  userId: string;
  tenantId?: string | null;
  role: AuthRole;
}

const DEFAULT_SIGN_OPTIONS: SignOptions = {
  expiresIn: '7d',
};

export const signToken = (payload: AuthTokenPayload, options: SignOptions = {}): string => {
  return jwt.sign(payload, env.jwtSecret, { ...DEFAULT_SIGN_OPTIONS, ...options });
};

export const verifyToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, env.jwtSecret);
  if (typeof decoded !== 'object' || decoded === null || !('userId' in decoded) || !('role' in decoded)) {
    throw new Error('Invalid token payload');
  }

  const { userId, tenantId, role } = decoded as AuthTokenPayload;

  return {
    userId,
    tenantId: tenantId ?? undefined,
    role,
  };
};
