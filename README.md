# Deployment Guide

## 快速開始

1. 準備 `.env` 檔案（提供資料庫 SA 密碼、API 服務所需設定、`TELEGRAM_WEBHOOK_SECRET` 等環境變數）。
2. 於專案根目錄執行：

   ```bash
   docker compose up -d --build
   ```

服務啟動後，瀏覽器造訪 `http://localhost` 即可透過 Nginx 反向代理使用 Web 與 API。

## 預設帳號

- 帳號：`owner@demo.local`
- 密碼：`12345678`

## Telegram Bot Webhook 設定

1. 透過 [BotFather](https://t.me/BotFather) 建立新的 BOT 並取得 Token。
2. 服務啟動後，使用下列指令設定 webhook（請將 `<public-host>` 替換為對外網址或 IP）：

   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url":"http://<public-host>/api/webhooks/telegram?secret=TELEGRAM_WEBHOOK_SECRET"}'
   ```

   將 `TELEGRAM_WEBHOOK_SECRET` 替換為 `.env` 中設定的密鑰。
