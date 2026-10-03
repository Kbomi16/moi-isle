export const ROOM_MODEL_IDS = [
  'bed',
  'bookcase',
  'books',
  'chair',
  'deskChair',
  'keyboard',
  'screen',
  'desk',
  'floorLamp',
  'tableLamp',
  'plant',
  'pottedPlant',
  'rug',
  'sideTable',
  'window',
] as const

export type RoomModelId = (typeof ROOM_MODEL_IDS)[number]

export type RoomAttachment = {
  model: RoomModelId
  position: [number, number, number]
}

export type RoomItem = {
  id: string
  model: RoomModelId
  position: [number, number, number]
  rotationY: number
  scale?: number
  attachments?: RoomAttachment[]
}

export const ROOM_BOUNDS = {
  xMin: -2.85,
  xMax: 2.85,
  zMin: -2.35,
  zMax: 2.35,
} as const

export const DEFAULT_ROOM_SCALE = 1.9

const STORAGE_KEY = 'moi-isle:room-layout'

export const ROOM_MODEL_LABELS: Record<RoomModelId, string> = {
  bed: '침대',
  bookcase: '책장',
  books: '책',
  chair: '의자',
  deskChair: '책상 의자',
  keyboard: '키보드',
  screen: '모니터',
  desk: '책상',
  floorLamp: '스탠드',
  tableLamp: '탁상등',
  plant: '작은 화분',
  pottedPlant: '화분',
  rug: '러그',
  sideTable: '협탁',
  window: '창문',
}

/** 꾸미기 패널에서 새로 놓을 수 있는 가구 (작은 소품은 attachments로만) */
export const ADDABLE_ROOM_MODELS: RoomModelId[] = [
  'bed',
  'bookcase',
  'chair',
  'deskChair',
  'desk',
  'floorLamp',
  'pottedPlant',
  'rug',
  'sideTable',
]

export const DEFAULT_ROOM_ITEMS: RoomItem[] = [
  {
    id: 'default-window',
    model: 'window',
    position: [-0.9, 0.78, -2.46],
    rotationY: 0,
    scale: 1.45,
  },
  {
    id: 'default-rug',
    model: 'rug',
    position: [-1.15, 0.02, 0.55],
    rotationY: 0,
  },
  {
    id: 'default-bed',
    model: 'bed',
    position: [-2.7, 0, -0.35],
    rotationY: 0,
  },
  {
    id: 'default-side-table',
    model: 'sideTable',
    position: [-2.25, 0, 0.45],
    rotationY: 0,
    attachments: [
      { model: 'books', position: [0.06, 0.4, -0.08] },
      { model: 'plant', position: [0.28, 0.4, -0.1] },
    ],
  },
  {
    id: 'default-floor-lamp',
    model: 'floorLamp',
    position: [-2.55, 0, 1.7],
    rotationY: 0,
  },
  {
    id: 'default-bookcase',
    model: 'bookcase',
    position: [0.55, 0, -1.9],
    rotationY: 0,
  },
  {
    id: 'default-potted',
    model: 'pottedPlant',
    position: [1.7, 0, -1.75],
    rotationY: 0,
  },
  {
    id: 'default-desk',
    model: 'desk',
    position: [1.2, 0, 0.05],
    rotationY: Math.PI,
    attachments: [
      { model: 'keyboard', position: [0.16, 0.4, -0.1] },
      { model: 'screen', position: [0.1, 0.4, -0.26] },
      { model: 'tableLamp', position: [0.48, 0.4, -0.16] },
    ],
  },
  {
    id: 'default-desk-chair',
    model: 'deskChair',
    position: [1.15, 0, 1.15],
    rotationY: 0,
  },
  {
    id: 'default-chair',
    model: 'chair',
    position: [-0.35, 0, 1.45],
    rotationY: 2.6,
  },
]

export const createRoomItemId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export const clampRoomPosition = (
  x: number,
  z: number,
): { x: number; z: number } => ({
  x: Math.min(ROOM_BOUNDS.xMax, Math.max(ROOM_BOUNDS.xMin, x)),
  z: Math.min(ROOM_BOUNDS.zMax, Math.max(ROOM_BOUNDS.zMin, z)),
})

const isModelId = (value: unknown): value is RoomModelId =>
  typeof value === 'string' &&
  (ROOM_MODEL_IDS as readonly string[]).includes(value)

const isAttachment = (value: unknown): value is RoomAttachment => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  if (!('model' in value) || !('position' in value)) {
    return false
  }
  const position = value.position
  return (
    isModelId(value.model) &&
    Array.isArray(position) &&
    position.length === 3 &&
    position.every((axis) => typeof axis === 'number')
  )
}

const isRoomItem = (value: unknown): value is RoomItem => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  if (
    !('id' in value) ||
    typeof value.id !== 'string' ||
    !('model' in value) ||
    !isModelId(value.model) ||
    !('position' in value) ||
    !Array.isArray(value.position) ||
    value.position.length !== 3 ||
    !value.position.every((axis) => typeof axis === 'number') ||
    !('rotationY' in value) ||
    typeof value.rotationY !== 'number'
  ) {
    return false
  }

  if ('scale' in value && value.scale !== undefined && typeof value.scale !== 'number') {
    return false
  }

  if ('attachments' in value && value.attachments !== undefined) {
    if (!Array.isArray(value.attachments) || !value.attachments.every(isAttachment)) {
      return false
    }
  }

  return true
}

export const parseRoomLayout = (raw: string): RoomItem[] => {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isRoomItem)
  } catch {
    return []
  }
}

export const readRoomLayout = (): RoomItem[] => {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_ROOM_ITEMS
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return DEFAULT_ROOM_ITEMS
  }

  const items = parseRoomLayout(raw)
  return items.length > 0 ? items : DEFAULT_ROOM_ITEMS
}

export const writeRoomLayout = (items: RoomItem[]): void => {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const addRoomItem = (
  items: RoomItem[],
  model: RoomModelId,
): RoomItem[] => {
  if (items.some((item) => item.model === model)) {
    return items
  }

  const center = clampRoomPosition(0, 0)
  const y = model === 'window' ? 0.78 : model === 'rug' ? 0.02 : 0
  const scale = model === 'window' ? 1.45 : undefined

  return [
    ...items,
    {
      id: createRoomItemId(),
      model,
      position: [center.x, y, center.z],
      rotationY: 0,
      ...(scale !== undefined ? { scale } : {}),
    },
  ]
}

export const updateRoomItem = (
  items: RoomItem[],
  id: string,
  patch: Partial<Pick<RoomItem, 'position' | 'rotationY'>>,
): RoomItem[] =>
  items.map((item) => {
    if (item.id !== id) {
      return item
    }

    let position = item.position
    if (patch.position) {
      const clamped = clampRoomPosition(patch.position[0], patch.position[2])
      position = [clamped.x, patch.position[1], clamped.z]
    }

    return {
      ...item,
      ...(patch.rotationY !== undefined ? { rotationY: patch.rotationY } : {}),
      position,
    }
  })

export const removeRoomItem = (items: RoomItem[], id: string): RoomItem[] =>
  items.filter((item) => item.id !== id)

export const rotateRoomItem = (
  items: RoomItem[],
  id: string,
  deltaRadians: number,
): RoomItem[] =>
  updateRoomItem(items, id, {
    rotationY:
      (items.find((entry) => entry.id === id)?.rotationY ?? 0) + deltaRadians,
  })
