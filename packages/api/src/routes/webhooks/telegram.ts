import express from 'express';
import { sendForm, sendText } from '../../bot/telegram';
import { matchFAQ } from '../../services/faqs';
import { findTriggeredForm } from '../../services/forms';
import { DataStore } from '../../utils/datastore';

const router = express.Router();

function getTenantId(): number {
  return Number(process.env.TELEGRAM_DEFAULT_TENANT_ID ?? '1');
}

function getChannelId(): number {
  return Number(process.env.TELEGRAM_DEFAULT_CHANNEL_ID ?? '1');
}

router.post('/', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const update = req.body ?? {};
  const message = update.message || update.edited_message;

  if (!message) {
    return res.json({ ok: true });
  }

  const chatId = message.chat?.id;
  const fromId = message.from?.id;
  if (!chatId || !fromId) {
    return res.json({ ok: true });
  }

  const tenantId = getTenantId();
  const channelId = getChannelId();
  const store = DataStore.getInstance();

  const customer = store.findOrCreateCustomer({
    tenantId,
    externalId: String(chatId),
    channel: 'telegram',
    displayName: [message.chat?.first_name, message.chat?.last_name].filter(Boolean).join(' ') || message.chat?.username,
  });

  const conversation = store.findOrCreateConversation({
    tenantId,
    channelId,
    customerId: customer.id,
  });

  const text: string = message.text || message.caption || '';
  const contentType = message.photo ? 'photo' : 'text';

  const inboundMessage = store.appendMessage({
    conversationId: conversation.id,
    direction: 'inbound',
    contentType,
    content: {
      text,
      photo: message.photo,
    },
    externalMessageId: message.message_id ? String(message.message_id) : undefined,
  });

  try {
    if (text) {
      const faq = matchFAQ(tenantId, text);
      if (faq.faqId && faq.answer && faq.score >= 0.4) {
        await sendText(channelId, String(chatId), faq.answer);
        store.appendMessage({
          conversationId: conversation.id,
          direction: 'outbound',
          contentType: 'text',
          content: { text: faq.answer, faqId: faq.faqId, score: faq.score },
        });
        return res.json({ ok: true });
      }

      const form = findTriggeredForm(tenantId, text);
      if (form.formId && form.schema) {
        await sendForm(channelId, String(chatId), form.schema);
        store.appendMessage({
          conversationId: conversation.id,
          direction: 'outbound',
          contentType: 'form',
          content: { formId: form.formId, schema: form.schema },
        });
        return res.json({ ok: true });
      }
    }

    const fallbackText = '已轉人工';
    await sendText(channelId, String(chatId), fallbackText);
    store.appendMessage({
      conversationId: conversation.id,
      direction: 'outbound',
      contentType: 'text',
      content: { text: fallbackText },
    });
    store.enqueueJob({
      tenantId,
      type: 'reply_suggest',
      payload: {
        conversationId: conversation.id,
        messageId: inboundMessage.id,
        channel: 'telegram',
      },
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error('Failed to process Telegram webhook', error);
    return res.status(500).json({ error: 'internal_error' });
  }
});

export default router;
