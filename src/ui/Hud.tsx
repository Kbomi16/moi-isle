type HudProps = {
  name: string
  role: string
}

export function Hud({ name, role }: HudProps) {
  return (
    <div className="pointer-events-auto absolute top-4 left-[1.1rem] z-[2]">
      <p className="m-0 text-[1.05rem] tracking-[0.02em]">
        {name}
        <span className="ml-[0.45rem] text-[0.82rem] text-ink-soft">{role}</span>
      </p>
      <p className="mt-[0.15rem] text-[0.82rem] text-ink-soft">WASD로 걷기</p>
      <p className="mt-[0.1rem] text-[0.78rem] text-ink-soft/90">
        <kbd className="rounded border border-paper-edge/80 bg-paper/60 px-1 py-px font-[inherit] text-[0.72rem]">
          /
        </kbd>{' '}
        말하기 ·{' '}
        <kbd className="rounded border border-paper-edge/80 bg-paper/60 px-1 py-px font-[inherit] text-[0.72rem]">
          Esc
        </kbd>{' '}
        입력 취소
      </p>
    </div>
  )
}
