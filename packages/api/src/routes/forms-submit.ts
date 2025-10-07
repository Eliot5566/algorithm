import { Request, Response, Router } from 'express';
import { createSubmission, getForm } from '../store';

const formsSubmitRouter = Router();

formsSubmitRouter.post('/:id/submit', (req: Request, res: Response) => {
  const form = getForm(req.params.id);
  if (!form) {
    return res.status(404).json({ message: 'Form not found' });
  }

  const { conversationId, payload } = req.body ?? {};
  if (typeof conversationId !== 'string' || conversationId.trim().length === 0) {
    return res.status(400).json({ message: 'conversationId is required' });
  }

  if (typeof payload !== 'object' || payload === null) {
    return res.status(400).json({ message: 'payload must be an object' });
  }

  const submission = createSubmission({
    formId: form.id,
    conversationId: conversationId.trim(),
    payload,
  });

  const responseMessage = `已收到 ${form.name} 表單，編號 ${submission.id}。我們會儘快與您聯繫。`;

  res.status(201).json({
    data: submission,
    response: {
      conversationId: submission.conversationId,
      message: responseMessage,
    },
  });
});

export default formsSubmitRouter;
