import { describe, expect, test } from 'bun:test'
import { parseAppRoute, visitRoomPath } from './routes.ts'

describe('parseAppRoute', () => {
  test('섬과 내 방을 구분한다', () => {
    expect(parseAppRoute('/')).toEqual({ kind: 'island' })
    expect(parseAppRoute('/room')).toEqual({ kind: 'own' })
    expect(parseAppRoute('/room/')).toEqual({ kind: 'own' })
  })

  test('다른 사람 방 id를 읽는다', () => {
    expect(parseAppRoute('/room/socket-a')).toEqual({
      kind: 'visit',
      id: 'socket-a',
    })
    expect(parseAppRoute(visitRoomPath('a/b'))).toEqual({ kind: 'island' })
  })
})
