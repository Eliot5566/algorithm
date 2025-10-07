# Algorithm Monorepo

本專案示範 FAQ 管理 API，採用 Node.js + Express + TypeScript 實作，並透過 Zod 進行輸入驗證。

## 專案結構

```
packages/
  api/
    src/
      routes/faqs.ts   # FAQ 路由
      services/        # FAQ 服務與相似度判斷
      middleware/      # 權限驗證
    docs/swagger.yaml  # API 文件
    tests/             # 單元測試
```

## FAQ API 使用說明

### 權限

所有 `/faqs` 相關路由均需在 `x-role` header 帶入 `owner` 或 `admin`。

### 路由

| Method | Path | 說明 |
| ------ | ---- | ---- |
| GET | `/faqs` | 列出所有 FAQ |
| POST | `/faqs` | 建立 FAQ |
| PATCH | `/faqs/:id` | 更新 FAQ |
| DELETE | `/faqs/:id` | 刪除 FAQ |
| POST | `/faqs/match` | 依照提問內容尋找最佳 FAQ |

建立與更新 FAQ 時需提供以下欄位：

- `question`：問題描述（必填）
- `answer`：回答內容（必填）

### 啟動開發伺服器

```bash
npm install
npm run dev
```

伺服器預設於 `http://localhost:3000` 啟動。

### 查詢 FAQ 答案範例

```bash
curl -X POST http://localhost:3000/faqs/match \
  -H 'Content-Type: application/json' \
  -H 'x-role: admin' \
  -d '{"query":"今天營業嗎"}'
```

## 單元測試

```bash
npm test
```

測試會建立三筆 FAQ 並驗證 `matchFAQ` 能對「今天營業嗎」、「菜單」、「付款」等語句找到正確答案。

## Swagger 文件

Swagger 定義位於 `packages/api/docs/swagger.yaml`，可使用任何 OpenAPI viewer 或 [Swagger Editor](https://editor.swagger.io/) 載入檢視。
