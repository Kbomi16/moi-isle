import { useState } from 'react'
import {
  ADDABLE_ROOM_MODELS,
  ROOM_MODEL_LABELS,
  type RoomItem,
  type RoomModelId,
} from '../world/roomLayout.ts'
import {
  MAX_ROOM_STACKS,
  STACK_ICON_URLS,
  STACK_IDS,
  STACK_LABELS,
  type PlacedStack,
  type StackId,
} from '../world/roomStacks.ts'

type RoomEditorProps = {
  items: RoomItem[]
  stacks: PlacedStack[]
  selectedItemId: string | null
  selectedStackId: string | null
  onAdd: (model: RoomModelId) => void
  onRemove: (id: string) => void
  onRotate: (id: string, deltaRadians: number) => void
  onReset: () => void
  onSelectItem: (id: string | null) => void
  onSelectStack: (id: string | null) => void
  onToggleStack: (stackId: StackId) => void
  onStackRotate: (id: string, deltaRadians: number) => void
  onStackRemove: (id: string) => void
}

type EditorTab = 'furniture' | 'stacks'

const MODEL_ICONS: Record<RoomModelId, string> = {
  bed: '🛏',
  bookcase: '📚',
  books: '📖',
  chair: '🪑',
  deskChair: '💺',
  keyboard: '⌨',
  screen: '🖥',
  desk: '🗄',
  floorLamp: '💡',
  tableLamp: '🔦',
  plant: '🌿',
  pottedPlant: '🪴',
  rug: '🧶',
  sideTable: '🛋',
  window: '🪟',
}

type CatalogCardProps = {
  label: string
  icon: string
  disabled?: boolean
  onClick: () => void
}

