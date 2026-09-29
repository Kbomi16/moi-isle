import { OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useLayoutEffect } from 'react'
import { PCFSoftShadowMap } from 'three'
import { COLORS } from '../world/constants.ts'
import { Room } from './Room.tsx'

const TARGET: [number, number, number] = [-0.35, 0.55, -0.2]

function RoomControls() {
  const camera = useThree((state) => state.camera)

  useLayoutEffect(() => {
    camera.position.set(-0.85, 3.35, 5.15)
    camera.lookAt(...TARGET)
    camera.updateProjectionMatrix()
  }, [camera])

  return (
    <OrbitControls
      enableDamping
      enablePan={false}
      maxDistance={9}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={3.2}
      minPolarAngle={0.15}
      target={TARGET}
    />
  )
}

/** 내 방 — 드래그로 둘러보고, 휠로 방 전체가 보이게 거리를 조절한다 */
export function RoomCanvas() {
  return (
    <div className="h-full w-full cursor-grab touch-none active:cursor-grabbing">
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
        <Room />
        <RoomControls />
      </Canvas>
    </div>
  )
}
