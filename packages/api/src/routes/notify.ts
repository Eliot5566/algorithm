import { Router } from 'express';
import { sendTelegramMessage } from '../services/telegram.js';

const router = Router();

router.post('/test', async (req, res, next) => {
  try {
    const { text, chatId } = req.body ?? {};

    if (typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'text is required' });
      return;
    }

    const response = await sendTelegramMessage(text, chatId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
