import express from 'express';
import { sendText } from '../bot/telegram';
import { DataStore } from '../utils/datastore';

const router = express.Router();

router.get('/conversations', (req, res) => {
  const { status, q } = req.query;
  const page = Number(req.query.page ?? '1');
  const pageSize = Number(req.query.pageSize ?? '20');
  const tenantId = Number(req.query.tenantId ?? process.env.TELEGRAM_DEFAULT_TENANT_ID ?? '1');

  const store = DataStore.getInstance();
  const result = store.listConversations({
    tenantId,
    status: status === 'open' || status === 'closed' ? (status as 'open' | 'closed') : undefined,
    q: typeof q === 'string' ? q : undefined,
    page,
    pageSize,
  });

  const data = result.data.map((conversation) => ({
    ...conversation,
    customer: store.getCustomer(conversation.customerId),
  }));

  res.json({
    data,
    pagination: {
      page,
      pageSize,
      total: result.total,
    },
  });
});

router.get('/conversations/:id/messages', (req, res) => {
  const conversationId = Number(req.params.id);
  const store = DataStore.getInstance();
  const conversation = store.getConversation(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: 'conversation_not_found' });
  }

  const messages = store.listMessages(conversationId);
  res.json({
    conversation,
    messages,
  });
});

router.post('/conversations/:id/reply', async (req, res) => {
  const conversationId = Number(req.params.id);
  const { text } = req.body ?? {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'invalid_text' });
  }

  const store = DataStore.getInstance();
  const conversation = store.getConversation(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: 'conversation_not_found' });
  }

  const customer = store.getCustomer(conversation.customerId);
  if (!customer) {
    return res.status(404).json({ error: 'customer_not_found' });
  }

  try {
    await sendText(conversation.channelId, customer.externalId, text);
    const message = store.appendMessage({
      conversationId: conversation.id,
      direction: 'outbound',
      contentType: 'text',
      content: { text },
    });

    res.json({ message });
  } catch (error) {
    console.error('Failed to send reply', error);
    res.status(500).json({ error: 'send_failed' });
  }
});

export default router;
