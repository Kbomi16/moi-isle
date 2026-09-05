import { COLORS, GROUND_Y } from '../world/constants.ts'

function Tree() {
  return (
    <group position={[-6, GROUND_Y, 4]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.26, 1.4, 8]} />
        <meshStandardMaterial color={COLORS.trunk} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[1.15, 12, 10]} />
        <meshStandardMaterial color={COLORS.foliage} roughness={0.78} />
      </mesh>
    </group>
  )
}

function Dock() {
  return (
    <group position={[0, 0.02, 16.4]}>
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.12, 4.6]} />
        <meshStandardMaterial color={COLORS.dock} roughness={0.84} />
      </mesh>
      <mesh position={[-0.9, -0.4, 1.8]} castShadow>
        <boxGeometry args={[0.16, 1.1, 0.16]} />
        <meshStandardMaterial color={COLORS.trunk} />
      </mesh>
      <mesh position={[0.9, -0.4, 1.8]} castShadow>
        <boxGeometry args={[0.16, 1.1, 0.16]} />
        <meshStandardMaterial color={COLORS.trunk} />
      </mesh>
    </group>
  )
}

function Bench() {
  return (
    <group position={[4.6, GROUND_Y, -2.2]}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.42]} />
        <meshStandardMaterial color={COLORS.bench} />
      </mesh>
      <mesh position={[-0.55, 0.14, 0]} castShadow>
        <boxGeometry args={[0.08, 0.28, 0.38]} />
        <meshStandardMaterial color={COLORS.trunk} />
      </mesh>
      <mesh position={[0.55, 0.14, 0]} castShadow>
        <boxGeometry args={[0.08, 0.28, 0.38]} />
        <meshStandardMaterial color={COLORS.trunk} />
      </mesh>
    </group>
  )
}

export function Landmarks() {
  return (
    <group>
      <Tree />
      <Dock />
      <Bench />
    </group>
  )
}
