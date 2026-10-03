import type { ThreeEvent } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { Plane, Vector3 } from 'three'
import {
  clampRoomPosition,
  DEFAULT_ROOM_SCALE,
  type RoomItem,
} from '../world/roomLayout.ts'
import { IsleModel } from './IsleModel.tsx'
import { ROOM_MODELS } from './roomModels.ts'

const floorPlane = new Plane(new Vector3(0, 1, 0), 0)
const hitPoint = new Vector3()

type RoomPlacedItemProps = {
  item: RoomItem
  editMode: boolean
  selected: boolean
  onSelect: (id: string) => void
  onMove: (id: string, position: [number, number, number]) => void
  onDragActive: (active: boolean) => void
}

export function RoomPlacedItem({
  item,
  editMode,
  selected,
  onSelect,
  onMove,
  onDragActive,
}: RoomPlacedItemProps) {
  const gl = useThree((state) => state.gl)
  const group = useRef<Group>(null)
  const dragY = useRef(item.position[1])
  const url = ROOM_MODELS[item.model]
  const scale = item.scale ?? DEFAULT_ROOM_SCALE

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!editMode) {
      return
    }
    event.stopPropagation()
    onSelect(item.id)
    dragY.current = item.position[1]
    onDragActive(true)
    gl.domElement.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!editMode || !gl.domElement.hasPointerCapture(event.pointerId)) {
      return
    }
    event.stopPropagation()
    const hit = event.ray.intersectPlane(floorPlane, hitPoint)
    if (!hit) {
      return
    }
    const clamped = clampRoomPosition(hit.x, hit.z)
    onMove(item.id, [clamped.x, dragY.current, clamped.z])
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
      position={item.position}
      rotation={[0, item.rotationY, 0]}
      scale={scale}
    >
      <IsleModel url={url} />
      {item.attachments?.map((attachment, index) => (
        <IsleModel
          key={`${item.id}-attachment-${index}`}
          position={attachment.position}
          url={ROOM_MODELS[attachment.model]}
        />
      ))}
      {editMode && selected ? (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.4, 32]} />
          <meshBasicMaterial color="#3d4a3c" />
        </mesh>
      ) : null}
    </group>
  )
}
