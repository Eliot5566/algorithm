const CJK_REGEX = /\p{Script=Han}/gu
const TOKEN_REGEX = /[\p{L}\p{N}]+/gu

const tokenize = (text: string): string[] => {
  const normalized = text.toLowerCase()
  const tokens: string[] = []
  const seen = new Set<string>()

  const tokenMatches = normalized.match(TOKEN_REGEX) ?? []
  for (const token of tokenMatches) {
    if (!seen.has(token)) {
      seen.add(token)
      tokens.push(token)
    }
  }

  const cjkMatches = normalized.match(CJK_REGEX) ?? []
  for (const char of cjkMatches) {
    if (!seen.has(char)) {
      seen.add(char)
      tokens.push(char)
    }
  }

  return tokens
}

export const computeSimilarity = (a: string, b: string): number => {
  const tokensA = tokenize(a)
  const tokensB = tokenize(b)
  if (tokensA.length === 0 || tokensB.length === 0) {
    return 0
  }

  const setA = new Set(tokensA)
  const setB = new Set(tokensB)

  let intersection = 0
  for (const token of setA) {
    if (setB.has(token)) {
      intersection += 1
    }
  }

  const union = new Set([...tokensA, ...tokensB]).size

  let score = intersection / union

  const normalizedA = a.toLowerCase().replace(/\s+/g, '')
  const normalizedB = b.toLowerCase().replace(/\s+/g, '')
  if (normalizedA && normalizedB) {
    if (normalizedA.includes(normalizedB) || normalizedB.includes(normalizedA)) {
      score += 0.25
    }
  }

  return Math.min(score, 1)
}
