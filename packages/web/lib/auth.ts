import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from './constants';

export interface Session {
  token: string;
  userId?: string;
}

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  // TODO: Verify JWT signature and decode claims once the shared secret is available.
  return {
    token,
    userId: undefined,
  };
}
