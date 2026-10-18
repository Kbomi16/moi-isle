import { describe, expect, it } from 'bun:test'
import {
  parseInitialize,
  parseMyRoomChange,
  parseNewText,
  parsePose,
  withoutSelf,
} from './realtime.ts'
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

describe('parseMyRoomChange', () => {
  it('가구와 스택만 받고 좌표는 방 안으로 당긴다', () => {
    const parsed = parseMyRoomChange({
      kind: 'layout',
      items: [
        {
          id: 'bed-1',
          model: 'bed',
          position: [99, 0, 0],
          rotationY: 0,
        },
      ],
      stacks: [
        {
          id: 'stack-1',
          stackId: 'react',
          position: [0, 1.8, 0],
          rotationY: 0,
        },
      ],
    })
    expect(parsed?.kind).toBe('layout')
    if (parsed?.kind !== 'layout') {
      return
    }
    expect(parsed.items[0]?.position[0]).toBeLessThan(3)
    expect(parsed.stacks[0]?.position[2]).toBeCloseTo(-2.44)
  })

  it('방명록 본문이 비면 버린다', () => {
    expect(
      parseMyRoomChange({ kind: 'guestbook', roomId: 'owner', text: '  ' }),
    ).toBeNull()
    expect(
      parseMyRoomChange({
        kind: 'guestbook',
        roomId: 'owner',
        text: '  잘 보고 가요  ',
      }),
    ).toEqual({
      kind: 'guestbook',
      roomId: 'owner',
      text: '잘 보고 가요',
    })
  })

  it('처음 심을 방명록에서 깨진 항목은 뺀다', () => {
    const parsed = parseMyRoomChange({
      kind: 'guestbookSeed',
      entries: [
        { id: 'ok', author: '보미', text: '안녕', at: 1 },
        { id: 'bad' },
      ],
    })
    expect(parsed).toEqual({
      kind: 'guestbookSeed',
      entries: [{ id: 'ok', author: '보미', text: '안녕', at: 1 }],
    })
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
