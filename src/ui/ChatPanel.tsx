import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { MAX_CHAT } from '../world/constants.ts'
import type { ChatLine } from '../world/chatLog.ts'

type ChatPanelProps = {
  messages: ChatLine[]
  onFocusChange: (focused: boolean) => void
  onSend: (text: string) => void
}

export function ChatPanel({ messages, onFocusChange, onSend }: ChatPanelProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

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

  useEffect(() => {
    const list = listRef.current
    if (!list) {
      return
    }
    list.scrollTop = list.scrollHeight
  }, [messages])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSend(value)
    setValue('')
  }

  return (
    <section
      aria-label="채팅"
      className="pointer-events-auto absolute right-3 bottom-3 left-3 z-[2] mx-auto flex w-full max-w-lg min-w-0 flex-col overflow-hidden rounded-2xl border border-white/15 bg-black/45 shadow-[0_10px_28px_rgb(0_0_0/25%)] backdrop-blur-md"
    >
      {messages.length > 0 ? (
        <ul
          ref={listRef}
          aria-live="polite"
          className="m-0 max-h-32 min-w-0 list-none overflow-x-hidden overflow-y-auto px-3 py-2 [scrollbar-width:thin]"
        >
          {messages.map((message) => (
            <li
              key={message.id}
              className="min-w-0 py-[0.18rem] text-[0.82rem] leading-[1.4] wrap-anywhere text-white/90"
            >
              <span className="font-medium text-white">{message.speaker}</span>
              <span className="text-white/45"> · </span>
              <span>{message.text}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <form
        className="border-t border-white/10 px-3 py-[0.35rem] only:border-t-0"
        onSubmit={handleSubmit}
      >
        <label className="block">
          <span className="sr-only">말하기</span>
          <input
            ref={inputRef}
            className="w-full border-0 bg-transparent px-[0.1rem] py-[0.35rem] text-white outline-none placeholder:text-white/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
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
    </section>
  )
}
