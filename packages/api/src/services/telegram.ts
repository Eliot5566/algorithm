import axios from 'axios';

export interface TelegramSendMessageResult {
  ok: boolean;
  description?: string;
  result?: unknown;
}

export async function sendTelegramMessage(text: string, chatId?: string): Promise<TelegramSendMessageResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const targetChatId = chatId ?? process.env.TELEGRAM_DEFAULT_CHAT_ID;

  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured.');
  }

  if (!targetChatId) {
    throw new Error('TELEGRAM_DEFAULT_CHAT_ID is not configured.');
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await axios.post(url, {
    chat_id: targetChatId,
    text,
    parse_mode: 'Markdown'
  });

  return response.data as TelegramSendMessageResult;
}
