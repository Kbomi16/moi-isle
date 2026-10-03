import { OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { PCFSoftShadowMap } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { COLORS } from '../world/constants.ts'
import type { RoomItem } from '../world/roomLayout.ts'
import type { PlacedStack } from '../world/roomStacks.ts'
import { Room } from './Room.tsx'
import { RoomViewControls } from './RoomViewControls.tsx'

const TARGET: [number, number, number] = [-0.35, 0.55, -0.2]

type RoomCanvasProps = {
  items: RoomItem[]
  stacks: PlacedStack[]
  editMode: boolean
  selectedItemId: string | null
  selectedStackId: string | null
  onSelectItem: (id: string | null) => void
  onSelectStack: (id: string | null) => void
  onMoveItem: (id: string, position: [number, number, number]) => void
  onMoveStack: (id: string, position: [number, number, number]) => void
}

type RoomControlsProps = {
  orbitEnabled: boolean
  controlsRef: RefObject<OrbitControlsImpl | null>
}

function RoomControls({ orbitEnabled, controlsRef }: RoomControlsProps) {
  const camera = useThree((state) => state.camera)

  useLayoutEffect(() => {
    camera.position.set(-0.85, 3.35, 5.15)
    camera.lookAt(...TARGET)
    camera.updateProjectionMatrix()
  }, [camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      enablePan={false}
      enabled={orbitEnabled}
      maxDistance={9}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={3.2}
      minPolarAngle={0.15}
      target={TARGET}
    />
  )
}

/** 내 방 — 드래그로 둘러보고, 휠·버튼으로 거리·각도 조절 */
export function RoomCanvas({
  items,
  stacks,
  editMode,
  selectedItemId,
  selectedStackId,
  onSelectItem,
  onSelectStack,
  onMoveItem,
  onMoveStack,
}: RoomCanvasProps) {
  const [dragging, setDragging] = useState(false)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const orbitEnabled = !dragging

  return (
    <div className="relative h-full w-full cursor-grab touch-none active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ fov: 48, position: [-0.85, 3.35, 5.15], near: 0.1, far: 40 }}
        gl={{ antialias: true, toneMappingExposure: 1.08 }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = PCFSoftShadowMap
        }}
      >
        <color attach="background" args={[COLORS.sky]} />
        <hemisphereLight args={['#fff1d6', '#c4a574', 0.72]} />
        <ambientLight intensity={0.42} />
        <directionalLight
          castShadow
          color="#fff6e4"
          intensity={1.35}
          position={[3.2, 5.4, 2.4]}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={16}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <Room
          editMode={editMode}
          items={items}
          onDragActive={setDragging}
          onMoveItem={onMoveItem}
          onMoveStack={onMoveStack}
          onSelectItem={onSelectItem}
          onSelectStack={onSelectStack}
          selectedItemId={selectedItemId}
          selectedStackId={selectedStackId}
          stacks={stacks}
        />
        <RoomControls controlsRef={controlsRef} orbitEnabled={orbitEnabled} />
      </Canvas>
      <RoomViewControls controlsRef={controlsRef} />
    </div>
  )
}
