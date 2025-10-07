# Unified Inbox Monorepo

`unified-inbox` 是一個以 pnpm 建立的 monorepo，包含下列應用程式：

- **API** (`packages/api`): Fastify + TypeScript，連結 MSSQL、Redis 與 BullMQ。
- **Web** (`packages/web`): Next.js App Router + TypeScript，使用 Ant Design 與 React Query。
- **Shared** (`packages/shared`): 共用的 TypeScript 型別定義。

## 快速開始（本機開發）

```bash
# 安裝依賴
pnpm install

# 啟動所有子專案（API & Web）
pnpm dev

# 建置所有子專案
pnpm build
```

各子專案亦提供獨立 script：

```bash
# API 套件
cd packages/api
pnpm dev      # 使用 ts-node-dev
pnpm build    # 編譯至 dist/
pnpm start    # 執行編譯後檔案

# Web 套件
cd packages/web
pnpm dev
pnpm build
pnpm start
```

## 一鍵啟動（Docker Compose）

1. 建立 `.env` 檔案：

   ```bash
   cp .env.sample .env
   # 視需求調整環境變數（特別是 MSSQL 與 JWT 設定）
   ```

2. 執行下列指令：

   ```bash
   docker compose up --build
   ```

   - Nginx Proxy: <http://localhost:3000>
   - API Swagger UI: <http://localhost:3000/api/docs>

Compose 會同時啟動 MSSQL、Redis、API、Web 與 Nginx（反向代理 `/api` 至 Fastify，`/` 至 Next.js）。

## 環境變數

`packages/api` 與 `packages/web` 所需環境變數如下，亦可參考 [`./.env.sample`](./.env.sample)：

| 服務 | 變數                        | 說明                                            |
| ---- | --------------------------- | ----------------------------------------------- |
| API  | `MSSQL_SERVER`              | MSSQL 伺服器主機名稱                            |
| API  | `MSSQL_DB`                  | MSSQL 資料庫名稱                                |
| API  | `MSSQL_USER`                | MSSQL 登入帳號                                  |
| API  | `MSSQL_PASS`                | MSSQL 登入密碼（亦供 Docker MSSQL 容器使用）    |
| API  | `JWT_SECRET`                | JWT 簽章用金鑰                                  |
| API  | `TELEGRAM_BOT_TOKEN`        | Telegram Bot Token                              |
| API  | `TELEGRAM_WEBHOOK_SECRET`   | Telegram Webhook 驗證字串                       |
| API  | `TELEGRAM_DEFAULT_CHAT_ID`  | Telegram 預設通知 Chat ID                       |
| API  | `REDIS_HOST` / `REDIS_PORT` | Redis 連線設定（預設 docker-compose 服務名稱）  |
| Web  | `NEXT_PUBLIC_API_BASE`      | 前端呼叫 API 的 base path，Docker 版預設 `/api` |

## 專案結構

```
/ (repo root)
├─ packages/
│  ├─ api/        # Fastify + TypeScript API 伺服器
│  ├─ web/        # Next.js App Router 前端專案
│  └─ shared/     # 共用型別
├─ nginx/
│  └─ nginx.conf  # Nginx 反向代理設定
├─ docker-compose.yml
├─ .env.sample
├─ README.md
├─ package.json
└─ pnpm-workspace.yaml
```

後續可於 API 套件新增實際路由、MSSQL Schema 與 Redis 工作流程；Web 端亦可串接真實 API、處理 JWT 驗證與狀態管理。
