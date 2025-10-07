import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { closePool, getPool, sql } from './pool';

const MIGRATIONS_TABLE = 'SchemaMigrations';

const migrationsDir = path.resolve(__dirname, '../../migrations');

const ensureMigrationsTable = async (): Promise<void> => {
  const pool = await getPool();
  await pool
    .request()
    .batch(`
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[${MIGRATIONS_TABLE}]') AND type = 'U')
BEGIN
    CREATE TABLE [dbo].[${MIGRATIONS_TABLE}] (
        id INT IDENTITY PRIMARY KEY,
        filename NVARCHAR(255) NOT NULL UNIQUE,
        applied_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END`);
};

const runMigrations = async (): Promise<void> => {
  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();
  if (files.length === 0) {
    console.log('No migrations found.');
    return;
  }

  const pool = await getPool();

  for (const file of files) {
    const alreadyApplied = await pool
      .request()
      .input('filename', sql.NVarChar(255), file)
      .query(`SELECT 1 FROM [dbo].[${MIGRATIONS_TABLE}] WHERE filename = @filename`);

    if (alreadyApplied.recordset.length > 0) {
      console.log(`Skipping already applied migration: ${file}`);
      continue;
    }

    const fullPath = path.join(migrationsDir, file);
    const sqlContent = await readFile(fullPath, 'utf-8');

    console.log(`Applying migration: ${file}`);
    await pool.request().batch(sqlContent);
    await pool
      .request()
      .input('filename', sql.NVarChar(255), file)
      .query(`INSERT INTO [dbo].[${MIGRATIONS_TABLE}] (filename) VALUES (@filename)`);
  }
};

const main = async () => {
  try {
    await ensureMigrationsTable();
    await runMigrations();
  } catch (error) {
    console.error('Migration failed', error);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
};

void main();
