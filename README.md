# 모이섬

이름을 고르고 마을에 들어온다. 걷고, 사람을 보고, `/`로 말하고, 내 방을 꾸민다.

Three.js 소셜 마을. 게임은 없다.  
범위는 [기획서](docs/기획서.md)가 기준이다.

## 지금 단계

섬의 다른 접속자·이동·`/` 말풍선은 Socket.IO로 맞춘다. 내 방 동기화(`myRoomChange`)와 남의 방 방문은 아직이다.

에셋 출처는 [credits](docs/credits.md)에 있다.

## Stack

- Bun
- Vite + React + TypeScript
- Three.js + React Three Fiber + Drei
- Socket.IO

## Setup

```bash
bun install
bun run server
bun run dev
```

`server`는 Socket.IO(`:3001`)다. Vite가 `/socket.io`를 그쪽으로 넘긴다. 다른 탭에서 같은 주소로 들어가면 서로 보인다.

```bash
bun test
```

## Docs

- [기획서](docs/기획서.md) — 무엇을 만들고, 무엇을 만들지 않는가
- [에셋 출처](docs/credits.md) — 쓴 GLB와 라이선스
- [1차 구현 계획](docs/superpowers/plans/2026-09-05-mvp-walk-meet-talk.md)
