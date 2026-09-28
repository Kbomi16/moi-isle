import { MAX_NICKNAME } from './constants.ts'

// 입장 닉네임 정규화 — trim, 연속 공백→한 칸, 빈 문자열 null, MAX_NICKNAME 초과 잘림
export const normalizeNickname = (raw: string): string | null => {
  const name = raw.trim().replace(/\s+/g, ' ')
  if (name.length === 0) {
    return null
  }

  return name.slice(0, MAX_NICKNAME)
}
