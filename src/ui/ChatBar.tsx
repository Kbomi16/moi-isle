import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { MAX_CHAT } from '../world/constants.ts'

type ChatBarProps = {
  onFocusChange: (focused: boolean) => void
  onSend: (text: string) => void
}

export function ChatBar({ onFocusChange, onSend }: ChatBarProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') {
        return
      }
      if (document.activeElement === inputRef.current) {
        return
      }
      event.preventDefault()
      inputRef.current?.focus()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      onFocusChange(false)
    }
  }, [onFocusChange])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSend(value)
    setValue('')
  }

  return (
    <form
      className="pointer-events-auto absolute bottom-[1.4rem] left-1/2 z-[2] -translate-x-1/2 rounded-full border border-paper-edge bg-[color-mix(in_srgb,var(--color-paper)_94%,white)] px-4 py-[0.4rem]"
      onSubmit={handleSubmit}
    >
      <label>
        <span className="sr-only">말하기</span>
        <input
          ref={inputRef}
          className="w-64 border-0 bg-transparent px-[0.15rem] py-[0.35rem] text-center outline-none placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          maxLength={MAX_CHAT}
          name="chat"
          onBlur={() => onFocusChange(false)}
          onChange={(event) => setValue(event.currentTarget.value)}
          onFocus={() => onFocusChange(true)}
          placeholder="말하기"
          value={value}
        />
      </label>
    </form>
  )
}
