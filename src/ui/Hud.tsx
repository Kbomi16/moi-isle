type HudProps = {
  name: string
  role: string
  onOpenRoom: () => void
}

function RoomIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path
        d="M3 8.2 9 3.2l6 5V15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="M7.2 16V10.6h3.6V16"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  )
}

export function Hud({ name, role, onOpenRoom }: HudProps) {
  return (
    <div className="pointer-events-auto absolute top-4 left-[1.1rem] z-2">
      <div className="flex items-center gap-2">
        <p className="m-0 text-[1.05rem] tracking-[0.02em]">
          {name}
          <span className="ml-[0.45rem] text-[0.82rem] text-ink-soft">{role}</span>
        </p>
        <button
          aria-label="내 방"
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-paper-edge bg-paper/85 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          onClick={onOpenRoom}
          type="button"
        >
          <RoomIcon />
        </button>
      </div>
      <p className="mt-[0.15rem] text-[0.82rem] text-ink-soft">WASD로 걷기</p>
      <p className="mt-[0.1rem] text-[0.78rem] text-ink-soft/90">
        <kbd className="rounded border border-paper-edge/80 bg-paper/60 px-1 py-px font-hand text-[0.72rem]">
          /
        </kbd>{' '}
        말하기 ·{' '}
        <kbd className="rounded border border-paper-edge/80 bg-paper/60 px-1 py-px font-hand text-[0.72rem]">
          Esc
        </kbd>{' '}
        입력 취소
      </p>
    </div>
  )
}
