export const LOOK_BASE = '/models/kenney-mini'

export const LOOKS = [
  {
    id: 'navy',
    label: '남색',
    file: 'character-female-a.glb',
    preview: 'character-female-a.png',
  },
  {
    id: 'purple',
    label: '보라',
    file: 'character-female-f.glb',
    preview: 'character-female-f.png',
  },
  {
    id: 'orange',
    label: '주황',
    file: 'character-male-b.glb',
    preview: 'character-male-b.png',
  },
  {
    id: 'cap',
    label: '모자',
    file: 'character-male-c.glb',
    preview: 'character-male-c.png',
  },
] as const

export type LookId = (typeof LOOKS)[number]['id']

export const lookUrl = (file: string): string => `${LOOK_BASE}/${file}`

export const lookPreviewUrl = (file: string): string =>
  `${LOOK_BASE}/previews/${file}`

export const lookById = (id: string) =>
  LOOKS.find((look) => look.id === id) ?? LOOKS[0]
