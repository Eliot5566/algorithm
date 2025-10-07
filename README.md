# Forms API Prototype

此範例專案提供一個以 Express 建立的簡單表單管理 API。服務會暫存資料於記憶體中，並提供 Swagger 文件方便了解端點。

## 專案結構

```
packages/
  api/
    src/
      routes/        # 表單、訂單（表單送出）相關的路由
      app.ts         # 建立 Express App
      server.ts      # 進入點
    swagger.yaml     # OpenAPI 規格
```

## 安裝與啟動

```bash
cd packages/api
npm install
npm run build
npm start
```

開發階段可以使用熱重載模式：

```bash
npm run dev
```

服務預設會在 `http://localhost:3000` 啟動，並提供以下端點：

- `GET /forms`：取得所有表單
- `POST /forms`：建立新表單
- `POST /forms/{id}/preview`：取得簡化的表單預覽（文字敘述與快速回覆鍵資訊）
- `POST /forms/{id}/submit`：模擬聊天端送回資料並建立 `FormSubmissions`
- `GET /orders`：取得所有 `FormSubmissions`
- `PATCH /orders/{id}`：更新 `FormSubmissions` 狀態（new/confirmed/cancelled）
- `GET /health`：健康檢查

Swagger 文件可於 `http://localhost:3000/docs` 查看。

## 注意事項

- 資料儲存於記憶體，因此重啟服務後資料會清空。
- `POST /forms` 與 `POST /forms/{id}/submit` 皆會驗證必要欄位，若缺少會回傳 400。
- `PATCH /orders/{id}` 只接受 `new`、`confirmed`、`cancelled` 三種狀態。
