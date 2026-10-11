import { describe, expect, it } from 'bun:test'
import { parseInitialize, parseNewText, parsePose, withoutSelf } from './realtime.ts'
import { dropPlayer, listPlayers, movePlayer, upsertPlayer } from '../../server/players.ts'
import type { IslePlayer } from './realtime.ts'

const player = (id: string): IslePlayer => ({
  id,
  nickname: '보미',
  lookId: 'female-a',
  roleId: 'frontend',
  pose: { x: 1, z: 2, yaw: 0 },
})

describe('parseInitialize', () => {
  it('닉네임·모습·좌표가 맞으면 접속자를 만든다', () => {
    const parsed = parseInitialize({
      nickname: ' 보미 ',
      lookId: 'female-a',
      roleId: 'frontend',
      pose: { x: 0.4, z: 5.2, yaw: 0 },
    })
    expect(parsed?.nickname).toBe('보미')
    expect(parsed?.lookId).toBe('female-a')
  })

  it('모르는 모습이면 버린다', () => {
    expect(
      parseInitialize({
        nickname: '보미',
        lookId: 'nope',
        roleId: 'frontend',
        pose: { x: 0, z: 0, yaw: 0 },
      }),
    ).toBeNull()
  })
})

describe('parsePose', () => {
  it('섬 밖 좌표는 버린다', () => {
    expect(parsePose({ x: 99, z: 0, yaw: 0 })).toBeNull()
  })
})

describe('parseNewText', () => {
  it('빈 글은 버린다', () => {
    expect(parseNewText({ text: '   ' })).toBeNull()
  })
})

describe('player book', () => {
  it('입장·이동·퇴장 목록을 갱신한다', () => {
    let book = upsertPlayer(new Map(), player('a'))
    book = upsertPlayer(book, player('b'))
    book = movePlayer(book, 'a', { x: 3, z: 4, yaw: 1 })
    expect(listPlayers(book).find((entry) => entry.id === 'a')?.pose.x).toBe(3)
    book = dropPlayer(book, 'b')
    expect(withoutSelf(listPlayers(book), 'a')).toHaveLength(0)
    expect(listPlayers(book)).toHaveLength(1)
  })
})
