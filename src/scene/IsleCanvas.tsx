import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import type { PointerEvent, RefObject } from 'react'
import { COLORS } from '../world/constants.ts'
import type { Pose } from '../world/constants.ts'
import { DummyVisitor } from './DummyVisitor.tsx'
import { Island } from './Island.tsx'
import { IsleCamera } from './IsleCamera.tsx'
import { Landmarks } from './Landmarks.tsx'
import { Player } from './Player.tsx'
import { ProximitySensor } from './ProximitySensor.tsx'
import type { ProximityState } from './ProximitySensor.tsx'

const keyMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'back', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
]

type IsleCanvasProps = {
  playerName: string | null
  playerPose: RefObject<Pose>
  dummyPose: RefObject<Pose>
  cameraYaw: RefObject<number>
  chatFocused: RefObject<boolean>
  showDummyName: boolean
  playerBubble: string | null
  dummyBubble: string | null
  onProximity: (state: ProximityState) => void
}

export function IsleCanvas({
  playerName,
  playerPose,
  dummyPose,
  cameraYaw,
  chatFocused,
  showDummyName,
  playerBubble,
  dummyBubble,
  onProximity,
}: IsleCanvasProps) {
  const dragging = useRef<number | null>(null)
  const entered = playerName !== null

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }
    dragging.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current == null) {
      return
    }
    const yaw = cameraYaw.current
    if (yaw == null) {
      return
    }
    cameraYaw.current = yaw + (event.clientX - dragging.current) * 0.005
    dragging.current = event.clientX
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div
      className="isle-stage"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{ fov: 42, position: [18, 12, 18], near: 0.1, far: 120 }}
        >
          <color attach="background" args={[COLORS.sky]} />
          <fog attach="fog" args={[COLORS.sky, 32, 72]} />
          <hemisphereLight args={['#fff1d6', '#6a9a58', 0.62]} />
          <ambientLight intensity={0.28} />
          <directionalLight
            castShadow
            position={[14, 18, 8]}
            intensity={1.35}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-22}
            shadow-camera-right={22}
            shadow-camera-top={22}
            shadow-camera-bottom={-22}
            shadow-camera-near={1}
            shadow-camera-far={50}
          />
          <Island />
          <Landmarks />
          <IsleCamera
            follow={entered}
            target={playerPose}
            cameraYaw={cameraYaw}
          />
          {playerName ? (
            <Player
              pose={playerPose}
              cameraYaw={cameraYaw}
              chatFocused={chatFocused}
              name={playerName}
              bubble={playerBubble}
            />
          ) : null}
          <DummyVisitor
            pose={dummyPose}
            showName={showDummyName}
            bubble={dummyBubble}
          />
          <ProximitySensor
            enabled={entered}
            player={playerPose}
            dummy={dummyPose}
            onProximity={onProximity}
          />
        </Canvas>
      </KeyboardControls>
    </div>
  )
}
