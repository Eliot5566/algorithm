import express from 'express';
import dotenv from 'dotenv';
import notifyRouter from './routes/notify.js';
import { initQueues } from './queues/index.js';
import { initCron } from './cron.js';

dotenv.config();

initQueues();
initCron();

const app = express();
app.use(express.json());
app.use('/notify', notifyRouter);

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`[api] server listening on port ${port}`);
});
