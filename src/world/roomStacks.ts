export const STACK_IDS = [
  'react',
  'typescript',
  'javascript',
  'nextjs',
  'node',
  'bun',
  'three',
  'tailwind',
  'figma',
  'postgres',
  'python',
  'java',
] as const

export type StackId = (typeof STACK_IDS)[number]

export type PlacedStack = {
  id: string
  stackId: StackId
  position: [number, number, number]
  rotationY: number
}

export const MAX_ROOM_STACKS = 8
export const STACK_WALL_Z = -2.44

export const STACK_WALL_BOUNDS = {
  xMin: -2.75,
  xMax: 2.75,
  yMin: 1.35,
  yMax: 2.35,
} as const

const DEVICON =
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

/** Devicon / Simple Icons — Html img src */
export const STACK_ICON_URLS: Record<StackId, string> = {
  react: `${DEVICON}/react/react-original.svg`,
  typescript: `${DEVICON}/typescript/typescript-original.svg`,
  javascript: `${DEVICON}/javascript/javascript-original.svg`,
  nextjs: `${DEVICON}/nextjs/nextjs-original.svg`,
  node: `${DEVICON}/nodejs/nodejs-original.svg`,
  bun: 'https://cdn.simpleicons.org/bun/FBF0DF',
  three: `${DEVICON}/threejs/threejs-original.svg`,
  tailwind: `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
  figma: `${DEVICON}/figma/figma-original.svg`,
  postgres: `${DEVICON}/postgresql/postgresql-original.svg`,
  python: `${DEVICON}/python/python-original.svg`,
  java: `${DEVICON}/java/java-original.svg`,
}

const STORAGE_KEY = 'moi-isle:room-stacks'

export const STACK_LABELS: Record<StackId, string> = {
  react: 'React',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  nextjs: 'Next.js',
  node: 'Node',
  bun: 'Bun',
  three: 'Three.js',
  tailwind: 'Tailwind',
  figma: 'Figma',
  postgres: 'Postgres',
  python: 'Python',
  java: 'Java',
}

export const createPlacedStackId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/** 새 스택 기본 위치 — 창문 위·옆 그리드 */
export const defaultStackPosition = (index: number): [number, number, number] => {
  const col = index % 4
  const row = Math.floor(index / 4)
  const x = -1.55 + col * 1.05
  const y = 2.05 - row * 0.42
  return [x, y, STACK_WALL_Z]
}

export const clampStackOnWall = (
  x: number,
  y: number,
): { x: number; y: number } => ({
  x: Math.min(STACK_WALL_BOUNDS.xMax, Math.max(STACK_WALL_BOUNDS.xMin, x)),
  y: Math.min(STACK_WALL_BOUNDS.yMax, Math.max(STACK_WALL_BOUNDS.yMin, y)),
})

const isStackId = (value: unknown): value is StackId =>
  typeof value === 'string' &&
  (STACK_IDS as readonly string[]).includes(value)

const isPlacedStack = (value: unknown): value is PlacedStack => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'stackId' in value &&
    isStackId(value.stackId) &&
    'position' in value &&
    Array.isArray(value.position) &&
    value.position.length === 3 &&
    value.position.every((axis) => typeof axis === 'number') &&
    'rotationY' in value &&
    typeof value.rotationY === 'number'
  )
}

const migrateLegacyStacks = (parsed: unknown): PlacedStack[] => {
  if (!Array.isArray(parsed)) {
    return []
  }
  if (parsed.length > 0 && typeof parsed[0] === 'string') {
    return (parsed as string[])
      .filter(isStackId)
      .slice(0, MAX_ROOM_STACKS)
      .map((stackId, index) => ({
        id: createPlacedStackId(),
        stackId,
        position: defaultStackPosition(index),
        rotationY: 0,
      }))
  }
  return parsed.filter(isPlacedStack).slice(0, MAX_ROOM_STACKS)
}

export const parseRoomStacks = (raw: string): PlacedStack[] => {
  try {
    return migrateLegacyStacks(JSON.parse(raw))
  } catch {
    return []
  }
}

export const readRoomStacks = (): PlacedStack[] => {
  if (typeof localStorage === 'undefined') {
    return []
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  return parseRoomStacks(raw)
}

export const writeRoomStacks = (stacks: PlacedStack[]): void => {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(stacks.slice(0, MAX_ROOM_STACKS)),
  )
}

export const togglePlacedStack = (
  stacks: PlacedStack[],
  stackId: StackId,
): PlacedStack[] => {
  const existing = stacks.find((entry) => entry.stackId === stackId)
  if (existing) {
    return stacks.filter((entry) => entry.id !== existing.id)
  }
  if (stacks.length >= MAX_ROOM_STACKS) {
    return stacks
  }

  return [
    ...stacks,
    {
      id: createPlacedStackId(),
      stackId,
      position: defaultStackPosition(stacks.length),
      rotationY: 0,
    },
  ]
}

export const updatePlacedStack = (
  stacks: PlacedStack[],
  id: string,
  patch: Partial<Pick<PlacedStack, 'position' | 'rotationY'>>,
): PlacedStack[] =>
  stacks.map((entry) => {
    if (entry.id !== id) {
      return entry
    }

    let position = entry.position
    if (patch.position) {
      const clamped = clampStackOnWall(patch.position[0], patch.position[1])
      position = [clamped.x, clamped.y, STACK_WALL_Z]
    }

    return {
      ...entry,
      ...(patch.rotationY !== undefined ? { rotationY: patch.rotationY } : {}),
      position,
    }
  })

export const rotatePlacedStack = (
  stacks: PlacedStack[],
  id: string,
  deltaRadians: number,
): PlacedStack[] => {
  const current = stacks.find((entry) => entry.id === id)
  if (!current) {
    return stacks
  }
  return updatePlacedStack(stacks, id, {
    rotationY: current.rotationY + deltaRadians,
  })
}

export const removePlacedStack = (
  stacks: PlacedStack[],
  id: string,
): PlacedStack[] => stacks.filter((entry) => entry.id !== id)
