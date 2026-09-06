import type { CharacterLook } from '../world/constants.ts'

type CharacterBodyProps = {
  look: CharacterLook
}

export function CharacterBody({ look }: CharacterBodyProps) {
  return (
    <group>
      <mesh position={[-0.14, 0.1, 0.04]} castShadow>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color={look.skin} roughness={0.78} />
      </mesh>
      <mesh position={[0.14, 0.1, 0.04]} castShadow>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color={look.skin} roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.48, 0]} scale={[0.78, 0.9, 0.68]} castShadow>
        <sphereGeometry args={[0.38, 14, 12]} />
        <meshStandardMaterial color={look.shirt} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.46, 0.18]} scale={[0.55, 0.5, 0.28]} castShadow>
        <sphereGeometry args={[0.28, 12, 10]} />
        <meshStandardMaterial color={look.skin} roughness={0.75} />
      </mesh>
      <mesh position={[0, 1.08, 0]} castShadow>
        <sphereGeometry args={[0.36, 16, 14]} />
        <meshStandardMaterial color={look.skin} roughness={0.72} />
      </mesh>
      <mesh position={[0.02, 1.42, -0.02]} castShadow>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color={look.hair} roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 1.54, 0]} scale={[0.35, 0.7, 0.35]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={look.hair} roughness={0.8} />
      </mesh>
      <mesh position={[-0.11, 1.1, 0.3]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#2c2a28" roughness={0.4} />
      </mesh>
      <mesh position={[0.11, 1.1, 0.3]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#2c2a28" roughness={0.4} />
      </mesh>
      <mesh position={[-0.2, 1.02, 0.26]} rotation={[0.2, 0, 0]}>
        <circleGeometry args={[0.055, 10]} />
        <meshStandardMaterial color="#f0a0a0" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 1.02, 0.26]} rotation={[0.2, 0, 0]}>
        <circleGeometry args={[0.055, 10]} />
        <meshStandardMaterial color="#f0a0a0" roughness={0.9} />
      </mesh>
      <mesh position={[-0.34, 0.55, 0.04]} rotation={[0, 0, 0.6]} castShadow>
        <capsuleGeometry args={[0.07, 0.18, 4, 8]} />
        <meshStandardMaterial color={look.skin} roughness={0.75} />
      </mesh>
      <mesh position={[0.34, 0.55, 0.04]} rotation={[0, 0, -0.6]} castShadow>
        <capsuleGeometry args={[0.07, 0.18, 4, 8]} />
        <meshStandardMaterial color={look.skin} roughness={0.75} />
      </mesh>
    </group>
  )
}
