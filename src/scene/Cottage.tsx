type CottageProps = {
  wall: string
  roof: string
  door: string
}

export function Cottage({ wall, roof, door }: CottageProps) {
  return (
    <group>
      <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.72, 1.36, 1.48]} />
        <meshStandardMaterial color={wall} roughness={0.86} />
      </mesh>
      <mesh position={[0, 1.68, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.42, 1.02, 4]} />
        <meshStandardMaterial color={roof} roughness={0.78} />
      </mesh>
      <mesh position={[0.48, 1.82, -0.12]} castShadow>
        <boxGeometry args={[0.22, 0.52, 0.22]} />
        <meshStandardMaterial color="#d7c4ae" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.5, 0.76]} castShadow>
        <boxGeometry args={[0.4, 0.74, 0.08]} />
        <meshStandardMaterial color={door} roughness={0.82} />
      </mesh>
      <mesh position={[0.12, 0.48, 0.81]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#f0d27a" roughness={0.45} />
      </mesh>
      <mesh position={[-0.46, 0.92, 0.75]}>
        <circleGeometry args={[0.15, 16]} />
        <meshStandardMaterial color="#9fd6ea" roughness={0.35} />
      </mesh>
      <mesh position={[0.46, 0.92, 0.75]}>
        <circleGeometry args={[0.15, 16]} />
        <meshStandardMaterial color="#9fd6ea" roughness={0.35} />
      </mesh>
    </group>
  )
}
