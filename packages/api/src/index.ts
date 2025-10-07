import Fastify, { FastifyBaseLogger, FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import pino from 'pino';
import { env } from './env';
import { registerSwagger } from './plugins/swagger';
import { healthRoutes } from './routes/health';
import { getPool } from './db/mssql';
import { notificationQueue } from './queues';

export function buildServer(): FastifyInstance {
  const logger = pino({
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  }) as unknown as FastifyBaseLogger;

  const app = Fastify({
    logger,
  });

  app.register(cors, {
    origin: true,
    credentials: true,
  });

  app.addHook('onReady', async () => {
    try {
      await getPool();
      app.log.info('✅ MSSQL connection pool established');
    } catch (error) {
      app.log.error({ error }, 'Failed to initialize MSSQL pool');
    }

    try {
      await notificationQueue.waitUntilReady();
      app.log.info('✅ Redis connection ready for BullMQ queues');
    } catch (error) {
      app.log.error({ error }, 'Failed to initialize BullMQ queues');
    }
  });

  app.register(registerSwagger);
  app.register(healthRoutes, { prefix: '/api' });

  return app;
}

async function start() {
  const app = buildServer();
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    app.log.info(`🚀 API server listening on port ${env.PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}
