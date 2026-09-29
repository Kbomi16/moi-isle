import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  appendGuestbookEntry,
  createGuestbookId,
  MAX_GUESTBOOK_TEXT,
  normalizeGuestbookText,
  readGuestbook,
  writeGuestbook,
} from '../world/guestbook.ts'

type GuestbookProps = {
  author: string
  onClose: () => void
}

const formatAt = (at: number) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(at)

export function Guestbook({ author, onClose }: GuestbookProps) {
  const [entries, setEntries] = useState(() => readGuestbook())
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }
      const textarea = textareaRef.current
      if (textarea && document.activeElement === textarea) {
        event.preventDefault()
        textarea.blur()
        return
      }
      onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = normalizeGuestbookText(value)
    if (!text) {
      return
    }

    const next = appendGuestbookEntry(entries, {
      id: createGuestbookId(),
      author,
      text,
      at: Date.now(),
    })
    setEntries(next)
    writeGuestbook(next)
    setValue('')
  }

  return (
    <section
      aria-label="방명록"
      className="pointer-events-auto absolute top-4 right-3 bottom-4 z-2 flex w-[min(22rem,calc(100%-7.5rem))] flex-col overflow-hidden rounded-[1.2rem] border border-paper-edge bg-[color-mix(in_srgb,var(--color-paper)_94%,white)] shadow-[0_16px_40px_rgb(61_74_60/16%)]"
    >
      <header className="flex gap-2 border-b border-paper-edge/80 px-4 pt-3 pb-2">
        <div className="min-w-0 flex-1">
          <h2 className="m-0 text-[1.15rem] font-normal">방명록</h2>
          <p className="mt-1 mb-0 text-[0.78rem] text-ink-soft">
            이 방에 남긴 글은 이 브라우저에 저장됩니다.
          </p>
        </div>
        <button
          aria-label="방명록 닫기"
          className="size-8 shrink-0 cursor-pointer rounded-full border-0 bg-transparent text-[1.35rem] leading-none text-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </header>
      <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto px-4 py-2 [scrollbar-width:thin]">
        {entries.length === 0 ? (
          <li className="py-6 text-center text-[0.82rem] text-ink-soft">
            아직 글이 없습니다.
          </li>
        ) : (
          entries.map((entry) => (
            <li
              key={entry.id}
              className="border-b border-paper-edge/70 py-2 last:border-b-0"
            >
              <p className="m-0 text-[0.78rem] text-ink-soft">
                <span className="text-ink">{entry.author}</span>
                <span> · {formatAt(entry.at)}</span>
              </p>
              <p className="mt-1 mb-0 text-[0.9rem] leading-[1.45] wrap-anywhere">
                {entry.text}
              </p>
            </li>
          ))
        )}
      </ul>
      <form className="border-t border-paper-edge/80 px-4 py-3" onSubmit={handleSubmit}>
        <label className="block">
          <span className="sr-only">방명록 내용</span>
          <textarea
            ref={textareaRef}
            className="box-border w-full resize-none rounded-xl border border-paper-edge bg-white/70 px-3 py-2 text-[0.9rem] outline-none placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            maxLength={MAX_GUESTBOOK_TEXT}
            name="guestbook"
            onChange={(event) => setValue(event.currentTarget.value)}
            placeholder="오늘 방에 들른 기록을 남겨 보세요"
            rows={3}
            value={value}
          />
        </label>
        <button
          className="mt-2 w-full cursor-pointer rounded-full border-0 bg-ink px-3 py-2 text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          type="submit"
        >
          남기기
        </button>
      </form>
    </section>
  )
}
