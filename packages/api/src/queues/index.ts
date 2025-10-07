import { Queue, QueueScheduler, Worker, type JobsOptions } from 'bullmq';
import { getRedisConfig } from '../utils/redis.js';
import { collectDailyDigest, formatDailyDigestMessage } from '../services/dailyDigest.js';
import { sendTelegramMessage } from '../services/telegram.js';

export interface DailyDigestJobData {
  targetDate?: string;
}

export interface ReplySuggestJobData {
  tenantId: string;
  conversationId: string;
  messageId: string;
  text: string;
}

const connection = getRedisConfig();

export const dailyDigestQueue = new Queue<DailyDigestJobData>('daily_digest', {
  connection
});

export const replySuggestQueue = new Queue<ReplySuggestJobData>('reply_suggest', {
  connection
});

let initialised = false;
let dailyDigestScheduler: QueueScheduler | undefined;
let dailyDigestWorker: Worker<DailyDigestJobData> | undefined;
let replySuggestWorker: Worker<ReplySuggestJobData> | undefined;

export function initQueues(): void {
  if (initialised) {
    return;
  }
  initialised = true;

  dailyDigestScheduler = new QueueScheduler('daily_digest', { connection });
  void dailyDigestScheduler.waitUntilReady();

  dailyDigestWorker = new Worker(
    'daily_digest',
    async (job) => {
      const targetDate = job.data?.targetDate ? new Date(job.data.targetDate) : new Date();
      const tenants = await collectDailyDigest(targetDate);
      const message = formatDailyDigestMessage(targetDate, tenants);
      await sendTelegramMessage(message);
      return {
        tenants: tenants.length
      };
    },
    { connection }
  );

  dailyDigestWorker.on('failed', (job, error) => {
    console.error('[daily_digest] job failed', job?.id, error);
  });

  replySuggestWorker = new Worker(
    'reply_suggest',
    async (job) => {
      console.info('[reply_suggest] job received', job.id, job.data);
      return job.data;
    },
    { connection }
  );

  replySuggestWorker.on('failed', (job, error) => {
    console.error('[reply_suggest] job failed', job?.id, error);
  });
}

export async function enqueueDailyDigestJob(date: Date, options: JobsOptions = {}): Promise<void> {
  await dailyDigestQueue.add(
    'daily_digest',
    {
      targetDate: date.toISOString()
    },
    {
      removeOnComplete: true,
      removeOnFail: false,
      ...options
    }
  );
}

export async function enqueueReplySuggestJob(
  data: ReplySuggestJobData,
  options: JobsOptions = {}
): Promise<void> {
  await replySuggestQueue.add(
    'reply_suggest',
    data,
    {
      removeOnComplete: true,
      removeOnFail: false,
      ...options
    }
  );
}

export async function shutdownQueues(): Promise<void> {
  await Promise.all([
    dailyDigestWorker?.close(),
    replySuggestWorker?.close(),
    dailyDigestQueue.close(),
    replySuggestQueue.close(),
    dailyDigestScheduler?.close()
  ]);
}
