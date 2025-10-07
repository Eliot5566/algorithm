import dotenv from 'dotenv';
import app from './index';
import { DataStore } from './utils/datastore';

dotenv.config();

const port = Number(process.env.PORT ?? 3000);

// Example seed data for demo purposes.
const store = DataStore.getInstance();
const tenantId = Number(process.env.TELEGRAM_DEFAULT_TENANT_ID ?? '1');
store.seedFAQs(tenantId, [
  {
    question: '營業時間',
    answer: '我們每日 09:00-18:00 營業。',
    keywords: ['營業', '時間'],
  },
]);
store.seedForms(tenantId, [
  {
    channelId: Number(process.env.TELEGRAM_DEFAULT_CHANNEL_ID ?? '1'),
    name: '客服滿意度調查',
    schema: {
      title: '客服滿意度調查',
      fields: [
        { id: 'rating', label: '請給予滿意度(1-5)', type: 'number' },
        { id: 'comment', label: '意見回饋', type: 'text' },
      ],
    },
    trigger_keywords: ['滿意度', '調查'],
  },
]);

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
