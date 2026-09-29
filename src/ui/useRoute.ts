import { useCallback, useEffect, useState } from 'react'

export const ISLAND_ROUTE = '/'
export const ROOM_ROUTE = '/room'

const normalizePath = (path: string): string => {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }

  return path || ISLAND_ROUTE
}

/** History API 라우트. `/` 섬, `/room` 내 방 */
export const useRoute = () => {
  const [path, setPath] = useState(() =>
    normalizePath(window.location.pathname),
  )

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = useCallback((next: string) => {
    const normalized = normalizePath(next)
    if (normalized !== normalizePath(window.location.pathname)) {
      window.history.pushState({}, '', normalized)
    }
    setPath(normalized)
  }, [])

  return { path, navigate }
}
