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
    <form
      className="pointer-events-auto absolute inset-0 z-[2] box-border grid min-h-full place-items-center overflow-auto bg-[radial-gradient(ellipse_42%_18%_at_32%_72%,#8fce9a_0%,transparent_72%),linear-gradient(180deg,var(--color-sky)_0%,#d7efd4_58%,#8fb89a_100%)] p-6 max-[720px]:place-items-start max-[720px]:px-4 max-[720px]:pt-5 max-[720px]:pb-6"
      onSubmit={handleSubmit}
    >
      <div className="grid w-[min(52rem,100%)] grid-cols-[minmax(16rem,1fr)_minmax(16rem,22rem)] items-center gap-x-[2.4rem] gap-y-[1.6rem] [grid-template-areas:'copy_copy'_'hero_card'] max-[720px]:grid-cols-1 max-[720px]:gap-[1.1rem] max-[720px]:[grid-template-areas:'copy'_'hero'_'card']">
        <header className="[grid-area:copy]">
          <h1 className="m-0 text-[2.6rem] leading-none font-normal tracking-[-0.03em] max-[720px]:text-[2.1rem]">
            모이섬
          </h1>
          <p className="mt-[0.45rem] text-base text-ink-soft">
            이름, 직군, 모습을 고르면 섬 마을로 들어가요.
          </p>
        </header>
        <div className="flex flex-col items-center gap-[0.7rem] [grid-area:hero]">
          <div className="flex items-center justify-center gap-[0.6rem]">
            <button
              aria-label="이전 모습"
              className="size-[2.1rem] cursor-pointer rounded-full border-0 bg-ink p-0 text-[1.35rem] leading-none text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              onClick={handlePrev}
              type="button"
            >
              ‹
            </button>
            <GateFigure url={lookUrl(look.file)} />
            <button
              aria-label="다음 모습"
              className="size-[2.1rem] cursor-pointer rounded-full border-0 bg-ink p-0 text-[1.35rem] leading-none text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              onClick={handleNext}
              type="button"
            >
              ›
            </button>
          </div>
          <p className="m-0 text-[0.95rem] text-ink-soft">
            {look.label} · {index + 1}/{LOOKS.length}
          </p>
        </div>
        <div className="flex flex-col gap-[0.9rem] rounded-[1.4rem] border border-paper-edge bg-[color-mix(in_srgb,var(--color-paper)_94%,white)] px-5 pt-[1.2rem] pb-[1.15rem] shadow-[0_16px_40px_rgb(61_74_60/12%)] [grid-area:card]">
          <label className="flex flex-col gap-[0.35rem]">
            <span className="text-[0.82rem] text-ink-soft">이름</span>
            <input
              ref={nameRef}
              autoComplete="nickname"
              autoFocus
              className="box-border w-full rounded-full border border-paper-edge bg-[color-mix(in_srgb,white_70%,var(--color-paper))] px-3 py-[0.55rem] outline-none placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
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
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-[0.4rem] p-0 text-[0.82rem] text-ink-soft">
              직군
            </legend>
            <div className="flex flex-wrap gap-[0.4rem]">
              {ROLES.map((role) => (
                <label
                  className="relative cursor-pointer rounded-full border border-paper-edge bg-[color-mix(in_srgb,white_70%,var(--color-paper))] px-[0.62rem] py-[0.34rem] text-[0.82rem] has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
                  key={role.id}
                >
                  <input
                    checked={roleId === role.id}
                    className="sr-only"
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
          <button
            className="w-full cursor-pointer rounded-full border-0 bg-ink px-[0.9rem] py-[0.4rem] text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            type="submit"
          >
            섬으로
          </button>
        </div>
      </div>
    </form>
  )
}
