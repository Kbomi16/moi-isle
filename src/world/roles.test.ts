import { describe, expect, test } from 'bun:test'
import { normalizeRoleId, ROLES, roleById } from './roles.ts'

describe('roles', () => {
  test('없는 직군은 첫 직군으로 둔다', () => {
    expect(roleById('missing')?.id).toBe(ROLES[0].id)
  })

  test('예전 직군 id는 새 목록으로 맞춘다', () => {
    expect(normalizeRoleId('dev')).toBe('frontend')
    expect(normalizeRoleId('design')).toBe('uiux')
    expect(normalizeRoleId('ui')).toBe('uiux')
    expect(normalizeRoleId('ux')).toBe('uiux')
    expect(normalizeRoleId('plan')).toBe('pm')
    expect(normalizeRoleId('other')).toBe('frontend')
  })
})
