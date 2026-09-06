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
    <form className="chat" onSubmit={handleSubmit}>
      <label className="chat-field">
        <span className="sr-only">말하기</span>
        <input
          ref={inputRef}
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
