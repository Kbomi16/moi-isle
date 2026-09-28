export type ChatLine = {
  id: string
  speaker: string
  text: string
  at: number
}

export const MAX_CHAT_LOG = 80

export const createChatLineId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export const appendChatLine = (
  lines: ChatLine[],
  line: ChatLine,
  max = MAX_CHAT_LOG,
): ChatLine[] => {
  const next = [...lines, line]
  if (next.length <= max) {
    return next
  }
  return next.slice(next.length - max)
}
