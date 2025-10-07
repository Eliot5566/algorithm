# Algorithm Repository

本專案包含多個範例與服務。以下說明如何在 `packages/api` 下執行資料庫 Migration 與 Seed。

## 如何執行 migration/seed

1. 進入 API 專案資料夾並安裝依賴：
   ```bash
   cd packages/api
   npm install
   ```
2. 設定連線所需的環境變數（例如 `DB_HOST`、`DB_USER`、`DB_PASSWORD`、`DB_NAME` 等）。
3. 執行 Migration：
   ```bash
   npm run db:migrate
   ```
4. 執行 Seed 匯入 Demo 資料：
   ```bash
   npm run db:seed
   ```

Migration/Seed 皆會使用 `src/db/pool.ts` 中設定的 MSSQL 連線池設定，請依照實際環境調整。
