import * as sql from 'mssql';

type Maybe<T> = T | null;

let pool: Maybe<sql.ConnectionPool> = null;

const parseIntEnv = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const poolConfig: sql.config = {
  server: process.env.DB_HOST ?? 'localhost',
  port: parseIntEnv(process.env.DB_PORT, 1433),
  user: process.env.DB_USER ?? 'sa',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'chatbot',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT !== 'false',
  },
  pool: {
    max: parseIntEnv(process.env.DB_POOL_MAX, 10),
    min: parseIntEnv(process.env.DB_POOL_MIN, 0),
    idleTimeoutMillis: parseIntEnv(process.env.DB_POOL_IDLE_TIMEOUT, 30000),
  },
};

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (pool && pool.connected) {
    return pool;
  }

  if (pool && pool.connecting) {
    return pool;
  }

  pool = await sql.connect(poolConfig);
  return pool;
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.close();
    pool = null;
  }
};

export { sql };
