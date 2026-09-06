import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { MAX_CHAT } from '../world/constants.ts'

type ChatBarProps = {
  onFocusChange: (focused: boolean) => void
  onSend: (text: string) => void
  onClose: () => void
}

export function ChatBar({ onFocusChange, onSend, onClose }: ChatBarProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }
      event.preventDefault()
      onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      onFocusChange(false)
    }
  }, [onClose, onFocusChange])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSend(value)
    setValue('')
    onClose()
  }

  return (
    <form className="chat" onSubmit={handleSubmit}>
      <p className="chat-label" aria-hidden>
        한 마디
      </p>
      <label className="chat-field">
        <span className="sr-only">말하기</span>
        <input
          ref={inputRef}
          maxLength={MAX_CHAT}
          name="chat"
          onBlur={() => onFocusChange(false)}
          onChange={(event) => setValue(event.currentTarget.value)}
          onFocus={() => onFocusChange(true)}
          placeholder="안녕?"
          value={value}
        />
      </label>
    </form>
  )
}
