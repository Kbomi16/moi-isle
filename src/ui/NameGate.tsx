import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'
import { GateFigure } from './GateFigure.tsx'
import { LOOKS, lookUrl } from '../world/looks.ts'
import type { LookId } from '../world/looks.ts'
import { normalizeNickname } from '../world/nickname.ts'
import { ROLES } from '../world/roles.ts'
import type { RoleId } from '../world/roles.ts'
import { readGateProfile, writeGateProfile } from '../world/session.ts'

type NameGateProps = {
  onEnter: (name: string, lookId: LookId, roleId: RoleId) => void
}

export function NameGate({ onEnter }: NameGateProps) {
  const [initialProfile] = useState(() => readGateProfile())
  const [value, setValue] = useState(initialProfile.nickname)
  const [index, setIndex] = useState(0)
  const [roleId, setRoleId] = useState<RoleId>(initialProfile.roleId)
  const nameRef = useRef<HTMLInputElement>(null)
  const look = LOOKS[index] ?? LOOKS[0]

  const handlePrev = () => {
    setIndex((current) => (current + LOOKS.length - 1) % LOOKS.length)
  }

  const handleNext = () => {
    setIndex((current) => (current + 1) % LOOKS.length)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = normalizeNickname(value)
    if (!name) {
      toast('이름을 적어 주세요.')
      nameRef.current?.focus()
      return
    }
    onEnter(name, look.id, roleId)
  }

  return (
    <form className="gate" onSubmit={handleSubmit}>
      <div className="gate-panel">
        <header className="gate-copy">
          <h1 className="gate-title">모이섬</h1>
          <p className="gate-lead">이름, 직군, 모습을 고르면 섬 마을로 들어가요.</p>
        </header>
        <div className="gate-hero">
          <div className="gate-look-row">
            <button type="button" aria-label="이전 모습" onClick={handlePrev}>
              ‹
            </button>
            <GateFigure url={lookUrl(look.file)} />
            <button type="button" aria-label="다음 모습" onClick={handleNext}>
              ›
            </button>
          </div>
          <p className="gate-look-name">
            {look.label} · {index + 1}/{LOOKS.length}
          </p>
        </div>
        <div className="gate-card">
          <label className="gate-field">
            <span>이름</span>
            <input
              ref={nameRef}
              autoComplete="nickname"
              autoFocus
              maxLength={10}
              name="nickname"
              onChange={(event) => {
                const next = event.currentTarget.value
                setValue(next)
                writeGateProfile({ nickname: next, roleId })
              }}
              placeholder="뭐라고 부를까"
              value={value}
            />
          </label>
          <fieldset className="gate-roles">
            <legend>직군</legend>
            <div className="gate-role-row">
              {ROLES.map((role) => (
                <label className="gate-role" key={role.id}>
                  <input
                    checked={roleId === role.id}
                    name="role"
                    onChange={() => {
                      setRoleId(role.id)
                      writeGateProfile({ nickname: value, roleId: role.id })
                    }}
                    type="radio"
                    value={role.id}
                  />
                  {role.label}
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit">섬으로</button>
        </div>
      </div>
    </form>
  )
}
