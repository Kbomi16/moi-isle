import { useCallback, useEffect, useRef, useState } from 'react'
import { IsleCanvas } from './scene/IsleCanvas.tsx'
import { ChatPanel } from './ui/ChatPanel.tsx'
import { Hud } from './ui/Hud.tsx'
import { NameGate } from './ui/NameGate.tsx'
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

type Bubble = {
  text: string
  until: number
}

export default function App() {
  const [nickname, setNickname] = useState<string | null>(null)
  const [lookId, setLookId] = useState<LookId | null>(null)
  const [roleId, setRoleId] = useState<RoleId | null>(null)
  const [proximity, setProximity] = useState<ProximityState>({
    namedIds: [],
    chatId: null,
  })
  const [playerBubble, setPlayerBubble] = useState<Bubble | null>(null)
  const [npcBubbles, setNpcBubbles] = useState<Record<string, Bubble>>({})
  const [chatLog, setChatLog] = useState<ChatLine[]>([])

  const playerPose = useRef(initialPlayerPose())
  const npcPoses = useRef(initialNpcPoses())
  const cameraYaw = useRef(0.7)
  const chatFocused = useRef(false)

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

  const handleEnter = (name: string, nextLookId: LookId, nextRoleId: RoleId) => {
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
    const targetId = nearestListenerId(playerPose.current, listeners, CHAT_RANGE)
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

  if (!entered) {
    return (
      <div className="relative h-full w-full select-none">
        <NameGate onEnter={handleEnter} />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full select-none">
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
      <Hud name={nickname} role={roleById(roleId).label} />
      <ChatPanel
        messages={chatLog}
        onFocusChange={handleFocusChange}
        onSend={handleSend}
      />
    </div>
  )
}
