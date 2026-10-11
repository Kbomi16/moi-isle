import { createServer } from 'node:http'
import { Server } from 'socket.io'
import {
  parseInitialize,
  parseNewText,
  parsePose,
  type ExitNotice,
  type InitializeAck,
  type IslePlayer,
  type TextEvent,
} from '../src/world/realtime.ts'
import {
  dropPlayer,
  listPlayers,
  movePlayer,
  upsertPlayer,
  type PlayerBook,
} from './players.ts'

const PORT = Number(process.env.PORT ?? 3001)

let book: PlayerBook = new Map()

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: true },
})

const broadcastPlayers = () => {
  io.emit('players', listPlayers(book))
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

    const ack: InitializeAck = {
      selfId: socket.id,
      players: listPlayers(book),
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
    const notice: ExitNotice = { id: player.id, nickname: player.nickname }
    io.emit('exit', notice)
    broadcastPlayers()
  })
})

httpServer.listen(PORT, () => {
  console.log(`moi-isle socket listening on :${PORT}`)
})
