type CottageProps = {
  wall: string
  roof: string
  door: string
  flower: string
}

function FlowerBox({
  x,
  y,
  z,
  flower,
}: {
  x: number
  y: number
  z: number
  flower: string
}) {
  return (
    <group position={[x, y, z]}>
      <mesh castShadow>
        <boxGeometry args={[0.42, 0.1, 0.12]} />
        <meshStandardMaterial color="#c48b5a" roughness={0.86} />
      </mesh>
      <mesh position={[-0.1, 0.1, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={flower} roughness={0.55} />
      </mesh>
      <mesh position={[0.1, 0.1, 0]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#8ecf7a" roughness={0.7} />
      </mesh>
    </group>
  )
}

export function Cottage({ wall, roof, door, flower }: CottageProps) {
  return (
    <group>
      <mesh position={[0, 0.02, 0.86]} receiveShadow>
        <boxGeometry args={[0.9, 0.04, 0.42]} />
        <meshStandardMaterial color="#d7b07a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.78, 1.24, 1.52]} />
        <meshStandardMaterial color={wall} roughness={0.86} />
      </mesh>
      <mesh position={[0, 1.58, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.58, 1.08, 4]} />
        <meshStandardMaterial color={roof} roughness={0.74} />
      </mesh>
      <mesh position={[0.5, 1.78, -0.16]} castShadow>
        <boxGeometry args={[0.2, 0.46, 0.2]} />
        <meshStandardMaterial color="#e8d3c0" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.46, 0.78]} castShadow>
        <boxGeometry args={[0.38, 0.7, 0.08]} />
        <meshStandardMaterial color={door} roughness={0.82} />
      </mesh>
      <mesh position={[0.11, 0.46, 0.83]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial color="#f0d27a" roughness={0.4} />
      </mesh>
      <mesh position={[-0.48, 0.86, 0.77]}>
        <circleGeometry args={[0.14, 16]} />
        <meshStandardMaterial color="#9fd6ea" roughness={0.32} />
      </mesh>
      <mesh position={[0.48, 0.86, 0.77]}>
        <circleGeometry args={[0.14, 16]} />
        <meshStandardMaterial color="#9fd6ea" roughness={0.32} />
      </mesh>
      <FlowerBox flower={flower} x={-0.48} y={0.62} z={0.84} />
      <FlowerBox flower={flower} x={0.48} y={0.62} z={0.84} />
      <mesh position={[0.72, 0.16, 0.7]}>
        <sphereGeometry args={[0.11, 10, 8]} />
        <meshStandardMaterial color="#8ecf7a" roughness={0.75} />
      </mesh>
      <mesh position={[0.82, 0.2, 0.58]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color={flower} roughness={0.5} />
      </mesh>
    </group>
  )
}
