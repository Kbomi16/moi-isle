import { describe, expect, test } from 'bun:test'
import { ROLES, roleById } from './roles.ts'

describe('roles', () => {
  test('없는 직군은 첫 직군으로 둔다', () => {
    expect(roleById('missing')?.id).toBe(ROLES[0].id)
  })
})
