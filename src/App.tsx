import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Island() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <circleGeometry args={[6, 48]} />
      <meshStandardMaterial color="#9fd4a8" />
    </mesh>
  )
}

function Marker() {
  return (
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[0.6, 1, 0.6]} />
      <meshStandardMaterial color="#f4d6a0" />
    </mesh>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0 }}>
      <Canvas shadows camera={{ position: [6, 5, 6], fov: 45 }}>
        <color attach="background" args={['#cfe8ff']} />
        <ambientLight intensity={0.7} />
        <directionalLight castShadow position={[5, 8, 3]} intensity={1.1} />
        <Island />
        <Marker />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
}
