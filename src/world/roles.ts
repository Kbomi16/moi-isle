export const ROLES = [
  { id: 'dev', label: '개발' },
  { id: 'design', label: '디자인' },
  { id: 'plan', label: '기획' },
  { id: 'other', label: '기타' },
] as const

export type RoleId = (typeof ROLES)[number]['id']

export const roleById = (id: string) =>
  ROLES.find((role) => role.id === id) ?? ROLES[0]
