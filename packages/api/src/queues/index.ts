import { Queue } from 'bullmq';
import { env } from '../env';

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
};

export const notificationQueue = new Queue('notifications', {
  connection,
});

export const webhookQueue = new Queue('webhooks', {
  connection,
});

export type QueueName = 'notifications' | 'webhooks';

export const getQueue = (name: QueueName) => {
  switch (name) {
    case 'notifications':
      return notificationQueue;
    case 'webhooks':
      return webhookQueue;
    default:
      throw new Error(`Unknown queue name: ${name}`);
  }
};
