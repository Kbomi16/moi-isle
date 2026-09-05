import { describe, expect, test } from 'bun:test'
import { normalizeNickname } from './nickname.ts'

describe('normalizeNickname', () => {
  test('앞뒤 공백을 지운다', () => {
    expect(normalizeNickname('  모이  ')).toBe('모이')
  })

  test('빈 이름은 거절한다', () => {
    expect(normalizeNickname('   ')).toBeNull()
  })

  test('10자를 넘으면 자른다', () => {
    expect(normalizeNickname('가나다라마바사아자차카')).toBe('가나다라마바사아자차')
  })
})
