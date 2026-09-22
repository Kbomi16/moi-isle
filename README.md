# 모이섬

이름을 고르고 마을에 들어온다. 걷고, 사람을 보고, `/`로 말하고, 내 방을 꾸민다.

Three.js 소셜 마을. 게임은 없다.  
범위는 [기획서](docs/기획서.md)가 기준이다.

## 지금 단계

기획을 2026-09-20 기준으로 다시 잡았다.  
웹소켓(Socket.IO)으로 다른 사람·대화·내 방을 맞추는 1차다. 구현은 그 기획서 순서를 따른다.

에셋 출처는 [credits](docs/credits.md)에 있다.

## Stack

- Bun
- Vite + React + TypeScript
- Three.js + React Three Fiber + Drei
- Socket.IO

## Setup

```bash
bun install
bun run dev
```

```bash
bun test
```

## Docs

- [기획서](docs/기획서.md) — 무엇을 만들고, 무엇을 만들지 않는가
- [에셋 출처](docs/credits.md) — 쓴 GLB와 라이선스
- [1차 구현 계획](docs/superpowers/plans/2026-09-05-mvp-walk-meet-talk.md)
