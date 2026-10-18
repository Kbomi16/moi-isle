type RoomHudProps = {
  name: string
  onLeave: () => void
  guestbookOpen: boolean
  onGuestbookToggle: () => void
  canEdit: boolean
  editMode: boolean
  onEditToggle: () => void
}

export function RoomHud({
  name,
  onLeave,
  guestbookOpen,
  onGuestbookToggle,
  canEdit,
  editMode,
  onEditToggle,
}: RoomHudProps) {
  return (
    <div className="pointer-events-auto absolute top-4 left-[1.1rem] z-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          aria-label="섬으로 돌아가기"
          className="cursor-pointer rounded-full border border-paper-edge bg-paper/85 px-3 py-1 text-[0.82rem] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          onClick={onLeave}
          type="button"
        >
          ← 섬
        </button>
        <button
          aria-expanded={guestbookOpen}
          aria-label={guestbookOpen ? '방명록 닫기' : '방명록 열기'}
          className="cursor-pointer rounded-full border border-paper-edge bg-paper/85 px-3 py-1 text-[0.82rem] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          onClick={onGuestbookToggle}
          type="button"
        >
          방명록
        </button>
        {canEdit ? (
          <button
            aria-pressed={editMode}
            aria-label={editMode ? '꾸미기 끄기' : '꾸미기 켜기'}
            className="cursor-pointer rounded-full border border-paper-edge bg-paper/85 px-3 py-1 text-[0.82rem] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            onClick={onEditToggle}
            type="button"
          >
            꾸미기
          </button>
        ) : null}
      </div>
      <p className="mt-2 mb-0 text-[1.05rem]">{name}의 방</p>
      {canEdit ? null : (
        <p className="mt-1 mb-0 text-[0.78rem] text-ink-soft">
          가구와 기술스택은 볼 수만 있습니다.
        </p>
      )}
    </div>
  )
}
