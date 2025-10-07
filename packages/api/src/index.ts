import express from 'express';
import swaggerUi from 'swagger-ui-express';
import telegramWebhookRouter from './routes/webhooks/telegram';
import inboxRouter from './routes/inbox';
import { swaggerDocument } from './swagger';

const app = express();

app.use(express.json({ limit: '2mb' }));

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/webhooks/telegram', telegramWebhookRouter);
app.use('/inbox', inboxRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
