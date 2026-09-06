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
      center
      wrapperClass="actor-html"
      position={[0, 1.85, 0]}
      distanceFactor={10}
      style={{ pointerEvents: 'none', width: 'max-content' }}
    >
      <div className="actor-markup">
        {bubble ? <p className="bubble">{bubble}</p> : null}
        {showName ? <p className="nametag">{name}</p> : null}
      </div>
    </Html>
  )
}
