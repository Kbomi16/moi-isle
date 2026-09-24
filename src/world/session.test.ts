import { afterEach, describe, expect, test } from 'bun:test'
import {
  readGateProfile,
  writeGateProfile,
  writeStoredProfile,
} from './session.ts'

const storage = new Map<string, string>()

const sessionStorageMock = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => {
    storage.set(key, value)
  },
  removeItem: (key: string) => {
    storage.delete(key)
  },
  clear: () => {
    storage.clear()
  },
  key: () => null,
  length: 0,
}

afterEach(() => {
  storage.clear()
})

describe('session', () => {
  test('입장 프로필을 세션에 저장하고 읽는다', () => {
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: sessionStorageMock,
      configurable: true,
    })

    writeStoredProfile('모이', 'design')
    expect(readGateProfile()).toEqual({ nickname: '모이', roleId: 'design' })
  })

  test('직군만 바꿔도 세션에 남긴다', () => {
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: sessionStorageMock,
      configurable: true,
    })

    writeGateProfile({ nickname: '모이', roleId: 'dev' })
    writeGateProfile({ nickname: '모이', roleId: 'plan' })
    expect(readGateProfile()).toEqual({ nickname: '모이', roleId: 'plan' })
  })

  test('빈 이름은 입장 저장에 실패한다', () => {
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: sessionStorageMock,
      configurable: true,
    })

    expect(writeStoredProfile('   ', 'dev')).toBe(false)
  })
})
