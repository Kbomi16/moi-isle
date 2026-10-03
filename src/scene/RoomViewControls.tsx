import type { RefObject } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

type RoomViewControlsProps = {
  controlsRef: RefObject<OrbitControlsImpl | null>
}

export function RoomViewControls({ controlsRef }: RoomViewControlsProps) {
  const rotate = (direction: 'left' | 'right') => {
    const controls = controlsRef.current
    if (!controls) {
      return
    }
    const delta = direction === 'left' ? 0.28 : -0.28
    controls.setAzimuthalAngle(controls.getAzimuthalAngle() + delta)
    controls.update()
  }

  const zoom = (direction: 'in' | 'out') => {
    const controls = controlsRef.current
    if (!controls) {
      return
    }
    if (direction === 'in') {
      controls.dollyIn(1.12)
    } else {
      controls.dollyOut(1.12)
    }
    controls.update()
  }

  return (
    <div className="pointer-events-auto absolute top-14 right-3 z-2 flex flex-col gap-1 rounded-xl border border-paper-edge bg-paper/90 p-1 shadow-[0_8px_20px_rgb(61_74_60/12%)]">
      <span className="px-1 text-[0.62rem] text-ink-soft">보기</span>
      <div className="flex gap-1">
        <button
          aria-label="왼쪽으로 회전"
          className="size-8 cursor-pointer rounded-lg border border-paper-edge bg-white/80 text-[0.9rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          onClick={() => rotate('left')}
          type="button"
        >
          ↺
        </button>
        <button
          aria-label="오른쪽으로 회전"
          className="size-8 cursor-pointer rounded-lg border border-paper-edge bg-white/80 text-[0.9rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          onClick={() => rotate('right')}
          type="button"
        >
          ↻
        </button>
      </div>
      <div className="flex gap-1">
        <button
          aria-label="확대"
          className="size-8 cursor-pointer rounded-lg border border-paper-edge bg-white/80 text-[0.95rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          onClick={() => zoom('in')}
          type="button"
        >
          +
        </button>
        <button
          aria-label="축소"
          className="size-8 cursor-pointer rounded-lg border border-paper-edge bg-white/80 text-[0.95rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          onClick={() => zoom('out')}
          type="button"
        >
          −
        </button>
      </div>
    </div>
  )
}
