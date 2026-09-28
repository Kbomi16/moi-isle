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

// @react-three/drei KeyboardControls 액션 이름 → Player 이동
const keyMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'back', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
]

type IsleCanvasProps = {
  playerName: string | null
  lookUrl: string | null
  playerPose: RefObject<Pose>
  npcPoses: RefObject<Record<string, Pose>>
  cameraYaw: RefObject<number>
  chatFocused: RefObject<boolean>
  namedIds: string[]
  playerBubble: string | null
  npcBubbles: Record<string, string | null>
  onProximity: (state: ProximityState) => void
}

/** R3F Canvas — 드래그 yaw, 키보드 이동, ProximitySensor로 HUD/채팅 대상 연동 */
export function IsleCanvas({
  playerName,
  lookUrl,
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
    // 드래그로 cameraYaw 갱신 → IsleCamera·Player 걷기 방향에 사용
    <div
      className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* WASD/방향키 → Player의 useKeyboardControls */}
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{ fov: 42, position: [20, 14, 20], near: 0.1, far: 160 }}
          gl={{ antialias: true, toneMappingExposure: 1.08 }}
          onCreated={({ gl }) => {
            gl.shadowMap.type = PCFSoftShadowMap
          }}
        >
          {/* 배경·대기 원근 */}
          <color attach="background" args={[COLORS.sky]} />
          <fog attach="fog" args={[COLORS.sky, 34, 78]} />
          {/* 낮 섬 조명 (그림자는 directionalLight) */}
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
          {/* 지형 메시(풀·모래·언덕·경계 클램프는 world/island) */}
          <Island />
          <Suspense fallback={null}>
            {/* Kenney GLB 집·부두·야자 등 정적 오브젝트 */}
            <Landmarks />
          </Suspense>
          {/* 3인칭 추적 카메라 (yaw는 바깥 div 드래그) */}
          <IsleCamera
            follow={entered}
            target={playerPose}
            cameraYaw={cameraYaw}
          />
          {playerName && lookUrl ? (
            // 입장한 플레이어 GLB + WASD + 말풍선 Html
            <Player
              pose={playerPose}
              cameraYaw={cameraYaw}
              chatFocused={chatFocused}
              name={playerName}
              lookUrl={lookUrl}
              bubble={playerBubble}
            />
          ) : null}
          {/* waypoints 순찰 주민 + 근접 시 이름표·NPC 말풍선 */}
          <Villagers
            poses={npcPoses}
            namedIds={namedIds}
            bubbles={npcBubbles}
          />
          {/* 렌더 없음 — 매 프레임 거리 계산 후 App에 namedIds·chatId 전달 */}
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
