type HudProps = {
  name: string
  role: string
}

export function Hud({ name, role }: HudProps) {
  return (
    <div className="hud">
      <p className="hud-name">
        {name}
        <span className="hud-role">{role}</span>
      </p>
      <p className="hud-hint">WASD로 걷기</p>
    </div>
  )
}
