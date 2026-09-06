import { useGLTF } from '@react-three/drei'
import { FENCES, HOUSES } from '../world/constants.ts'
import { groundHeight } from '../world/island.ts'
import { IsleModel } from './IsleModel.tsx'
import { MODELS } from './models.ts'

function Palms() {
  return (
    <group>
      <IsleModel
        position={[-10.2, groundHeight(-10.2, 3.4), 3.4]}
        scale={1.05}
        url={MODELS.palm}
      />
      <IsleModel
        position={[-12.4, groundHeight(-12.4, 5.1), 5.1]}
        rotation={[0, 0.7, 0]}
        scale={0.82}
        url={MODELS.palmSmall}
      />
      <IsleModel
        position={[-9.6, groundHeight(-9.6, 4.1), 4.1]}
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
        position={[2, -0.22, 16.2]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1.15}
        url={MODELS.dock}
      />
      <IsleModel
        position={[2, -0.22, 18.9]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1.15}
        url={MODELS.dock}
      />
    </group>
  )
}

function Village() {
  return (
    <group>
      {HOUSES.map((house) => (
        <group
          key={`${house.x}-${house.z}`}
          position={[house.x, groundHeight(house.x, house.z) - 0.02, house.z]}
          rotation={[0, house.yaw, 0]}
          scale={house.scale}
        >
          <IsleModel url={MODELS.house} />
          <IsleModel url={MODELS.houseRoof} />
        </group>
      ))}
      {FENCES.map((fence) => (
        <IsleModel
          key={`${fence.x}-${fence.z}`}
          position={[fence.x, groundHeight(fence.x, fence.z) - 0.02, fence.z]}
          rotation={[0, fence.yaw, 0]}
          scale={fence.scale}
          url={MODELS.fence}
        />
      ))}
    </group>
  )
}

function Shore() {
  return (
    <group>
      <IsleModel
        position={[2.1, groundHeight(2.1, 14.4) - 0.02, 14.4]}
        rotation={[0, 0.2, 0]}
        url={MODELS.patchSand}
      />
      <IsleModel
        position={[14.2, groundHeight(14.2, 2.4) - 0.04, 2.4]}
        rotation={[0, 1.1, 0]}
        scale={0.72}
        url={MODELS.patchSand}
      />
      <IsleModel
        position={[-16.2, groundHeight(-16.2, 4.6) - 0.04, 4.6]}
        rotation={[0, -0.6, 0]}
        scale={0.68}
        url={MODELS.patchSand}
      />
      <IsleModel
        position={[13.6, groundHeight(13.6, -4.2) - 0.06, -4.2]}
        rotation={[0, 0.4, 0]}
        scale={0.36}
        url={MODELS.rock}
      />
      <IsleModel
        position={[-14.8, groundHeight(-14.8, -2.2) - 0.06, -2.2]}
        rotation={[0, 2.1, 0]}
        scale={0.28}
        url={MODELS.rock}
      />
      <IsleModel
        position={[9.2, groundHeight(9.2, 6.4), 6.4]}
        rotation={[0, -0.5, 0]}
        url={MODELS.grassPlant}
      />
      <IsleModel
        position={[-6.4, groundHeight(-6.4, -12.2), -12.2]}
        rotation={[0, 1.2, 0]}
        url={MODELS.grassPlant}
      />
      <IsleModel
        position={[10.6, groundHeight(10.6, -12.4), -12.4]}
        url={MODELS.grassPlant}
      />
    </group>
  )
}

export function Landmarks() {
  return (
    <group>
      <Palms />
      <Dock />
      <Village />
      <Shore />
    </group>
  )
}

useGLTF.preload(MODELS.palm)
useGLTF.preload(MODELS.palmSmall)
useGLTF.preload(MODELS.dock)
useGLTF.preload(MODELS.house)
useGLTF.preload(MODELS.houseRoof)
useGLTF.preload(MODELS.fence)
useGLTF.preload(MODELS.patchGrass)
useGLTF.preload(MODELS.patchSand)
useGLTF.preload(MODELS.rock)
useGLTF.preload(MODELS.grassPlant)
