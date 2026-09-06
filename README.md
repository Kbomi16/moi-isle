# 모이섬

작은 섬에 들어와, 걷고, 만나고, 이야기한다.

Three.js로 만드는 소셜 마을.  
다른 사람이 같은 땅에 서서 가까이 가면 대화하는 것이 목표다.

레퍼런스는 [모여봐요 동물의 숲](https://www.nintendo.co.kr/software/switch/acbaa/)의 **만남 리듬**이다. 꾸미기·상점·수집은 베끼지 않는다.

자세한 범위, MVP, 에셋 원칙은 [기획서](docs/기획서.md)에 있다.

## 지금 단계

1차 MVP. 이름만 적으면 섬에 선다. WASD로 걷고, `/` 를 누르면 말할 수 있다.  
섬은 Kenney Pirate Kit(CC0) GLB로 야자·부두·물가를 조립했다. 실제 다른 사람 접속은 아직 없다.

에셋 출처는 [credits](docs/credits.md)에 있다.

구현 순서는 기획서 [15. 다음에 할 일](docs/기획서.md#15-다음에-할-일-구현-순서)을 따른다.

## Stack

- Bun
- Vite + React + TypeScript
- Three.js + React Three Fiber + Drei

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
