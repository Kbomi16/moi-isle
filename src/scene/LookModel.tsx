import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { Mesh } from 'three'
import type { Group } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { LOOKS, lookUrl } from '../world/looks.ts'

type LookModelProps = {
  url: string
  moving: boolean
}

export function LookModel({ url, moving }: LookModelProps) {
  const { scene, animations } = useGLTF(url)
  const cloned = useMemo(() => clone(scene), [scene])
  const group = useRef<Group>(null)
  const { actions } = useAnimations(animations, group)
  const clip = useRef<string | null>(null)

  useEffect(() => {
    cloned.traverse((node) => {
      if (node instanceof Mesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
  }, [cloned])

  useEffect(() => {
    const name = moving ? 'walk' : 'idle'
    if (clip.current === name) {
      return
    }
    if (clip.current) {
      actions[clip.current]?.fadeOut(0.18)
    }
    actions[name]?.reset().fadeIn(0.18).play()
    clip.current = name
  }, [actions, moving])

  return (
    <group ref={group} scale={1}>
      <primitive object={cloned} />
    </group>
  )
}

for (const look of LOOKS) {
  useGLTF.preload(lookUrl(look.file))
}
