import { MAX_NICKNAME } from './constants.ts'
import { normalizeNickname } from './nickname.ts'
import { normalizeRoleId, ROLES } from './roles.ts'
import type { RoleId } from './roles.ts'

// 탭 sessionStorage — 입장 확정 전 게이트 폼 값 + 입장 시 정규화된 프로필
const STORAGE_KEY = 'moi-isle:profile'

export type StoredProfile = {
  nickname: string
  roleId: RoleId
}

const defaultProfile = (): StoredProfile => ({
  nickname: '',
  roleId: ROLES[0].id,
})

// NameGate 마운트 시 — JSON 파싱 실패·SSR면 기본값
export const readGateProfile = (): StoredProfile => {
  if (typeof sessionStorage === 'undefined') {
    return defaultProfile()
  }

  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return defaultProfile()
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) {
      return defaultProfile()
    }

    const nickname =
      'nickname' in parsed && typeof parsed.nickname === 'string'
        ? parsed.nickname.slice(0, MAX_NICKNAME)
        : ''
    const roleId =
      'roleId' in parsed && typeof parsed.roleId === 'string'
        ? normalizeRoleId(parsed.roleId)
        : ROLES[0].id

    return { nickname, roleId }
  } catch {
    return defaultProfile()
  }
}

// 게이트에서 타이핑·직군 변경마다 호출 (아직 normalizeNickname 전)
export const writeGateProfile = (profile: StoredProfile): void => {
  if (typeof sessionStorage === 'undefined') {
    return
  }

  const roleId = normalizeRoleId(profile.roleId)
  const nickname = profile.nickname.slice(0, MAX_NICKNAME)
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ nickname, roleId } satisfies StoredProfile),
  )
}

// App.handleEnter — 닉네임 정규화 후 저장, 실패 시 false
export const writeStoredProfile = (
  nickname: string,
  roleId: RoleId,
): boolean => {
  const normalized = normalizeNickname(nickname)
  if (!normalized) {
    return false
  }

  writeGateProfile({ nickname: normalized, roleId: normalizeRoleId(roleId) })
  return true
}
