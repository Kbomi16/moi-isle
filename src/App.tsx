import { useCallback, useEffect, useRef, useState } from 'react'
import { IsleCanvas } from './scene/IsleCanvas.tsx'
import { ChatBar } from './ui/ChatBar.tsx'
import { Hud } from './ui/Hud.tsx'
import { NameGate } from './ui/NameGate.tsx'
import {
  BUBBLE_MS,
  CHAT_RANGE,
  DUMMY_REPLY_MS,
  VILLAGERS,
} from './world/constants.ts'
import { nearestListenerId, normalizeChat } from './world/chat.ts'
import { isWithinRange } from './world/proximity.ts'
import { initialNpcPoses, initialPlayerPose } from './world/spawn.ts'
import type { ProximityState } from './scene/ProximitySensor.tsx'

type Bubble = {
  text: string
  until: number
}

export default function App() {
  const [nickname, setNickname] = useState<string | null>(null)
  const [proximity, setProximity] = useState<ProximityState>({
    namedIds: [],
    chatId: null,
  })
  const [playerBubble, setPlayerBubble] = useState<Bubble | null>(null)
  const [npcBubbles, setNpcBubbles] = useState<Record<string, Bubble>>({})

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

  const handleEnter = (name: string) => {
    playerPose.current = initialPlayerPose()
    npcPoses.current = initialNpcPoses()
    setNickname(name)
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
      setNpcBubbles((prev) => ({
        ...prev,
        [targetId]: { text: villager.reply, until: Date.now() + BUBBLE_MS },
      }))
    }, DUMMY_REPLY_MS)
  }

  const npcBubbleText = Object.fromEntries(
    VILLAGERS.map((villager) => [
      villager.id,
      npcBubbles[villager.id]?.text ?? null,
    ]),
  )

  return (
    <div className="isle">
      <IsleCanvas
        cameraYaw={cameraYaw}
        chatFocused={chatFocused}
        namedIds={proximity.namedIds}
        npcBubbles={npcBubbleText}
        npcPoses={npcPoses}
        onProximity={setProximity}
        playerBubble={playerBubble?.text ?? null}
        playerName={nickname}
        playerPose={playerPose}
      />
      {nickname ? (
        <>
          <Hud name={nickname} />
          {proximity.chatId ? (
            <ChatBar onFocusChange={handleFocusChange} onSend={handleSend} />
          ) : null}
        </>
      ) : (
        <NameGate onEnter={handleEnter} />
      )}
    </div>
  )
}
