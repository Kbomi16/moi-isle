import { MAX_CHAT } from './constants.ts'
import type { Pose } from './constants.ts'
import {
  normalizeGuestbookText,
  sanitizeGuestbook,
  type GuestbookEntry,
} from './guestbook.ts'
import { LOOKS } from './looks.ts'
import type { LookId } from './looks.ts'
import { normalizeNickname } from './nickname.ts'
import { normalizeChat } from './chat.ts'
import { sanitizeRoomItems, type RoomItem } from './roomLayout.ts'
import { sanitizeRoomStacks, type PlacedStack } from './roomStacks.ts'
import { normalizeRoleId } from './roles.ts'
import type { RoleId } from './roles.ts'

/** 서버가 들고 있는 접속자 한 명 */
export type IslePlayer = {
  id: string
  nickname: string
  lookId: LookId
  roleId: RoleId
  pose: Pose
}

export type ExitNotice = {
  id: string
  nickname: string
}

export type TextEvent = {
  id: string
  nickname: string
  text: string
  at: number
}

export type RoomSnapshot = {
  id: string
  items: RoomItem[]
  stacks: PlacedStack[]
  guestbook: GuestbookEntry[]
}

export type MyRoomChange =
  | { kind: 'layout'; items: RoomItem[]; stacks: PlacedStack[] }
  | { kind: 'guestbookSeed'; entries: GuestbookEntry[] }
  | { kind: 'guestbook'; roomId: string; text: string }

export type InitializeAck = {
  selfId: string
  players: IslePlayer[]
  rooms: RoomSnapshot[]
}

const LOOK_IDS = new Set<string>(LOOKS.map((look) => look.id))

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

/** 섬 밖 좌표·NaN이 들어오면 버린다 */
export const parsePose = (value: unknown): Pose | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }
  if (
    !('x' in value) ||
    !('z' in value) ||
    !('yaw' in value) ||
    !isFiniteNumber(value.x) ||
    !isFiniteNumber(value.z) ||
    !isFiniteNumber(value.yaw)
  ) {
    return null
  }
  if (Math.abs(value.x) > 40 || Math.abs(value.z) > 40) {
    return null
  }
  return { x: value.x, z: value.z, yaw: value.yaw }
}

export const parseInitialize = (
  value: unknown,
): Omit<IslePlayer, 'id'> | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }
  if (!('nickname' in value) || typeof value.nickname !== 'string') {
    return null
  }
  if (!('lookId' in value) || typeof value.lookId !== 'string') {
    return null
  }
  if (!('roleId' in value) || typeof value.roleId !== 'string') {
    return null
  }
  if (!('pose' in value)) {
    return null
  }

  const nickname = normalizeNickname(value.nickname)
  const pose = parsePose(value.pose)
  if (!nickname || !pose || !LOOK_IDS.has(value.lookId)) {
    return null
  }

  return {
    nickname,
    lookId: value.lookId as LookId,
    roleId: normalizeRoleId(value.roleId),
    pose,
  }
}

export const parseNewText = (value: unknown): string | null => {
  if (typeof value !== 'object' || value === null || !('text' in value)) {
    return null
  }
  if (typeof value.text !== 'string' || value.text.length > MAX_CHAT * 4) {
    return null
  }
  return normalizeChat(value.text)
}

const isRoomId = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length > 0 &&
  value.length <= 64 &&
  !value.includes('/')

export const parseMyRoomChange = (value: unknown): MyRoomChange | null => {
  if (typeof value !== 'object' || value === null || !('kind' in value)) {
    return null
  }

  if (value.kind === 'layout') {
    if (!('items' in value) || !('stacks' in value)) {
      return null
    }
    const items = sanitizeRoomItems(value.items)
    const stacks = sanitizeRoomStacks(value.stacks)
    if (!items || !stacks) {
      return null
    }
    return { kind: 'layout', items, stacks }
  }

  if (value.kind === 'guestbookSeed') {
    if (!('entries' in value)) {
      return null
    }
    const entries = sanitizeGuestbook(value.entries)
    if (!entries) {
      return null
    }
    return { kind: 'guestbookSeed', entries }
  }

  if (value.kind === 'guestbook') {
    if (!('roomId' in value) || !('text' in value) || typeof value.text !== 'string') {
      return null
    }
    if (!isRoomId(value.roomId) || value.text.length > MAX_CHAT * 8) {
      return null
    }
    const text = normalizeGuestbookText(value.text)
    if (!text) {
      return null
    }
    return { kind: 'guestbook', roomId: value.roomId, text }
  }

  return null
}

export const withoutSelf = (players: IslePlayer[], selfId: string): IslePlayer[] =>
  players.filter((player) => player.id !== selfId)
