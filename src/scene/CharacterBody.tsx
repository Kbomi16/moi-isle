import { COLORS } from '../world/constants.ts'

type CharacterBodyProps = {
  color: string
}

export function CharacterBody({ color }: CharacterBodyProps) {
  return (
    <group>
      <mesh position={[0, 0.72, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.72, 4, 10]} />
        <meshStandardMaterial color={color} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.88, 0.3]} castShadow>
        <boxGeometry args={[0.14, 0.1, 0.16]} />
        <meshStandardMaterial color={COLORS.trunk} roughness={0.8} />
      </mesh>
    </group>
  )
}
