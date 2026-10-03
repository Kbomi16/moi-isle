import type { PlacedStack } from '../world/roomStacks.ts'
import { RoomPlacedStack } from './RoomPlacedStack.tsx'

type RoomWallStacksProps = {
  stacks: PlacedStack[]
  editMode: boolean
  selectedId: string | null
  onSelect: (id: string | null) => void
  onMove: (id: string, position: [number, number, number]) => void
  onDragActive: (active: boolean) => void
}

/** 뒷벽에 기술스택 뱃지 */
export function RoomWallStacks({
  stacks,
  editMode,
  selectedId,
  onSelect,
  onMove,
  onDragActive,
}: RoomWallStacksProps) {
  return (
    <group>
      {stacks.map((stack) => (
        <RoomPlacedStack
          key={stack.id}
          editMode={editMode}
          onDragActive={onDragActive}
          onMove={onMove}
          onSelect={(id) => onSelect(id)}
          selected={selectedId === stack.id}
          stack={stack}
        />
      ))}
    </group>
  )
}
