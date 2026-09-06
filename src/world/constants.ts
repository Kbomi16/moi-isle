export type Vec2 = {
  x: number
  z: number
}

export type Pose = {
  x: number
  z: number
  yaw: number
}

export const ISLAND_GRASS_RADIUS = 16
export const ISLAND_WALK_RADIUS = 15.2
export const ISLAND_SAND_RADIUS = 18.2

export const WALK_SPEED = 1.65
export const DUMMY_SPEED = 0.9

export const NAME_RANGE = 6
export const CHAT_RANGE = 3.2

export const MAX_NICKNAME = 10
export const MAX_CHAT = 40

export const GROUND_Y = 0.38
export const CAMERA_DISTANCE = 8.5
export const CAMERA_HEIGHT = 5.2
export const BUBBLE_MS = 4000
export const DUMMY_REPLY_MS = 800

export const PLAYER_SPAWN = { x: 2, z: 6 } as const
export const DUMMY_WAYPOINTS: Vec2[] = [
  { x: 0, z: 13.5 },
  { x: -6, z: 4 },
]

export const DUMMY_REPLY = '안녕'
export const DUMMY_NAME = '방문객'

export const COLORS = {
  sky: '#9fd6ea',
  water: '#4e9bb3',
  sand: '#e8cc8a',
  grass: '#7db85c',
  foliage: '#3f7a48',
  trunk: '#8a5a3a',
  dock: '#c4a574',
  bench: '#cbb07a',
  player: '#e4b56a',
  dummy: '#6a9cbf',
  ink: '#3d4a3c',
  paper: '#f4efe4',
} as const
