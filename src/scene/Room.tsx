import { useGLTF } from '@react-three/drei'
import { IsleModel } from './IsleModel.tsx'
import { ROOM_MODELS } from './roomModels.ts'

const wall = '#f3eadc'
const floor = '#d7b07a'

/** Kenney 가구는 바닥(y=0) 기준이고 원점이 모서리에 있다 */
const SCALE = 1.9

type PropProps = {
  url: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

function Prop({
  url,
  position,
  rotation = [0, 0, 0],
  scale = SCALE,
}: PropProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <IsleModel url={url} />
    </group>
  )
}

/** 앞이 열린 방. 천장은 비워 두고 위에서 전체를 볼 수 있다 */
export function Room() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.2, 5.2]} />
        <meshStandardMaterial color={floor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.28, -2.54]} receiveShadow>
        <boxGeometry args={[6.2, 2.56, 0.12]} />
        <meshStandardMaterial color={wall} roughness={0.94} />
      </mesh>
      <mesh position={[-3.04, 1.28, 0]} receiveShadow>
        <boxGeometry args={[0.12, 2.56, 5.2]} />
        <meshStandardMaterial color={wall} roughness={0.94} />
      </mesh>
      <mesh position={[3.04, 1.28, 0]} receiveShadow>
        <boxGeometry args={[0.12, 2.56, 5.2]} />
        <meshStandardMaterial color={wall} roughness={0.94} />
      </mesh>

      <mesh position={[-0.15, 1.45, -2.47]}>
        <planeGeometry args={[1.45, 1.15]} />
        <meshStandardMaterial color="#9fd6ea" roughness={0.25} />
      </mesh>
      <Prop position={[-0.9, 0.78, -2.46]} scale={1.45} url={ROOM_MODELS.window} />

      <Prop position={[-1.15, 0.02, 0.55]} url={ROOM_MODELS.rug} />

      <Prop position={[-2.7, 0, -0.35]} url={ROOM_MODELS.bed} />
      <group position={[-2.25, 0, 0.45]} scale={SCALE}>
        <IsleModel url={ROOM_MODELS.sideTable} />
        <IsleModel position={[0.06, 0.4, -0.08]} url={ROOM_MODELS.books} />
        <IsleModel position={[0.28, 0.4, -0.1]} url={ROOM_MODELS.plant} />
      </group>
      <Prop position={[-2.55, 0, 1.7]} url={ROOM_MODELS.floorLamp} />

      <Prop position={[0.55, 0, -1.9]} url={ROOM_MODELS.bookcase} />
      <Prop position={[1.7, 0, -1.75]} url={ROOM_MODELS.pottedPlant} />

      <group position={[1.2, 0, 0.05]} rotation={[0, Math.PI, 0]} scale={SCALE}>
        <IsleModel url={ROOM_MODELS.desk} />
        <IsleModel position={[0.16, 0.4, -0.1]} url={ROOM_MODELS.keyboard} />
        <IsleModel position={[0.1, 0.4, -0.26]} url={ROOM_MODELS.screen} />
        <IsleModel position={[0.48, 0.4, -0.16]} url={ROOM_MODELS.tableLamp} />
      </group>
      <Prop position={[1.15, 0, 1.15]} url={ROOM_MODELS.deskChair} />

      <Prop position={[-0.35, 0, 1.45]} rotation={[0, 2.6, 0]} url={ROOM_MODELS.chair} />
    </group>
  )
}

for (const url of Object.values(ROOM_MODELS)) {
  useGLTF.preload(url)
}
