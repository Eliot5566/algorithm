import express from 'express'
import { faqRouter } from './routes/faqs.js'
import { attachUserFromHeader } from './middleware/attachUser.js'

export function createApp () {
  const app = express()

  app.use(express.json())
  app.use(attachUserFromHeader)
  app.use('/faqs', faqRouter)

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  return app
}
