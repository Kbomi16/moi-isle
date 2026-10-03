import type { ThreeEvent } from '@react-three/fiber'
import { RoomPlacedItem } from './RoomPlacedItem.tsx'
import { ROOM_MODELS } from './roomModels.ts'
import { useGLTF } from '@react-three/drei'
import type { RoomItem } from '../world/roomLayout.ts'
import type { PlacedStack } from '../world/roomStacks.ts'
import { RoomWallStacks } from './RoomWallStacks.tsx'

const wall = '#f3eadc'
const floor = '#d7b07a'

type RoomProps = {
  items: RoomItem[]
  stacks: PlacedStack[]
  editMode: boolean
  selectedItemId: string | null
  selectedStackId: string | null
  onSelectItem: (id: string | null) => void
  onSelectStack: (id: string | null) => void
  onMoveItem: (id: string, position: [number, number, number]) => void
  onMoveStack: (id: string, position: [number, number, number]) => void
  onDragActive: (active: boolean) => void
}

/** 앞이 열린 방. 천장은 비워 두고 위에서 전체를 볼 수 있다 */
export function Room({
  items,
  stacks,
  editMode,
  selectedItemId,
  selectedStackId,
  onSelectItem,
  onSelectStack,
  onMoveItem,
  onMoveStack,
  onDragActive,
}: RoomProps) {
  const handleFloorPointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!editMode) {
      return
    }
    event.stopPropagation()
    onSelectItem(null)
    onSelectStack(null)
  }

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} onPointerDown={handleFloorPointerDown}>
        <planeGeometry args={[6.2, 5.2]} />
        <meshStandardMaterial color={floor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.28, -2.54]} receiveShadow>
        <boxGeometry args={[6.2, 2.56, 0.12]} />
        <meshStandardMaterial color={wall} roughness={0.94} />
      </mesh>
      <mesh position={[-3.04, 1.28, 0]} receiveShadow>
        <boxGeometry args={[0.12, 2.56, 5.2]} />
        <meshStandardMaterial color={wall} roughness={0.94} />
      </mesh>
      <mesh position={[3.04, 1.28, 0]} receiveShadow>
        <boxGeometry args={[0.12, 2.56, 5.2]} />
        <meshStandardMaterial color={wall} roughness={0.94} />
      </mesh>

      <mesh position={[-0.15, 1.45, -2.47]}>
        <planeGeometry args={[1.45, 1.15]} />
        <meshStandardMaterial color="#9fd6ea" roughness={0.25} />
      </mesh>

      <RoomWallStacks
        editMode={editMode}
        onDragActive={onDragActive}
        onMove={onMoveStack}
        onSelect={(id) => {
          onSelectItem(null)
          onSelectStack(id)
        }}
        selectedId={selectedStackId}
        stacks={stacks}
      />

      {items.map((item) => (
        <RoomPlacedItem
          key={item.id}
          editMode={editMode}
          item={item}
          onDragActive={onDragActive}
          onMove={onMoveItem}
          onSelect={(id) => {
            onSelectStack(null)
            onSelectItem(id)
          }}
          selected={selectedItemId === item.id}
        />
      ))}
    </group>
  )
}

for (const url of Object.values(ROOM_MODELS)) {
  useGLTF.preload(url)
}
