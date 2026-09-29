import { useCallback, useEffect, useRef, useState } from 'react'
import { IsleCanvas } from './scene/IsleCanvas.tsx'
import { RoomCanvas } from './scene/RoomCanvas.tsx'
import { ChatPanel } from './ui/ChatPanel.tsx'
import { Guestbook } from './ui/Guestbook.tsx'
import { Hud } from './ui/Hud.tsx'
import { NameGate } from './ui/NameGate.tsx'
import { RoomHud } from './ui/RoomHud.tsx'
import { ROOM_ROUTE, useRoute } from './ui/useRoute.ts'
import {
  BUBBLE_MS,
  CHAT_RANGE,
  DUMMY_REPLY_MS,
  VILLAGERS,
} from './world/constants.ts'
import { nearestListenerId, normalizeChat } from './world/chat.ts'
import {
  appendChatLine,
  createChatLineId,
  type ChatLine,
} from './world/chatLog.ts'
import { isWithinRange } from './world/proximity.ts'
import { lookById, lookUrl } from './world/looks.ts'
import type { LookId } from './world/looks.ts'
import { roleById } from './world/roles.ts'
import type { RoleId } from './world/roles.ts'
import { writeStoredProfile } from './world/session.ts'
import { initialNpcPoses, initialPlayerPose } from './world/spawn.ts'
import type { ProximityState } from './scene/ProximitySensor.tsx'

/** 3D 말풍선에 잠깐 보여줄 텍스트와 만료 시각 */
type Bubble = {
  text: string
  until: number
}

/** 입장 게이트 ↔ 섬(캔버스·HUD·채팅) 전환과 채팅·NPC 응답 오케스트레이션 */
export default function App() {
  const [nickname, setNickname] = useState<string | null>(null)
  const [lookId, setLookId] = useState<LookId | null>(null)
  const [roleId, setRoleId] = useState<RoleId | null>(null)
  // ProximitySensor → 근처 주민 이름표·채팅 대상 id
  const [proximity, setProximity] = useState<ProximityState>({
    namedIds: [],
    chatId: null,
  })
  const [playerBubble, setPlayerBubble] = useState<Bubble | null>(null)
  const [npcBubbles, setNpcBubbles] = useState<Record<string, Bubble>>({})
  const [chatLog, setChatLog] = useState<ChatLine[]>([])
  const [guestbookOpen, setGuestbookOpen] = useState(false)

  // R3F 쪽에서 매 프레임 갱신 — React state로 옮기지 않음
  const playerPose = useRef(initialPlayerPose())
  const npcPoses = useRef(initialNpcPoses())
  const cameraYaw = useRef(0.7)
  const chatFocused = useRef(false)
  const { path, navigate } = useRoute()

  // 말풍선 until 만료 시 state 정리 (매 프레임 setState 방지)
  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now()
      setPlayerBubble((current) =>
        current && current.until <= now ? null : current,
      )
      setNpcBubbles((current) => {
        let changed = false
        const next: Record<string, Bubble> = {}
        for (const [id, bubble] of Object.entries(current)) {
          if (bubble.until > now) {
            next[id] = bubble
          } else {
            changed = true
          }
        }
        return changed ? next : current
      })
    }, 250)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (path !== ROOM_ROUTE) {
      setGuestbookOpen(false)
    }
  }, [path])

  // NameGate 제출 — sessionStorage 저장 후 월드·채팅 초기화
  const handleEnter = (
    name: string,
    nextLookId: LookId,
    nextRoleId: RoleId,
  ) => {
    writeStoredProfile(name, nextRoleId)
    playerPose.current = initialPlayerPose()
    npcPoses.current = initialNpcPoses()
    setNickname(name)
    setLookId(nextLookId)
    setRoleId(nextRoleId)
    setChatLog([])
  }

  const handleFocusChange = useCallback((focused: boolean) => {
    chatFocused.current = focused
  }, [])

  // 채팅 전송 — 플레이어 말풍선·로그, CHAT_RANGE 안 가장 가까운 주민 더미 답장
  const handleSend = (raw: string) => {
    const text = normalizeChat(raw)
    if (!text) {
      return
    }

    const now = Date.now()
    setPlayerBubble({ text, until: now + BUBBLE_MS })
    setChatLog((prev) =>
      appendChatLine(prev, {
        id: createChatLineId(),
        speaker: nickname ?? '나',
        text,
        at: now,
      }),
    )

    const listeners = VILLAGERS.flatMap((villager) => {
      const pose = npcPoses.current[villager.id]
      return pose ? [{ id: villager.id, position: pose }] : []
    })
    const targetId = nearestListenerId(
      playerPose.current,
      listeners,
      CHAT_RANGE,
    )
    if (!targetId) {
      return
    }
    const villager = VILLAGERS.find((entry) => entry.id === targetId)
    if (!villager) {
      return
    }

    window.setTimeout(() => {
      const current = npcPoses.current[targetId]
      if (!current || !isWithinRange(playerPose.current, current, CHAT_RANGE)) {
        return
      }
      const replyAt = Date.now()
      setNpcBubbles((prev) => ({
        ...prev,
        [targetId]: { text: villager.reply, until: replyAt + BUBBLE_MS },
      }))
      setChatLog((prev) =>
        appendChatLine(prev, {
          id: createChatLineId(),
          speaker: villager.name,
          text: villager.reply,
          at: replyAt,
        }),
      )
    }, DUMMY_REPLY_MS)
  }

  const npcBubbleText = Object.fromEntries(
    VILLAGERS.map((villager) => [
      villager.id,
      npcBubbles[villager.id]?.text ?? null,
    ]),
  )

  const entered = nickname !== null && lookId !== null && roleId !== null

  // 입장하지 않은 경우
  if (!entered) {
    return (
      <div className="relative h-full w-full select-none">
        <NameGate onEnter={handleEnter} />
      </div>
    )
  }

  // 입장한 경우
  return (
    <div className="relative h-full w-full select-none">
      {path === ROOM_ROUTE ? (
        <>
          <RoomCanvas />
          <RoomHud
            guestbookOpen={guestbookOpen}
            name={nickname}
            onGuestbookToggle={() => setGuestbookOpen((open) => !open)}
            onLeave={() => navigate('/')}
          />
          {guestbookOpen ? (
            <Guestbook
              author={nickname}
              onClose={() => setGuestbookOpen(false)}
            />
          ) : null}
        </>
      ) : (
        <>
          <IsleCanvas
            cameraYaw={cameraYaw}
            chatFocused={chatFocused}
            namedIds={proximity.namedIds}
            npcBubbles={npcBubbleText}
            npcPoses={npcPoses}
            onProximity={setProximity}
            playerBubble={playerBubble?.text ?? null}
            lookUrl={lookUrl(lookById(lookId).file)}
            playerName={nickname}
            playerPose={playerPose}
          />
          <Hud
            name={nickname}
            onOpenRoom={() => navigate(ROOM_ROUTE)}
            role={roleById(roleId).label}
          />
          <ChatPanel
            messages={chatLog}
            onFocusChange={handleFocusChange}
            onSend={handleSend}
          />
        </>
      )}
    </div>
  )
}
