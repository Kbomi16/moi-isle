import { useMemo } from 'react'
import { BufferAttribute, BufferGeometry, Color } from 'three'
import {
  BEACH_WIDTH,
  CLIFF_BOTTOM_Y,
  COLORS,
  SAND_OUTER,
  WATER_Y,
} from '../world/constants.ts'
import {
  groundHeight,
  islandSignedDistance,
  terrainColor,
} from '../world/island.ts'

const GRID = 92
const HALF = 22

const isMeshed = (x: number, z: number): boolean =>
  islandSignedDistance(x, z) <= SAND_OUTER + BEACH_WIDTH

const pushVertex = (
  positions: number[],
  colors: number[],
  color: Color,
  x: number,
  y: number,
  z: number,
  hex: string,
) => {
  positions.push(x, y, z)
  color.set(hex)
  colors.push(color.r, color.g, color.b)
}

const pushQuad = (
  positions: number[],
  colors: number[],
  color: Color,
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
  c: { x: number; y: number; z: number },
  d: { x: number; y: number; z: number },
  hex: string,
) => {
  for (const point of [a, b, c, a, c, d]) {
    pushVertex(positions, colors, color, point.x, point.y, point.z, hex)
  }
}

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
      if (!corners.some((corner) => isMeshed(corner.x, corner.z))) {
        continue
      }

      const tops = corners.map((corner) => ({
        x: corner.x,
        y: groundHeight(corner.x, corner.z),
        z: corner.z,
      }))
      const hex = terrainColor(x0 + step / 2, z0 + step / 2)
      const first = tops[0]
      const second = tops[1]
      const third = tops[2]
      const fourth = tops[3]
      if (!first || !second || !third || !fourth) {
        continue
      }
      pushQuad(positions, colors, color, first, second, third, fourth, hex)

      const land = corners.map((corner) => isMeshed(corner.x, corner.z))
      const edges = [
        { a: first, b: second, outward: !land[1] },
        { a: second, b: third, outward: !land[2] },
        { a: third, b: fourth, outward: !land[3] },
        { a: fourth, b: first, outward: !land[0] },
      ]
      for (const edge of edges) {
        if (!edge.outward) {
          continue
        }
        pushQuad(
          positions,
          colors,
          color,
          edge.a,
          { x: edge.a.x, y: CLIFF_BOTTOM_Y, z: edge.a.z },
          { x: edge.b.x, y: CLIFF_BOTTOM_Y, z: edge.b.z },
          edge.b,
          COLORS.cliff,
        )
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
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, WATER_Y, 0]}
        receiveShadow
      >
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
