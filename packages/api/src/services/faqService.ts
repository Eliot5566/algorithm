import { randomUUID } from 'node:crypto'
import { computeSimilarity } from '../utils/text.js'

export interface FAQ {
  id: string
  question: string
  answer: string
  createdAt: Date
  updatedAt: Date
}

export interface FAQInput {
  question: string
  answer: string
}

export class FAQService {
  private readonly faqs: Map<string, FAQ> = new Map()

  list (): FAQ[] {
    return Array.from(this.faqs.values())
  }

  getById (id: string): FAQ | undefined {
    return this.faqs.get(id)
  }

  create (input: FAQInput): FAQ {
    const now = new Date()
    const faq: FAQ = {
      id: randomUUID(),
      question: input.question,
      answer: input.answer,
      createdAt: now,
      updatedAt: now
    }
    this.faqs.set(faq.id, faq)
    return faq
  }

  update (id: string, input: Partial<FAQInput>): FAQ | undefined {
    const existing = this.faqs.get(id)
    if (!existing) {
      return undefined
    }
    const updated: FAQ = {
      ...existing,
      question: input.question ?? existing.question,
      answer: input.answer ?? existing.answer,
      updatedAt: new Date()
    }
    this.faqs.set(id, updated)
    return updated
  }

  delete (id: string): boolean {
    return this.faqs.delete(id)
  }

  matchFAQ (query: string): FAQ | null {
    if (!query.trim()) {
      return null
    }
    const faqs = this.list()
    if (faqs.length === 0) {
      return null
    }

    let best: { faq: FAQ, score: number } | null = null
    for (const faq of faqs) {
      const score = computeSimilarity(query, faq.question)
      if (score === 0) continue
      if (!best || score > best.score) {
        best = { faq, score }
      }
    }

    if (!best) {
      return null
    }

    return best.faq
  }
}

export const faqService = new FAQService()
