import { DataStore, FAQ } from '../utils/datastore';

export interface FAQMatchResult {
  faqId?: number;
  answer?: string;
  score: number;
}

const SYMBOL_REGEX = /[\p{P}\p{S}]+/gu;

function tokenize(text: string): string[] {
  return text
    .replace(SYMBOL_REGEX, ' ')
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

function buildSearchTokens(faq: FAQ): string[] {
  const base = `${faq.question} ${faq.answer} ${(faq.keywords ?? []).join(' ')}`;
  return tokenize(base);
}

function computeScore(searchTokens: Set<string>, sourceTokens: string[]): number {
  if (searchTokens.size === 0 || sourceTokens.length === 0) {
    return 0;
  }
  let matched = 0;
  for (const token of searchTokens) {
    if (sourceTokens.includes(token)) {
      matched += 1;
    }
  }
  return matched / searchTokens.size;
}

export function matchFAQ(tenantId: number, text: string): FAQMatchResult {
  const store = DataStore.getInstance();
  const faqs = store.listFAQs(tenantId);
  const searchTokens = new Set(tokenize(text));

  let best: FAQMatchResult = { score: 0 };

  for (const faq of faqs) {
    const tokens = buildSearchTokens(faq);
    const score = computeScore(searchTokens, tokens);
    if (score > best.score) {
      best = { faqId: faq.id, answer: faq.answer, score };
    }
  }

  return best;
}
