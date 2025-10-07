import type { RedisOptions } from 'bullmq';

const DEFAULT_REDIS_URL = 'redis://127.0.0.1:6379';

export function getRedisConfig(): RedisOptions {
  const redisUrl = process.env.REDIS_URL ?? DEFAULT_REDIS_URL;
  try {
    const url = new URL(redisUrl);
    const db = url.pathname ? Number(url.pathname.replace('/', '')) : undefined;

    return {
      host: url.hostname,
      port: Number(url.port) || 6379,
      db: Number.isFinite(db) ? db : undefined,
      password: url.password || undefined
    } satisfies RedisOptions;
  } catch (error) {
    console.warn('[redis] Invalid REDIS_URL provided, falling back to default localhost configuration.', error);
    return {
      host: '127.0.0.1',
      port: 6379
    };
  }
}
