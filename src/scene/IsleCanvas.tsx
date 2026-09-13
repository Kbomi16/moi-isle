import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import type { PointerEvent, RefObject } from 'react'
import { PCFSoftShadowMap } from 'three'
import { COLORS } from '../world/constants.ts'
import type { Pose } from '../world/constants.ts'
import { Island } from './Island.tsx'
import { IsleCamera } from './IsleCamera.tsx'
import { Landmarks } from './Landmarks.tsx'
import { Player } from './Player.tsx'
import { ProximitySensor } from './ProximitySensor.tsx'
import type { ProximityState } from './ProximitySensor.tsx'
import { Villagers } from './Villagers.tsx'

const keyMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'back', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
]

type IsleCanvasProps = {
  playerName: string | null
  playerPose: RefObject<Pose>
  npcPoses: RefObject<Record<string, Pose>>
  cameraYaw: RefObject<number>
  chatFocused: RefObject<boolean>
  namedIds: string[]
  playerBubble: string | null
  npcBubbles: Record<string, string | null>
  onProximity: (state: ProximityState) => void
}

export function IsleCanvas({
  playerName,
  playerPose,
  npcPoses,
  cameraYaw,
  chatFocused,
  namedIds,
  playerBubble,
  npcBubbles,
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
          camera={{ fov: 42, position: [20, 14, 20], near: 0.1, far: 160 }}
          gl={{ antialias: true, toneMappingExposure: 1.08 }}
          onCreated={({ gl }) => {
            gl.shadowMap.type = PCFSoftShadowMap
          }}
        >
          <color attach="background" args={[COLORS.sky]} />
          <fog attach="fog" args={[COLORS.sky, 34, 78]} />
          <hemisphereLight args={['#ffe7c4', '#6b8f4a', 0.72]} />
          <ambientLight intensity={0.32} />
          <directionalLight
            castShadow
            color="#fff4dc"
            position={[14, 18, 8]}
            intensity={1.55}
            shadow-bias={-0.0004}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-32}
            shadow-camera-right={32}
            shadow-camera-top={32}
            shadow-camera-bottom={-32}
            shadow-camera-near={1}
            shadow-camera-far={70}
          />
          <Island />
          <Suspense fallback={null}>
            <Landmarks />
          </Suspense>
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
          <Villagers
            poses={npcPoses}
            namedIds={namedIds}
            bubbles={npcBubbles}
          />
          <ProximitySensor
            enabled={entered}
            player={playerPose}
            npcs={npcPoses}
            onProximity={onProximity}
          />
        </Canvas>
      </KeyboardControls>
    </div>
  )
}
