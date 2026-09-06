import { useGLTF } from '@react-three/drei'
import { GROUND_Y } from '../world/constants.ts'
import { IsleModel } from './IsleModel.tsx'
import { MODELS } from './models.ts'

function Palms() {
  return (
    <group>
      <IsleModel position={[-6.2, GROUND_Y, 3.9]} scale={1.05} url={MODELS.palm} />
      <IsleModel
        position={[-8.5, GROUND_Y, 5.4]}
        rotation={[0, 0.7, 0]}
        scale={0.82}
        url={MODELS.palmSmall}
      />
      <IsleModel
        position={[-6.4, GROUND_Y, 4.6]}
        rotation={[0, 0.4, 0]}
        scale={0.9}
        url={MODELS.patchGrass}
      />
    </group>
  )
}

function Dock() {
  return (
    <group>
      <IsleModel
        position={[0, -0.28, 15.4]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1.15}
        url={MODELS.dock}
      />
      <IsleModel
        position={[0, -0.28, 18.1]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1.15}
        url={MODELS.dock}
      />
    </group>
  )
}

function Shore() {
  return (
    <group>
      <IsleModel position={[0.4, 0.16, 14.2]} rotation={[0, 0.2, 0]} url={MODELS.patchSand} />
      <IsleModel
        position={[11.5, 0.14, 9.4]}
        rotation={[0, 1.1, 0]}
        scale={0.72}
        url={MODELS.patchSand}
      />
      <IsleModel
        position={[-10.8, 0.14, 11.2]}
        rotation={[0, -0.6, 0]}
        scale={0.68}
        url={MODELS.patchSand}
      />
      <IsleModel position={[12.2, -0.02, 8.6]} rotation={[0, 0.4, 0]} scale={0.36} url={MODELS.rock} />
      <IsleModel
        position={[-13.4, -0.04, 6.2]}
        rotation={[0, 2.1, 0]}
        scale={0.28}
        url={MODELS.rock}
      />
      <IsleModel position={[5.8, GROUND_Y, -11.6]} url={MODELS.grassPlant} />
      <IsleModel position={[-11.2, GROUND_Y, -4.4]} rotation={[0, 1.2, 0]} url={MODELS.grassPlant} />
      <IsleModel position={[9.6, GROUND_Y, 10.4]} rotation={[0, -0.5, 0]} url={MODELS.grassPlant} />
    </group>
  )
}

export function Landmarks() {
  return (
    <group>
      <Palms />
      <Dock />
      <Shore />
    </group>
  )
}

useGLTF.preload(MODELS.palm)
useGLTF.preload(MODELS.palmSmall)
useGLTF.preload(MODELS.dock)
useGLTF.preload(MODELS.patchGrass)
useGLTF.preload(MODELS.patchSand)
useGLTF.preload(MODELS.rock)
useGLTF.preload(MODELS.grassPlant)
