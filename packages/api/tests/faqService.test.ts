import { describe, expect, it } from 'vitest'
import { FAQService } from '../src/services/faqService.js'

const seedFAQs = (service: FAQService) => {
  const faq1 = service.create({
    question: '今天有營業嗎？',
    answer: '我們每天 10:00-22:00 營業。'
  })
  const faq2 = service.create({
    question: '可以提供菜單嗎？',
    answer: '完整菜單可以在我們的網站上下載。'
  })
  const faq3 = service.create({
    question: '有哪些付款方式？',
    answer: '我們接受現金、信用卡與行動支付。'
  })
  return { faq1, faq2, faq3 }
}

describe('FAQService.matchFAQ', () => {
  it('should match semantically similar Chinese questions', () => {
    const service = new FAQService()
    const { faq1, faq2, faq3 } = seedFAQs(service)

    expect(service.matchFAQ('今天營業嗎')?.id).toBe(faq1.id)
    expect(service.matchFAQ('請問菜單')?.id).toBe(faq2.id)
    expect(service.matchFAQ('支援那些付款')?.id).toBe(faq3.id)
  })

  it('returns null when nothing matches', () => {
    const service = new FAQService()
    seedFAQs(service)

    expect(service.matchFAQ('這個問題不存在')).toBeNull()
  })
})
