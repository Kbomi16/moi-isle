export const LOOK_BASE = '/models/kenney-mini'

export const LOOKS = [
  {
    id: 'female-a',
    label: '남색',
    file: 'character-female-a.glb',
    preview: 'character-female-a.png',
  },
  {
    id: 'female-b',
    label: '분홍',
    file: 'character-female-b.glb',
    preview: 'character-female-b.png',
  },
  {
    id: 'female-c',
    label: '노랑',
    file: 'character-female-c.glb',
    preview: 'character-female-c.png',
  },
  {
    id: 'female-d',
    label: '민트',
    file: 'character-female-d.glb',
    preview: 'character-female-d.png',
  },
  {
    id: 'female-e',
    label: '하늘',
    file: 'character-female-e.glb',
    preview: 'character-female-e.png',
  },
  {
    id: 'female-f',
    label: '보라',
    file: 'character-female-f.glb',
    preview: 'character-female-f.png',
  },
  {
    id: 'male-a',
    label: '갈색',
    file: 'character-male-a.glb',
    preview: 'character-male-a.png',
  },
  {
    id: 'male-b',
    label: '주황',
    file: 'character-male-b.glb',
    preview: 'character-male-b.png',
  },
  {
    id: 'male-c',
    label: '모자',
    file: 'character-male-c.glb',
    preview: 'character-male-c.png',
  },
  {
    id: 'male-d',
    label: '파랑',
    file: 'character-male-d.glb',
    preview: 'character-male-d.png',
  },
  {
    id: 'male-e',
    label: '빨강',
    file: 'character-male-e.glb',
    preview: 'character-male-e.png',
  },
  {
    id: 'male-f',
    label: '초록',
    file: 'character-male-f.glb',
    preview: 'character-male-f.png',
  },
] as const

export type LookId = (typeof LOOKS)[number]['id']

export const lookUrl = (file: string): string => `${LOOK_BASE}/${file}`

export const lookPreviewUrl = (file: string): string =>
  `${LOOK_BASE}/previews/${file}`

export const lookById = (id: string) =>
  LOOKS.find((look) => look.id === id) ?? LOOKS[0]
