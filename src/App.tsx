import { useCallback, useEffect, useRef, useState } from 'react'
import { IsleCanvas } from './scene/IsleCanvas.tsx'
import { ChatBar } from './ui/ChatBar.tsx'
import { Hud } from './ui/Hud.tsx'
import { NameGate } from './ui/NameGate.tsx'
import {
  BUBBLE_MS,
  CHAT_RANGE,
  DUMMY_REPLY,
  DUMMY_REPLY_MS,
} from './world/constants.ts'
import { isChatOpenKey, listenerIdsInRange, normalizeChat } from './world/chat.ts'
import { isWithinRange } from './world/proximity.ts'
import { initialDummyPose, initialPlayerPose } from './world/spawn.ts'
import type { ProximityState } from './scene/ProximitySensor.tsx'

type Bubble = {
  text: string
  until: number
}

export default function App() {
  const [nickname, setNickname] = useState<string | null>(null)
  const [proximity, setProximity] = useState<ProximityState>({
    name: false,
  })
  const [chatOpen, setChatOpen] = useState(false)
  const [playerBubble, setPlayerBubble] = useState<Bubble | null>(null)
  const [dummyBubble, setDummyBubble] = useState<Bubble | null>(null)

  const playerPose = useRef(initialPlayerPose())
  const dummyPose = useRef(initialDummyPose())
  const cameraYaw = useRef(0.7)
  const chatFocused = useRef(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now()
      setPlayerBubble((current) =>
        current && current.until <= now ? null : current,
      )
      setDummyBubble((current) =>
        current && current.until <= now ? null : current,
      )
    }, 250)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!nickname) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isChatOpenKey(event)) {
        return
      }
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return
      }
      event.preventDefault()
      setChatOpen(true)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nickname])

  const handleEnter = (name: string) => {
    playerPose.current = initialPlayerPose()
    setNickname(name)
  }

  const handleFocusChange = useCallback((focused: boolean) => {
    chatFocused.current = focused
  }, [])

  const handleCloseChat = useCallback(() => {
    setChatOpen(false)
    chatFocused.current = false
  }, [])

  const handleSend = (raw: string) => {
    const text = normalizeChat(raw)
    if (!text) {
      return
    }

    const now = Date.now()
    setPlayerBubble({ text, until: now + BUBBLE_MS })

    const heard = listenerIdsInRange(
      playerPose.current,
      [{ id: 'dummy', position: dummyPose.current }],
      CHAT_RANGE,
    )
    if (!heard.includes('dummy')) {
      return
    }

    window.setTimeout(() => {
      if (!isWithinRange(playerPose.current, dummyPose.current, CHAT_RANGE)) {
        return
      }
      setDummyBubble({ text: DUMMY_REPLY, until: Date.now() + BUBBLE_MS })
    }, DUMMY_REPLY_MS)
  }

  return (
    <div className="isle">
      <IsleCanvas
        cameraYaw={cameraYaw}
        chatFocused={chatFocused}
        dummyBubble={dummyBubble?.text ?? null}
        dummyPose={dummyPose}
        onProximity={setProximity}
        playerBubble={playerBubble?.text ?? null}
        playerName={nickname}
        playerPose={playerPose}
        showDummyName={proximity.name}
      />
      {nickname ? (
        <>
          <Hud name={nickname} />
          {chatOpen ? (
            <ChatBar
              onClose={handleCloseChat}
              onFocusChange={handleFocusChange}
              onSend={handleSend}
            />
          ) : null}
        </>
      ) : (
        <NameGate onEnter={handleEnter} />
      )}
    </div>
  )
}
