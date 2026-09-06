import { Clone, useGLTF } from '@react-three/drei'
import type { ComponentProps } from 'react'

type IsleModelProps = {
  url: string
} & Omit<ComponentProps<typeof Clone>, 'object'>

export function IsleModel({ url, ...props }: IsleModelProps) {
  const { scene } = useGLTF(url)

  return <Clone object={scene} castShadow receiveShadow {...props} />
}