function CatalogCard({ label, icon, disabled, onClick }: CatalogCardProps) {
  return (
    <button
      className={`flex w-[4.6rem] shrink-0 flex-col items-center gap-1 rounded-xl border px-1.5 py-2 shadow-[0_2px_6px_rgb(61_74_60/8%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        disabled
          ? 'cursor-not-allowed border-paper-edge/60 bg-white/40 opacity-45'
          : 'cursor-pointer border-paper-edge bg-white/75 text-ink hover:border-ink hover:bg-white active:scale-[0.98]'
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden className="text-[1.35rem] leading-none">
        {icon}
      </span>
      <span className="w-full truncate text-center text-[0.65rem] leading-tight">
        {label}
      </span>
    </button>
  )
}

type StackCatalogCardProps = {
  stackId: StackId
  active: boolean
  onClick: () => void
}

function StackCatalogCard({ stackId, active, onClick }: StackCatalogCardProps) {
  return (
    <button
      aria-pressed={active}
      className={`flex w-[4.6rem] shrink-0 cursor-pointer flex-col items-center gap-1 rounded-xl border px-1.5 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        active
          ? 'border-ink bg-ink text-paper'
          : 'border-paper-edge bg-white/75 hover:border-ink'
      }`}
      onClick={onClick}
      type="button"
    >
      <img
        alt=""
        className="size-8 object-contain"
        draggable={false}
        src={STACK_ICON_URLS[stackId]}
      />
      <span className="w-full truncate text-center text-[0.62rem] leading-tight">
        {STACK_LABELS[stackId]}
      </span>
    </button>
  )
}

export function RoomEditor({
  items,
  stacks,
  selectedItemId,
  selectedStackId,
  onAdd,
  onRemove,
  onRotate,
  onReset,
  onSelectItem,
  onSelectStack,
  onToggleStack,
  onStackRotate,
  onStackRemove,
}: RoomEditorProps) {
  const [tab, setTab] = useState<EditorTab>('furniture')
  const selectedItem =
    items.find((item) => item.id === selectedItemId) ?? null
  const selectedStack =
    stacks.find((stack) => stack.id === selectedStackId) ?? null
  const placedModels = new Set(items.map((item) => item.model))

  return (
    <section
      aria-label="방 꾸미기"
      className="pointer-events-auto absolute right-3 bottom-3 left-3 z-2 mx-auto flex max-h-[min(36vh,14.5rem)] w-full max-w-4xl min-w-0 flex-col overflow-hidden rounded-[1.15rem] border border-paper-edge bg-[color-mix(in_srgb,var(--color-paper)_92%,white)] shadow-[0_16px_40px_rgb(61_74_60/18%)] max-[720px]:right-2 max-[720px]:bottom-2 max-[720px]:left-2 max-[720px]:max-h-[min(40vh,16rem)]"
    >
      <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-paper-edge/80 px-3 py-2">
        <div className="flex rounded-full bg-white/70 p-0.5" role="tablist">
          <button
            aria-selected={tab === 'furniture'}
            className={`cursor-pointer rounded-full border-0 px-3 py-1 text-[0.78rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              tab === 'furniture' ? 'bg-ink text-paper' : 'text-ink-soft'
            }`}
            onClick={() => setTab('furniture')}
            role="tab"
            type="button"
          >
            가구
          </button>
          <button
            aria-selected={tab === 'stacks'}
            className={`cursor-pointer rounded-full border-0 px-3 py-1 text-[0.78rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              tab === 'stacks' ? 'bg-ink text-paper' : 'text-ink-soft'
            }`}
            onClick={() => setTab('stacks')}
            role="tab"
            type="button"
          >
            스택
          </button>
        </div>

        {tab === 'furniture' && selectedItem ? (
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[0.75rem] text-ink-soft">
              {ROOM_MODEL_LABELS[selectedItem.model]}
            </span>
            <button
              className="cursor-pointer rounded-full border border-paper-edge bg-white/80 px-2 py-0.5 text-[0.72rem]"
              onClick={() => onRotate(selectedItem.id, Math.PI / 2)}
              type="button"
            >
              ↻
            </button>
            <button
              className="cursor-pointer rounded-full border border-paper-edge bg-white/80 px-2 py-0.5 text-[0.72rem]"
              onClick={() => onRotate(selectedItem.id, -Math.PI / 2)}
              type="button"
            >
              ↺
            </button>
            <button
              className="cursor-pointer rounded-full border border-paper-edge bg-white/80 px-2 py-0.5 text-[0.72rem]"
              onClick={() => {
                onRemove(selectedItem.id)
                onSelectItem(null)
              }}
              type="button"
            >
              삭제
            </button>
          </div>
        ) : null}

        {tab === 'stacks' && selectedStack ? (
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[0.75rem] text-ink-soft">
              {STACK_LABELS[selectedStack.stackId]}
            </span>
            <button
              className="cursor-pointer rounded-full border border-paper-edge bg-white/80 px-2 py-0.5 text-[0.72rem]"
              onClick={() => onStackRotate(selectedStack.id, Math.PI / 2)}
              type="button"
            >
              ↻
            </button>
            <button
              className="cursor-pointer rounded-full border border-paper-edge bg-white/80 px-2 py-0.5 text-[0.72rem]"
              onClick={() => onStackRotate(selectedStack.id, -Math.PI / 2)}
              type="button"
            >
              ↺
            </button>
            <button
              className="cursor-pointer rounded-full border border-paper-edge bg-white/80 px-2 py-0.5 text-[0.72rem]"
              onClick={() => onStackRemove(selectedStack.id)}
              type="button"
            >
              삭제
            </button>
          </div>
        ) : null}

        <button
          className="ml-auto cursor-pointer border-0 bg-transparent p-0 text-[0.72rem] text-ink-soft underline-offset-2 hover:underline"
          onClick={() => {
            onReset()
            onSelectItem(null)
            onSelectStack(null)
          }}
          type="button"
        >
          기본 배치
        </button>
      </div>

      {tab === 'furniture' ? (
        <div className="flex min-h-0 flex-1 flex-col gap-2 p-2" role="tabpanel">
          <div className="min-w-0">
            <span className="mb-1 block text-[0.65rem] text-ink-soft">
              내 방 · {items.length} (종류당 1개)
            </span>
            <ul className="m-0 flex list-none gap-1.5 overflow-x-auto p-0 [scrollbar-width:thin]">
              {items.length === 0 ? (
                <li className="py-1 text-[0.72rem] text-ink-soft">
                  아래에서 가구를 골라 추가
                </li>
              ) : (
                items.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`flex shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-lg border px-2 py-1.5 ${
                        selectedItemId === item.id
                          ? 'border-ink bg-ink text-paper'
                          : 'border-paper-edge bg-white/80'
                      }`}
                      onClick={() => onSelectItem(item.id)}
                      type="button"
                    >
                      <span className="text-base">{MODEL_ICONS[item.model]}</span>
                      <span className="max-w-[4rem] truncate text-[0.62rem]">
                        {ROOM_MODEL_LABELS[item.model]}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="min-w-0">
            <span className="mb-1 block text-[0.65rem] text-ink-soft">가구</span>
            <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0 [scrollbar-width:thin]">
              {ADDABLE_ROOM_MODELS.map((model) => (
                <li key={model}>
                  <CatalogCard
                    disabled={placedModels.has(model)}
                    icon={MODEL_ICONS[model]}
                    label={ROOM_MODEL_LABELS[model]}
                    onClick={() => onAdd(model)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-2 p-2" role="tabpanel">
          <div className="min-w-0">
            <span className="mb-1 block text-[0.65rem] text-ink-soft">
              벽 · {stacks.length}/{MAX_ROOM_STACKS} · 꾸미기 중 끌어 옮기기
            </span>
            <ul className="m-0 flex list-none gap-1.5 overflow-x-auto p-0 [scrollbar-width:thin]">
              {stacks.length === 0 ? (
                <li className="py-1 text-[0.72rem] text-ink-soft">
                  아래에서 스택 추가
                </li>
              ) : (
                stacks.map((stack) => (
                  <li key={stack.id}>
                    <button
                      className={`flex shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-lg border px-2 py-1.5 ${
                        selectedStackId === stack.id
                          ? 'border-ink bg-ink text-paper'
                          : 'border-paper-edge bg-white/80'
                      }`}
                      onClick={() => onSelectStack(stack.id)}
                      type="button"
                    >
                      <img
                        alt=""
                        className="size-7 object-contain"
                        src={STACK_ICON_URLS[stack.stackId]}
                      />
                      <span className="max-w-[4rem] truncate text-[0.62rem]">
                        {STACK_LABELS[stack.stackId]}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
          <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0 [scrollbar-width:thin]">
            {STACK_IDS.map((stackId) => (
              <li key={stackId}>
                <StackCatalogCard
                  active={stacks.some((entry) => entry.stackId === stackId)}
                  onClick={() => onToggleStack(stackId)}
                  stackId={stackId}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
