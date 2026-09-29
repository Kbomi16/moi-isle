import { describe, expect, test } from 'bun:test'
import {
  appendGuestbookEntry,
  normalizeGuestbookText,
  parseGuestbook,
  type GuestbookEntry,
} from './guestbook.ts'

const entry = (id: string): GuestbookEntry => ({
  id,
  author: '보미',
  text: '안녕',
  at: 0,
})

describe('normalizeGuestbookText', () => {
  test('빈 글은 거절한다', () => {
    expect(normalizeGuestbookText('   ')).toBeNull()
  })

  test('연속 공백을 한 칸으로 줄이고 80자에서 자른다', () => {
    expect(normalizeGuestbookText('  안녕   섬  ')).toBe('안녕 섬')
    expect(normalizeGuestbookText('가'.repeat(90))?.length).toBe(80)
  })
})

describe('appendGuestbookEntry', () => {
  test('새 글을 앞에 붙인다', () => {
    expect(appendGuestbookEntry([entry('1')], entry('2')).map((item) => item.id)).toEqual([
      '2',
      '1',
    ])
  })

  test('상한을 넘기면 오래된 글을 버린다', () => {
    const next = appendGuestbookEntry([entry('1'), entry('2')], entry('3'), 2)
    expect(next.map((item) => item.id)).toEqual(['3', '1'])
  })
})

describe('parseGuestbook', () => {
  test('깨진 JSON은 빈 목록이다', () => {
    expect(parseGuestbook('nope')).toEqual([])
  })

  test('형식이 맞는 항목만 남긴다', () => {
    const raw = JSON.stringify([entry('1'), { id: 1 }, entry('2')])
    expect(parseGuestbook(raw).map((item) => item.id)).toEqual(['1', '2'])
  })
})
