import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { Plane, Vector3 } from 'three'
import {
  STACK_ICON_URLS,
  STACK_LABELS,
  STACK_WALL_Z,
  clampStackOnWall,
  type PlacedStack,
} from '../world/roomStacks.ts'

const wallPlane = new Plane(new Vector3(0, 0, 1), -STACK_WALL_Z)
const hitPoint = new Vector3()

type RoomPlacedStackProps = {
  stack: PlacedStack
  editMode: boolean
  selected: boolean
  onSelect: (id: string) => void
  onMove: (id: string, position: [number, number, number]) => void
  onDragActive: (active: boolean) => void
}

export function RoomPlacedStack({
  stack,
  editMode,
  selected,
  onSelect,
  onMove,
  onDragActive,
}: RoomPlacedStackProps) {
  const gl = useThree((state) => state.gl)
  const group = useRef<Group>(null)

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!editMode) {
      return
    }
    event.stopPropagation()
    onSelect(stack.id)
    onDragActive(true)
    gl.domElement.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!editMode || !gl.domElement.hasPointerCapture(event.pointerId)) {
      return
    }
    event.stopPropagation()
    const hit = event.ray.intersectPlane(wallPlane, hitPoint)
    if (!hit) {
      return
    }
    const clamped = clampStackOnWall(hit.x, hit.y)
    onMove(stack.id, [clamped.x, clamped.y, STACK_WALL_Z])
  }

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (gl.domElement.hasPointerCapture(event.pointerId)) {
      gl.domElement.releasePointerCapture(event.pointerId)
      onDragActive(false)
    }
  }

  return (
    <group
      ref={group}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      position={stack.position}
      rotation={[0, stack.rotationY, 0]}
    >
      <Html center distanceFactor={2.2} transform>
        <div
          className={`flex flex-col items-center gap-0.5 rounded-xl border bg-[color-mix(in_srgb,var(--color-paper)_92%,white)] p-1.5 shadow-[0_2px_8px_rgb(61_74_60/12%)] ${
            selected ? 'border-ink ring-2 ring-ink/30' : 'border-paper-edge'
          }`}
        >
          <img
            alt=""
            className="size-8 object-contain"
            draggable={false}
            src={STACK_ICON_URLS[stack.stackId]}
          />
          <span className="max-w-[3.5rem] truncate text-[0.58rem] text-ink">
            {STACK_LABELS[stack.stackId]}
          </span>
        </div>
      </Html>
    </group>
  )
}
