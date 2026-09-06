type HudProps = {
  name: string
}

export function Hud({ name }: HudProps) {
  return (
    <div className="hud">
      <p className="hud-name">{name}</p>
      <p className="hud-hint">WASD로 걷기</p>
    </div>
  )
}
