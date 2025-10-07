import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import formsRouter from './routes/forms';
import ordersRouter from './routes/orders';
import formsSubmitRouter from './routes/forms-submit';

const app = express();

app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/forms', formsRouter);
app.use('/forms', formsSubmitRouter);
app.use('/orders', ordersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export default app;
