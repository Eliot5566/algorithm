import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MSSQL_SERVER: z.string().default('mssql'),
  MSSQL_DB: z.string().default('unified_inbox'),
  MSSQL_USER: z.string().default('sa'),
  MSSQL_PASS: z.string().default('YourStrong@Passw0rd'),
  JWT_SECRET: z.string().default('dev-secret'),
  TELEGRAM_BOT_TOKEN: z.string().default('replace-with-bot-token'),
  TELEGRAM_WEBHOOK_SECRET: z.string().default('replace-with-webhook-secret'),
  TELEGRAM_DEFAULT_CHAT_ID: z.string().default('replace-with-chat-id'),
  REDIS_HOST: z.string().default('redis'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env: Env = parsed.data;
