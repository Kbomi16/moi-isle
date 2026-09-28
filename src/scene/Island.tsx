import { useMemo } from 'react'
import { BufferAttribute, BufferGeometry, Color, DoubleSide } from 'three'
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

// XZ [-HALF, HALF] 구역을 GRID×GRID 셀로 쪼개 지형 메시 생성
const GRID = 92
const HALF = 22

// world/island SDF — 모래·해변까지 포함할 때만 셀을 메시에 넣음
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

// 사각형 a-b-c-d → 두 삼각형(6 vertex), 동일 hex vertex color
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

// 셀마다 윗면(terrainColor) + 바닥 절벽면 + 가장자리 측면을 vertex color로 적층
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
      // 네 모서리가 모두 섬 안일 때만 이 셀 처리
      if (!corners.every((corner) => isMeshed(corner.x, corner.z))) {
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
      // 지표면(언덕·길·모래 색은 groundHeight + terrainColor)
      pushQuad(positions, colors, color, first, fourth, third, second, hex)
      // 셀 아래쪽 — 물 아래 절벽 바닥
      pushQuad(
        positions,
        colors,
        color,
        { x: first.x, y: CLIFF_BOTTOM_Y, z: first.z },
        { x: second.x, y: CLIFF_BOTTOM_Y, z: second.z },
        { x: third.x, y: CLIFF_BOTTOM_Y, z: third.z },
        { x: fourth.x, y: CLIFF_BOTTOM_Y, z: fourth.z },
        COLORS.cliff,
      )

      // 바깥으로 한 칸 나갔을 때 메시가 끊기면 그 변에 절벽 옆면 추가
      const edges = [
        { a: first, b: second, ox: 0, oz: -step },
        { a: second, b: third, ox: step, oz: 0 },
        { a: third, b: fourth, ox: 0, oz: step },
        { a: fourth, b: first, ox: -step, oz: 0 },
      ]
      for (const edge of edges) {
        if (isMeshed(edge.a.x + edge.ox, edge.a.z + edge.oz)) {
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

/** 바다 원판 + world/island 기반 프로시저럴 지형 메시 */
export function Island() {
  const geometry = useMemo(() => createIslandGeometry(), [])

  return (
    <group>
      {/* 수평 원판 — 섬 주변 바다 */}
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
      {/* 프로시저럴 섬 지형 — 걷기 높이는 world/island.groundHeight와 동일 함수 */}
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial vertexColors roughness={0.9} side={DoubleSide} />
      </mesh>
    </group>
  )
}
