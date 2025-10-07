import fetch from 'node-fetch';

type TelegramResponse<T> = {
  ok: boolean;
  result?: T;
  description?: string;
};

const TELEGRAM_API_BASE = 'https://api.telegram.org';

async function callTelegramApi<T>(method: string, payload: Record<string, any>): Promise<T> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  }

  const url = `${TELEGRAM_API_BASE}/bot${token}/${method}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Telegram API request failed (${response.status}): ${text}`);
  }

  const body = (await response.json()) as TelegramResponse<T>;
  if (!body.ok) {
    throw new Error(body.description || 'Telegram API responded with ok=false');
  }
  return body.result as T;
}

export async function sendText(channelId: number, chatId: string, text: string): Promise<void> {
  // TODO: rate limit per channel once production workload is known.
  await callTelegramApi('sendMessage', {
    chat_id: chatId,
    text,
  });
}

export async function sendForm(channelId: number, chatId: string, formPayload: any): Promise<void> {
  // TODO: rate limit per channel once production workload is known.
  const formatted = typeof formPayload === 'string' ? formPayload : JSON.stringify(formPayload, null, 2);
  await callTelegramApi('sendMessage', {
    chat_id: chatId,
    text: `請填寫以下表單：\n${formatted}`,
  });
}
