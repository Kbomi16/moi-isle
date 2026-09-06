import { useMemo } from 'react'
import { BufferAttribute, BufferGeometry, Color } from 'three'
import { COLORS, SAND_OUTER } from '../world/constants.ts'
import {
  groundHeight,
  islandSignedDistance,
  terrainColor,
} from '../world/island.ts'

const GRID = 88
const HALF = 30

const createIslandGeometry = (): BufferGeometry => {
  const step = (HALF * 2) / GRID
  const positions: number[] = []
  const colors: number[] = []
  const color = new Color()

  for (let row = 0; row < GRID; row += 1) {
    const z0 = -HALF + row * step
    const z1 = z0 + step
    for (let col = 0; col < GRID; col += 1) {
      const x0 = -HALF + col * step
      const x1 = x0 + step
      const corners = [
        { x: x0, z: z0 },
        { x: x1, z: z0 },
        { x: x1, z: z1 },
        { x: x0, z: z1 },
      ]
      if (
        corners.some(
          (corner) => islandSignedDistance(corner.x, corner.z) > SAND_OUTER,
        )
      ) {
        continue
      }

      const quad = [
        corners[0],
        corners[1],
        corners[2],
        corners[0],
        corners[2],
        corners[3],
      ]
      for (const corner of quad) {
        if (!corner) {
          continue
        }
        positions.push(corner.x, groundHeight(corner.x, corner.z), corner.z)
        color.set(terrainColor(corner.x, corner.z))
        colors.push(color.r, color.g, color.b)
      }
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
  geometry.computeVertexNormals()
  return geometry
}

export function Island() {
  const geometry = useMemo(() => createIslandGeometry(), [])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
        <circleGeometry args={[80, 80]} />
        <meshStandardMaterial
          color={COLORS.water}
          roughness={0.22}
          metalness={0.08}
        />
      </mesh>
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial vertexColors roughness={0.9} />
      </mesh>
    </group>
  )
}
