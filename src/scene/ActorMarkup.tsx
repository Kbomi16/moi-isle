import { Html } from '@react-three/drei'

type ActorMarkupProps = {
  name: string
  showName: boolean
  bubble: string | null
}

export function ActorMarkup({ name, showName, bubble }: ActorMarkupProps) {
  if (!showName && !bubble) {
    return null
  }

  return (
    <Html
      position={[0, 1, 0]}
      distanceFactor={10}
      style={{ pointerEvents: 'none' }}
    >
      <div className="flex -translate-x-1/2 -translate-y-full flex-col items-center gap-0.5 font-hand">
        {bubble ? (
          <p className="m-0 w-fit min-w-24 max-w-[min(16rem,72vw)] shrink-0 wrap-anywhere rounded-[10px_10px_10px_3px] border border-paper-edge bg-paper px-[0.55rem] py-[0.28rem] text-center text-[0.7rem] leading-[1.35] text-ink">
            {bubble}
          </p>
        ) : null}
        {showName ? (
          <p className="m-0 shrink-0 self-center whitespace-nowrap text-center text-[0.78rem] text-ink [text-shadow:0_1px_0_rgb(244_239_228/80%)]">
            {name}
          </p>
        ) : null}
      </div>
    </Html>
  )
}
