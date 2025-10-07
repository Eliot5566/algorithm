import { createHash } from 'crypto';
import { closePool, getPool, sql } from './pool';

const DEMO_TENANT_NAME = 'Demo Cafe';
const DEMO_OWNER_EMAIL = 'owner@demo.local';
const DEMO_PASSWORD = '12345678';

const ensureTenant = async (): Promise<number> => {
  const pool = await getPool();
  const existing = await pool
    .request()
    .input('name', sql.NVarChar(100), DEMO_TENANT_NAME)
    .query('SELECT id FROM Tenants WHERE name = @name');

  if (existing.recordset.length > 0) {
    return existing.recordset[0].id as number;
  }

  const inserted = await pool
    .request()
    .input('name', sql.NVarChar(100), DEMO_TENANT_NAME)
    .query(
      "INSERT INTO Tenants (name, plan) OUTPUT INSERTED.id VALUES (@name, 'free')"
    );

  return inserted.recordset[0].id as number;
};

const ensureOwner = async (tenantId: number): Promise<number> => {
  const pool = await getPool();
  const existing = await pool
    .request()
    .input('email', sql.NVarChar(150), DEMO_OWNER_EMAIL)
    .query('SELECT id FROM Users WHERE email = @email');

  if (existing.recordset.length > 0) {
    return existing.recordset[0].id as number;
  }

  const passwordHash = createHash('sha256').update(DEMO_PASSWORD).digest();

  const inserted = await pool
    .request()
    .input('tenantId', sql.Int, tenantId)
    .input('email', sql.NVarChar(150), DEMO_OWNER_EMAIL)
    .input('passwordHash', sql.VarBinary(256), passwordHash)
    .input('name', sql.NVarChar(80), 'Demo Owner')
    .input('role', sql.NVarChar(20), 'owner')
    .query(
      'INSERT INTO Users (tenant_id, email, password_hash, name, role) OUTPUT INSERTED.id VALUES (@tenantId, @email, @passwordHash, @name, @role)'
    );

  return inserted.recordset[0].id as number;
};

const ensureTelegramChannel = async (tenantId: number): Promise<number> => {
  const pool = await getPool();
  const existing = await pool
    .request()
    .input('tenantId', sql.Int, tenantId)
    .input('type', sql.NVarChar(20), 'telegram')
    .query('SELECT id FROM Channels WHERE tenant_id = @tenantId AND type = @type');

  if (existing.recordset.length > 0) {
    return existing.recordset[0].id as number;
  }

  const config = {
    botToken: '123456:ABCDEF-telegram-demo-token',
    webhookUrl: 'https://demo.local/telegram/webhook',
  };

  const inserted = await pool
    .request()
    .input('tenantId', sql.Int, tenantId)
    .input('type', sql.NVarChar(20), 'telegram')
    .input('configJson', sql.NVarChar(sql.MAX), JSON.stringify(config))
    .query(
      "INSERT INTO Channels (tenant_id, type, config_json) OUTPUT INSERTED.id VALUES (@tenantId, @type, @configJson)"
    );

  return inserted.recordset[0].id as number;
};

const ensureFaqs = async (tenantId: number): Promise<void> => {
  const pool = await getPool();
  const faqs = [
    {
      question: '營業時間？',
      answer: '我們每週二至週日 10:00-21:00 營業，週一公休。',
      tags: 'general',
    },
    {
      question: '是否提供外帶？',
      answer: '提供外帶與外送服務，可透過 LINE 或電話訂購。',
      tags: 'service',
    },
    {
      question: '餐廳位置在哪裡？',
      answer: '位於台北市中正區仁愛路 100 號，近捷運忠孝新生站。',
      tags: 'location',
    },
  ];

  for (const faq of faqs) {
    const exists = await pool
      .request()
      .input('tenantId', sql.Int, tenantId)
      .input('question', sql.NVarChar(500), faq.question)
      .query('SELECT id FROM FAQs WHERE tenant_id = @tenantId AND question = @question');

    if (exists.recordset.length > 0) {
      continue;
    }

    await pool
      .request()
      .input('tenantId', sql.Int, tenantId)
      .input('question', sql.NVarChar(500), faq.question)
      .input('answer', sql.NVarChar(sql.MAX), faq.answer)
      .input('enabled', sql.Bit, true)
      .input('tags', sql.NVarChar(200), faq.tags)
      .query(
        'INSERT INTO FAQs (tenant_id, question, answer, enabled, tags) VALUES (@tenantId, @question, @answer, @enabled, @tags)'
      );
  }
};

const ensureReservationForm = async (tenantId: number): Promise<number> => {
  const pool = await getPool();
  const existing = await pool
    .request()
    .input('tenantId', sql.Int, tenantId)
    .input('name', sql.NVarChar(100), '訂位')
    .query('SELECT id FROM Forms WHERE tenant_id = @tenantId AND name = @name');

  if (existing.recordset.length > 0) {
    return existing.recordset[0].id as number;
  }

  const schema = {
    title: '訂位',
    fields: [
      { name: 'partySize', label: '人數', type: 'number', required: true },
      { name: 'date', label: '日期', type: 'date', required: true },
      {
        name: 'session',
        label: '時段',
        type: 'select',
        required: true,
        options: [
          { label: '午', value: 'lunch' },
          { label: '晚', value: 'dinner' },
        ],
      },
      { name: 'name', label: '姓名', type: 'text', required: true },
      { name: 'phone', label: '電話', type: 'text', required: true },
    ],
  };

  const inserted = await pool
    .request()
    .input('tenantId', sql.Int, tenantId)
    .input('name', sql.NVarChar(100), '訂位')
    .input('schemaJson', sql.NVarChar(sql.MAX), JSON.stringify(schema))
    .input('triggerKeywords', sql.NVarChar(300), '訂位,定位,預約')
    .input('enabled', sql.Bit, true)
    .query(
      'INSERT INTO Forms (tenant_id, name, schema_json, trigger_keywords, enabled) OUTPUT INSERTED.id VALUES (@tenantId, @name, @schemaJson, @triggerKeywords, @enabled)'
    );

  return inserted.recordset[0].id as number;
};

const main = async () => {
  try {
    const tenantId = await ensureTenant();
    await ensureOwner(tenantId);
    await ensureTelegramChannel(tenantId);
    await ensureFaqs(tenantId);
    await ensureReservationForm(tenantId);
  } catch (error) {
    console.error('Seed failed', error);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
};

void main();
