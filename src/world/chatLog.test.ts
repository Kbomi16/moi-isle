import { describe, expect, test } from 'bun:test'
import { appendChatLine, type ChatLine } from './chatLog.ts'

const line = (id: string): ChatLine => ({
  id,
  speaker: '테스트',
  text: '안녕',
  at: 0,
})

describe('appendChatLine', () => {
  test('메시지를 끝에 붙인다', () => {
    expect(appendChatLine([], line('1'))).toEqual([line('1')])
  })

  test('최대 개수를 넘기면 오래된 항목을 제거한다', () => {
    const initial = [line('1'), line('2')]
    const next = appendChatLine(initial, line('3'), 2)
    expect(next.map((entry) => entry.id)).toEqual(['2', '3'])
  })
})
