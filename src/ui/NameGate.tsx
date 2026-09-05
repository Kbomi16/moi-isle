import { useState } from 'react'
import type { FormEvent } from 'react'
import { normalizeNickname } from '../world/nickname.ts'

type NameGateProps = {
  onEnter: (name: string) => void
}

export function NameGate({ onEnter }: NameGateProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = normalizeNickname(value)
    if (!name) {
      return
    }
    onEnter(name)
  }

  return (
    <form className="gate" onSubmit={handleSubmit}>
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
      <button type="submit">섬으로</button>
    </form>
  )
}
