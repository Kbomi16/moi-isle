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
})
