import sql, { ConnectionPool, config as SQLConfig } from 'mssql';
import { env } from '../env';

declare global {
  // eslint-disable-next-line no-var
  var __MSSQL_POOL__: Promise<ConnectionPool> | undefined;
}

const config: SQLConfig = {
  server: env.MSSQL_SERVER,
  database: env.MSSQL_DB,
  user: env.MSSQL_USER,
  password: env.MSSQL_PASS,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const getPool = async (): Promise<ConnectionPool> => {
  if (!global.__MSSQL_POOL__) {
    global.__MSSQL_POOL__ = new sql.ConnectionPool(config)
      .connect()
      .then((pool: ConnectionPool) => {
        pool.on('error', (error: Error) => {
          console.error('MSSQL connection pool error', error);
        });
        return pool;
      })
      .catch((error: Error) => {
        console.error('Failed to connect to MSSQL', error);
        throw error;
      });
  }

  return global.__MSSQL_POOL__;
};
