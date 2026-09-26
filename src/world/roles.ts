export const ROLES = [
  { id: 'frontend', label: '프론트' },
  { id: 'backend', label: '백엔드' },
  { id: 'fullstack', label: '풀스택' },
  { id: 'mobile', label: '모바일' },
  { id: 'uiux', label: 'UI/UX' },
  { id: 'pm', label: 'PM' },
  { id: 'planner', label: '서비스기획' },
  { id: 'data', label: '데이터' },
  { id: 'infra', label: '인프라' },
  { id: 'qa', label: 'QA' },
] as const

export type RoleId = (typeof ROLES)[number]['id']

const LEGACY_ROLE_IDS: Record<string, RoleId> = {
  dev: 'frontend',
  design: 'uiux',
  ui: 'uiux',
  ux: 'uiux',
  plan: 'pm',
  other: 'frontend',
}

export const normalizeRoleId = (id: string): RoleId => {
  if (ROLES.some((role) => role.id === id)) {
    return id as RoleId
  }
  return LEGACY_ROLE_IDS[id] ?? ROLES[0].id
}

export const roleById = (id: string) =>
  ROLES.find((role) => role.id === normalizeRoleId(id)) ?? ROLES[0]
