import { MAX_NICKNAME } from './constants.ts'
import { normalizeNickname } from './nickname.ts'
import { ROLES } from './roles.ts'
import type { RoleId } from './roles.ts'

const STORAGE_KEY = 'moi-isle:profile'

export type StoredProfile = {
  nickname: string
  roleId: RoleId
}

const isRoleId = (value: unknown): value is RoleId =>
  typeof value === 'string' && ROLES.some((role) => role.id === value)

const defaultProfile = (): StoredProfile => ({
  nickname: '',
  roleId: ROLES[0].id,
})

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
      'roleId' in parsed && isRoleId(parsed.roleId)
        ? parsed.roleId
        : ROLES[0].id

    return { nickname, roleId }
  } catch {
    return defaultProfile()
  }
}

export const writeGateProfile = (profile: StoredProfile): void => {
  if (typeof sessionStorage === 'undefined') {
    return
  }

  const roleId = isRoleId(profile.roleId) ? profile.roleId : ROLES[0].id
  const nickname = profile.nickname.slice(0, MAX_NICKNAME)
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ nickname, roleId } satisfies StoredProfile),
  )
}

export const writeStoredProfile = (
  nickname: string,
  roleId: RoleId,
): boolean => {
  const normalized = normalizeNickname(nickname)
  if (!normalized || !isRoleId(roleId)) {
    return false
  }

  writeGateProfile({ nickname: normalized, roleId })
  return true
}
