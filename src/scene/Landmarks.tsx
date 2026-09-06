import { useGLTF } from '@react-three/drei'
import { HOUSES } from '../world/constants.ts'
import { groundHeight } from '../world/island.ts'
import { Cottage } from './Cottage.tsx'
import { IsleModel } from './IsleModel.tsx'
import { MODELS } from './models.ts'

function Palms() {
  return (
    <group>
      <IsleModel
        position={[-7.2, groundHeight(-7.2, 2.2), 2.2]}
        scale={1.05}
        url={MODELS.palm}
      />
      <IsleModel
        position={[-8.8, groundHeight(-8.8, 3.6), 3.6]}
        rotation={[0, 0.7, 0]}
        scale={0.82}
        url={MODELS.palmSmall}
      />
      <IsleModel
        position={[-7.4, groundHeight(-7.4, 2.8), 2.8]}
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
        position={[0, groundHeight(0, 13.4) - 0.12, 13.4]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1.05}
        url={MODELS.dock}
      />
      <IsleModel
        position={[0, groundHeight(0, 15.8) - 0.06, 15.8]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1.05}
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
          position={[house.x, groundHeight(house.x, house.z), house.z]}
          rotation={[0, house.yaw, 0]}
          scale={house.scale}
        >
          <Cottage door={house.door} roof={house.roof} wall={house.wall} />
        </group>
      ))}
    </group>
  )
}

function Shore() {
  return (
    <group>
      <IsleModel
        position={[0.3, groundHeight(0.3, 11.2) - 0.04, 11.2]}
        rotation={[0, 0.2, 0]}
        scale={0.72}
        url={MODELS.patchSand}
      />
      <IsleModel
        position={[10.2, groundHeight(10.2, 1.2) - 0.06, 1.2]}
        rotation={[0, 1.1, 0]}
        scale={0.28}
        url={MODELS.rock}
      />
      <IsleModel
        position={[-10.4, groundHeight(-10.4, 0.6) - 0.06, 0.6]}
        rotation={[0, 2.1, 0]}
        scale={0.24}
        url={MODELS.rock}
      />
      <IsleModel
        position={[7.4, groundHeight(7.4, 4.2), 4.2]}
        rotation={[0, -0.5, 0]}
        url={MODELS.grassPlant}
      />
      <IsleModel
        position={[-3.2, groundHeight(-3.2, -7.2), -7.2]}
        rotation={[0, 1.2, 0]}
        url={MODELS.grassPlant}
      />
      <IsleModel
        position={[5.8, groundHeight(5.8, -6.4), -6.4]}
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
useGLTF.preload(MODELS.patchGrass)
useGLTF.preload(MODELS.patchSand)
useGLTF.preload(MODELS.rock)
useGLTF.preload(MODELS.grassPlant)
