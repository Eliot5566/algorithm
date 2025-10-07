import { Router } from 'express'
import { z } from 'zod'
import { requireRole } from '../middleware/requireRole.js'
import { faqService } from '../services/faqService.js'

const faqCreateSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required')
})

const faqUpdateSchema = faqCreateSchema.partial().refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
})

export const faqRouter = Router()

const adminRoles: Parameters<typeof requireRole>[0] = ['owner', 'admin']

faqRouter.get('/', requireRole(adminRoles), (_req, res) => {
  const faqs = faqService.list()
  res.json(faqs)
})

faqRouter.post('/', requireRole(adminRoles), (req, res) => {
  const parseResult = faqCreateSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() })
  }
  const faq = faqService.create(parseResult.data)
  res.status(201).json(faq)
})

faqRouter.post('/match', requireRole(adminRoles), (req, res) => {
  const inputSchema = z.object({ query: z.string().min(1) })
  const parseResult = inputSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() })
  }
  const match = faqService.matchFAQ(parseResult.data.query)
  if (!match) {
    return res.status(404).json({ message: 'No FAQ matched' })
  }
  res.json(match)
})

faqRouter.patch('/:id', requireRole(adminRoles), (req, res) => {
  const parseResult = faqUpdateSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() })
  }
  const updated = faqService.update(req.params.id, parseResult.data)
  if (!updated) {
    return res.status(404).json({ message: 'FAQ not found' })
  }
  res.json(updated)
})

faqRouter.delete('/:id', requireRole(adminRoles), (req, res) => {
  const deleted = faqService.delete(req.params.id)
  if (!deleted) {
    return res.status(404).json({ message: 'FAQ not found' })
  }
  res.status(204).send()
})
