import { config } from 'dotenv';

config();

type Env = {
  nodeEnv: string;
  port: number;
  jwtSecret: string;
};

const ensureEnv = (): Env => {
  const { NODE_ENV, PORT, JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  const port = PORT ? Number(PORT) : 3000;

  if (Number.isNaN(port)) {
    throw new Error('PORT environment variable must be a number');
  }

  return {
    nodeEnv: NODE_ENV ?? 'development',
    port,
    jwtSecret: JWT_SECRET,
  };
};

export const env = ensureEnv();
