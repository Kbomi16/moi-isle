import { describe, expect, test } from 'bun:test'
import { LOOKS, lookById, lookUrl } from './looks.ts'

describe('looks', () => {
  test('없는 모습은 첫 모습으로 둔다', () => {
    expect(lookById('missing')?.id).toBe(LOOKS[0].id)
  })

  test('고른 모습의 주소를 만든다', () => {
    expect(lookUrl('character-female-a.glb')).toBe(
      '/models/kenney-mini/character-female-a.glb',
    )
  })

  test('키트에 둔 캐릭터 GLB를 모두 고를 수 있다', () => {
    expect(LOOKS).toHaveLength(12)
    expect(new Set(LOOKS.map((look) => look.file)).size).toBe(12)
  })
})
