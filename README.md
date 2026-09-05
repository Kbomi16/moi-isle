# 모이섬

작은 섬에 들어와, 걷고, 만나고, 이야기한다.

Three.js로 만드는 소셜 마을.  
다른 사람이 같은 땅에 서서 가까이 가면 대화하는 것이 목표다.

레퍼런스는 [모여봐요 동물의 숲](https://www.nintendo.co.kr/software/switch/acbaa/)의 **만남 리듬**이다. 꾸미기·상점·수집은 베끼지 않는다.

자세한 범위, MVP, 에셋 원칙은 [기획서](docs/기획서.md)에 있다.

## 지금 단계

스캐폴드. 원형 바닥과 상자 마커만 있는 빈 섬이다.  
캐릭터·걷기·대화·멀티플레이는 아직 없다.

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

## Docs

- [기획서](docs/기획서.md) — 무엇을 만들고, 무엇을 만들지 않는가
