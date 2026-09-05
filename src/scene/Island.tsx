import {
  COLORS,
  ISLAND_GRASS_RADIUS,
  ISLAND_SAND_RADIUS,
} from '../world/constants.ts'

export function Island() {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.42, 0]}
        receiveShadow
      >
        <circleGeometry args={[48, 64]} />
        <meshStandardMaterial color={COLORS.water} roughness={0.28} />
      </mesh>
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <cylinderGeometry args={[ISLAND_SAND_RADIUS, ISLAND_SAND_RADIUS + 0.4, 0.5, 64]} />
        <meshStandardMaterial color={COLORS.sand} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.13, 0]} receiveShadow>
        <cylinderGeometry args={[ISLAND_GRASS_RADIUS, ISLAND_GRASS_RADIUS, 0.5, 64]} />
        <meshStandardMaterial color={COLORS.grass} roughness={0.86} />
      </mesh>
    </group>
  )
}
