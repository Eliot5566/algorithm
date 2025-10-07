import cron from 'node-cron';
import { enqueueDailyDigestJob } from './queues/index.js';

let cronInitialised = false;

export function initCron(): void {
  if (cronInitialised) {
    return;
  }
  cronInitialised = true;

  const timezone = process.env.CRON_TIMEZONE ?? 'Asia/Taipei';

  cron.schedule(
    '30 16 * * *',
    () => {
      void enqueueDailyDigestJob(new Date());
    },
    {
      timezone
    }
  );
}
