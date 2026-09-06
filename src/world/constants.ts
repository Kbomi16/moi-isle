export type Vec2 = {
  x: number
  z: number
}

export type Pose = {
  x: number
  z: number
  yaw: number
}

export type Ellipse = {
  cx: number
  cz: number
  rx: number
  rz: number
}

export type CharacterLook = {
  skin: string
  shirt: string
  hair: string
}

export type Villager = {
  id: string
  name: string
  reply: string
  look: CharacterLook
  waypoints: Vec2[]
}

export const ISLAND_BLOBS: Ellipse[] = [
  { cx: 0, cz: 1, rx: 14.5, rz: 12.5 },
  { cx: -11, cz: 3, rx: 9, rz: 8 },
  { cx: 11, cz: -1, rx: 8, rz: 8.5 },
  { cx: 2, cz: 16, rx: 5.2, rz: 7.2 },
  { cx: -2, cz: -11, rx: 9, rz: 7 },
  { cx: 8, cz: -10, rx: 7, rz: 6.5 },
]

export const ISLAND_HILLS = [
  { cx: -10, cz: 2.5, radius: 7, peak: 1.55 },
  { cx: 8.5, cz: -9, radius: 6, peak: 1.05 },
  { cx: -3, cz: -9, radius: 4.2, peak: 0.65 },
] as const

export const ISLAND_PATH: Vec2[] = [
  { x: 2, z: 16.4 },
  { x: 1.4, z: 10.2 },
  { x: 1.6, z: 4.2 },
  { x: 2.2, z: -1.4 },
  { x: 5.4, z: -3.2 },
]

export const ISLAND_PATH_BRANCH: Vec2[] = [
  { x: 2.2, z: -1.4 },
  { x: -2.5, z: 1.2 },
  { x: -8.2, z: 3.2 },
]

export const VILLAGE_PLAZA = { x: 2.2, z: -1.4, radius: 2.35 } as const

export const WALK_INSET = -1.2
export const SAND_INNER = -2.15
export const SAND_OUTER = 0.45
export const PATH_HALF = 1.15
export const GRASS_BASE_Y = 0.36

export const WALK_SPEED = 1.65
export const DUMMY_SPEED = 0.9

export const NAME_RANGE = 6
export const CHAT_RANGE = 3.2

export const MAX_NICKNAME = 10
export const MAX_CHAT = 40

export const CAMERA_DISTANCE = 8.5
export const CAMERA_HEIGHT = 4.8
export const BUBBLE_MS = 4000
export const DUMMY_REPLY_MS = 800

export const PLAYER_SPAWN = { x: 1.6, z: 6.5 } as const

export const PLAYER_LOOK: CharacterLook = {
  skin: '#f0c48a',
  shirt: '#e4b56a',
  hair: '#6b4530',
}

export const VILLAGERS: Villager[] = [
  {
    id: 'molae',
    name: '모래',
    reply: '부두에서 왔어',
    look: { skin: '#f3d2a0', shirt: '#e8b25a', hair: '#8a5a32' },
    waypoints: [
      { x: 2, z: 14.6 },
      { x: 1.6, z: 4.2 },
      { x: 2.2, z: -1.2 },
    ],
  },
  {
    id: 'pulip',
    name: '풀잎',
    reply: '안녕',
    look: { skin: '#efd4a8', shirt: '#6fa86c', hair: '#3f7a48' },
    waypoints: [
      { x: 5.2, z: -3.4 },
      { x: 3.4, z: -5.6 },
      { x: 0.4, z: -4.2 },
    ],
  },
  {
    id: 'joyak',
    name: '조약',
    reply: '언덕이 좋아',
    look: { skin: '#e8c8b0', shirt: '#7aa0c4', hair: '#4d5e72' },
    waypoints: [
      { x: -8.4, z: 3.4 },
      { x: -4.2, z: 1.6 },
      { x: 1.8, z: -0.8 },
    ],
  },
]

export const HOUSES = [
  { x: 6.4, z: -3.8, yaw: -0.55, scale: 1.12 },
  { x: 3.6, z: -6.6, yaw: 0.35, scale: 1 },
  { x: -1.6, z: -5.1, yaw: 2.5, scale: 0.92 },
] as const

export const FENCES = [
  { x: 0.35, z: 0.25, yaw: 0.15, scale: 1 },
  { x: 4.15, z: -0.35, yaw: 1.15, scale: 0.92 },
  { x: 3.15, z: -3.15, yaw: -0.45, scale: 0.86 },
] as const

export const COLORS = {
  sky: '#9fd6ea',
  water: '#4e9bb3',
  sand: '#e8cc8a',
  grass: '#7db85c',
  path: '#c9a36a',
  foliage: '#3f7a48',
  trunk: '#8a5a3a',
  dock: '#c4a574',
  bench: '#cbb07a',
  player: '#e4b56a',
  dummy: '#6a9cbf',
  ink: '#3d4a3c',
  paper: '#f4efe4',
} as const
