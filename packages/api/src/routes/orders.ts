import { Request, Response, Router } from 'express';
import { listSubmissions, updateSubmissionStatus, SubmissionStatus } from '../store';

const ordersRouter = Router();

ordersRouter.get('/', (_req: Request, res: Response) => {
  res.json({ data: listSubmissions() });
});

ordersRouter.patch('/:id', (req: Request, res: Response) => {
  const { status } = req.body ?? {};

  if (!isValidStatus(status)) {
    return res.status(400).json({ message: 'status must be one of new, confirmed, or cancelled' });
  }

  const submission = updateSubmissionStatus(req.params.id, status);
  if (!submission) {
    return res.status(404).json({ message: 'Form submission not found' });
  }

  res.json({ data: submission });
});

export default ordersRouter;

function isValidStatus(value: unknown): value is SubmissionStatus {
  return value === 'new' || value === 'confirmed' || value === 'cancelled';
}
