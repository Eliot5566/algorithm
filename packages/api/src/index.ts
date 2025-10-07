import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from './env';
import { authRoutes } from './routes/auth';

export const createApp = async () => {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(cookie, {
    parseOptions: {
      sameSite: 'lax',
    },
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'API Documentation',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:{port}',
          variables: {
            port: {
              default: String(env.port),
            },
          },
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  await app.register(authRoutes);

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
};

const start = async () => {
  const app = await createApp();

  try {
    await app.listen({ port: env.port, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${env.port}`);
    app.log.info(`Swagger UI available at /docs`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}
