import { useState } from 'react'
import type { FormEvent } from 'react'
import { LOOKS, lookPreviewUrl } from '../world/looks.ts'
import type { LookId } from '../world/looks.ts'
import { normalizeNickname } from '../world/nickname.ts'

type NameGateProps = {
  onEnter: (name: string, lookId: LookId) => void
}

export function NameGate({ onEnter }: NameGateProps) {
  const [value, setValue] = useState('')
  const [index, setIndex] = useState(0)
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
      return
    }
    onEnter(name, look.id)
  }

  return (
    <form className="gate" onSubmit={handleSubmit}>
      <p className="gate-title">모이섬</p>
      <label className="gate-field">
        <span className="sr-only">이름</span>
        <input
          autoComplete="nickname"
          autoFocus
          maxLength={10}
          name="nickname"
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder="이름"
          value={value}
        />
      </label>
      <fieldset className="gate-looks">
        <legend>모습</legend>
        <div className="gate-look-row">
          <button type="button" aria-label="이전 모습" onClick={handlePrev}>
            ‹
          </button>
          <img
            alt=""
            className="gate-preview"
            src={lookPreviewUrl(look.preview)}
          />
          <button type="button" aria-label="다음 모습" onClick={handleNext}>
            ›
          </button>
        </div>
        <p className="gate-look-name">
          {look.label} · {index + 1}/{LOOKS.length}
        </p>
      </fieldset>
      <button type="submit">섬으로</button>
    </form>
  )
}
