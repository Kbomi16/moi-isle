import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { createGuestbookId } from '../src/world/guestbook.ts'
import {
  parseInitialize,
  parseMyRoomChange,
  parseNewText,
  parsePose,
  type ExitNotice,
  type InitializeAck,
  type IslePlayer,
  type RoomSnapshot,
  type TextEvent,
} from '../src/world/realtime.ts'
import {
  dropPlayer,
  listPlayers,
  movePlayer,
  upsertPlayer,
  type PlayerBook,
} from './players.ts'
import {
  appendRoomGuestbook,
  dropRoom,
  ensureRoom,
  listRooms,
  replaceRoomLayout,
  seedRoomGuestbook,
  type RoomBook,
} from './rooms.ts'

const PORT = Number(process.env.PORT ?? 3001)

let book: PlayerBook = new Map()
let rooms: RoomBook = new Map()

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: true },
})

const broadcastPlayers = () => {
  io.emit('players', listPlayers(book))
}

const emitRoom = (id: string) => {
  const room = rooms.get(id)
  if (!room) {
    return
  }
  const snapshot: RoomSnapshot = { id, ...room }
  io.emit('room', snapshot)
}

io.on('connection', (socket) => {
  socket.on('initialize', (raw: unknown) => {
    const parsed = parseInitialize(raw)
    if (!parsed) {
      return
    }

    const player: IslePlayer = { id: socket.id, ...parsed }
    const isNew = !book.has(socket.id)
    book = upsertPlayer(book, player)
    rooms = ensureRoom(rooms, socket.id)

    const ack: InitializeAck = {
      selfId: socket.id,
      players: listPlayers(book),
      rooms: listRooms(rooms),
    }
    socket.emit('initialize', ack)
    if (isNew) {
      socket.broadcast.emit('enter', player)
    }
    broadcastPlayers()
  })

  socket.on('move', (raw: unknown) => {
    const pose = parsePose(
      typeof raw === 'object' && raw !== null && 'pose' in raw
        ? (raw as { pose: unknown }).pose
        : raw,
    )
    if (!pose || !book.has(socket.id)) {
      return
    }
    book = movePlayer(book, socket.id, pose)
    broadcastPlayers()
  })

  socket.on('myRoomChange', (raw: unknown) => {
    const parsed = parseMyRoomChange(raw)
    const player = book.get(socket.id)
    if (!parsed || !player) {
      return
    }

    if (parsed.kind === 'layout') {
      const next = replaceRoomLayout(
        rooms,
        socket.id,
        parsed.items,
        parsed.stacks,
      )
      if (next === rooms) {
        return
      }
      rooms = next
      emitRoom(socket.id)
      return
    }

    if (parsed.kind === 'guestbookSeed') {
      const next = seedRoomGuestbook(rooms, socket.id, parsed.entries)
      if (next === rooms) {
        return
      }
      rooms = next
      emitRoom(socket.id)
      return
    }

    const next = appendRoomGuestbook(rooms, parsed.roomId, {
      id: createGuestbookId(),
      author: player.nickname,
      text: parsed.text,
      at: Date.now(),
    })
    if (!next) {
      return
    }
    rooms = next
    emitRoom(parsed.roomId)
  })

  socket.on('newText', (raw: unknown) => {
    const text = parseNewText(raw)
    const player = book.get(socket.id)
    if (!text || !player) {
      return
    }
    const event: TextEvent = {
      id: player.id,
      nickname: player.nickname,
      text,
      at: Date.now(),
    }
    io.emit('newText', event)
  })

  socket.on('disconnect', () => {
    const player = book.get(socket.id)
    if (!player) {
      return
    }
    book = dropPlayer(book, socket.id)
    rooms = dropRoom(rooms, socket.id)
    const notice: ExitNotice = { id: player.id, nickname: player.nickname }
    io.emit('exit', notice)
    broadcastPlayers()
  })
})

httpServer.listen(PORT, () => {
  console.log(`moi-isle socket listening on :${PORT}`)
})
