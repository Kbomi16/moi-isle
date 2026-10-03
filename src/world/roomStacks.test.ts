import { describe, expect, it } from 'bun:test'
import {
  MAX_ROOM_STACKS,
  parseRoomStacks,
  togglePlacedStack,
  type StackId,
} from './roomStacks.ts'

describe('parseRoomStacks', () => {
  it('레거시 string[]을 PlacedStack으로 마이그레이션한다', () => {
    const raw = JSON.stringify(['react', 'nope', 'typescript'])
    const stacks = parseRoomStacks(raw)
    expect(stacks).toHaveLength(2)
    expect(stacks[0]?.stackId).toBe('react')
    expect(stacks[1]?.stackId).toBe('typescript')
  })
})

describe('togglePlacedStack', () => {
  it('추가·제거를 토글한다', () => {
    let stacks = togglePlacedStack([], 'react')
    expect(stacks).toHaveLength(1)
    expect(stacks[0]?.stackId).toBe('react')
    stacks = togglePlacedStack(stacks, 'react')
    expect(stacks).toHaveLength(0)
  })

  it('상한을 넘기면 추가하지 않는다', () => {
    const ids: StackId[] = [
      'react',
      'typescript',
      'javascript',
      'nextjs',
      'node',
      'bun',
      'three',
      'tailwind',
    ]
    let stacks = ids.flatMap((id) => togglePlacedStack([], id))
    expect(stacks.length).toBeLessThanOrEqual(MAX_ROOM_STACKS)
    stacks = togglePlacedStack(stacks, 'figma')
    expect(stacks).toHaveLength(MAX_ROOM_STACKS)
  })
})
