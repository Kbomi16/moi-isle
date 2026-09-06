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
  { cx: 0, cz: 0.4, rx: 12.2, rz: 10.8 },
  { cx: -7.2, cz: 1.4, rx: 6.1, rz: 5.4 },
  { cx: 0, cz: 12.2, rx: 3.05, rz: 4.6 },
]

export const ISLAND_HILLS = [
  { cx: -7.4, cz: 1.6, radius: 5.2, peak: 1.15 },
  { cx: 5.2, cz: -3.8, radius: 3.4, peak: 0.28 },
] as const

export const ISLAND_PATH: Vec2[] = [
  { x: 0, z: 12.4 },
  { x: 0.2, z: 7.2 },
  { x: 0.4, z: 2.4 },
  { x: 0.4, z: -1.2 },
]

export const ISLAND_PATH_BRANCH: Vec2[] = [
  { x: 0.4, z: -1.2 },
  { x: 3.4, z: -2.2 },
]

export const VILLAGE_PLAZA = { x: 0.4, z: -1.2, radius: 2.55 } as const

export const WALK_INSET = -1.05
export const SAND_INNER = -1.85
export const SAND_OUTER = 0.35
export const BEACH_WIDTH = 2.35
export const PATH_HALF = 1.05
export const WATER_Y = -1.2
export const CLIFF_BOTTOM_Y = -1.7
export const SAND_SHELF_Y = 0.62
export const GRASS_BASE_Y = 1.35

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

export const PLAYER_SPAWN = { x: 0.4, z: 5.2 } as const

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
      { x: 0.2, z: 11.4 },
      { x: 0.4, z: 4.4 },
      { x: 0.4, z: -1.1 },
    ],
  },
  {
    id: 'pulip',
    name: '풀잎',
    reply: '안녕',
    look: { skin: '#efd4a8', shirt: '#6fa86c', hair: '#3f7a48' },
    waypoints: [
      { x: 3.2, z: -2.4 },
      { x: 1.2, z: -4.2 },
      { x: -1.4, z: -2.6 },
    ],
  },
  {
    id: 'joyak',
    name: '조약',
    reply: '언덕이 좋아',
    look: { skin: '#e8c8b0', shirt: '#7aa0c4', hair: '#4d5e72' },
    waypoints: [
      { x: -6.6, z: 2.2 },
      { x: -3.2, z: 0.4 },
      { x: 0.2, z: -0.8 },
    ],
  },
]

export const HOUSES = [
  {
    x: 4.5,
    z: -2.6,
    yaw: -0.9,
    scale: 1,
    wall: '#f6d2b0',
    roof: '#e07a5f',
    door: '#8b5340',
  },
  {
    x: -4.1,
    z: -2.1,
    yaw: 0.95,
    scale: 0.92,
    wall: '#dcecc8',
    roof: '#5c8f72',
    door: '#4a6b4a',
  },
  {
    x: 0.9,
    z: -5.4,
    yaw: 0.12,
    scale: 0.86,
    wall: '#f4ead4',
    roof: '#d4a373',
    door: '#7a4e32',
  },
] as const

export const COLORS = {
  sky: '#9fd6ea',
  water: '#4e9bb3',
  sand: '#e8cc8a',
  cliff: '#c4a06a',
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
