export type AppRoute =
  | { kind: 'island' }
  | { kind: 'own' }
  | { kind: 'visit'; id: string }

const normalizePath = (path: string): string => {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }

  return path || '/'
}

/** `/` 섬, `/room` 내 방, `/room/:id` 다른 사람 방 */
export const parseAppRoute = (path: string): AppRoute => {
  const normalized = normalizePath(path)
  if (normalized === '/room') {
    return { kind: 'own' }
  }

  if (normalized.startsWith('/room/')) {
    let id = normalized.slice('/room/'.length)
    try {
      id = decodeURIComponent(id)
    } catch {
      return { kind: 'island' }
    }
    if (id.length > 0 && !id.includes('/')) {
      return { kind: 'visit', id }
    }
  }

  return { kind: 'island' }
}

export const visitRoomPath = (id: string): string =>
  `/room/${encodeURIComponent(id)}`
