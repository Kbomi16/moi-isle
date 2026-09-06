# 모이섬 1차 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 작은 섬에서 닉네임으로 들어와 WASD로 걷고, 더미 방문객에게 다가가 근접 텍스트로 한두 마디 나눌 수 있게 한다.

**Architecture:** 게임 규칙(섬 경계, 걷기, 거리, 채팅 전달, 더미 순찰)은 React/Three에 의존하지 않는 `src/world/` 순수 함수로 둔다. R3F 씬은 그 결과를 매 프레임 적용하고, HUD는 캔버스 위 HTML이다. 실제 멀티플레이 서버는 넣지 않는다.

**Tech Stack:** Bun, Vite, React 19, TypeScript, Three.js, React Three Fiber, Drei, bun:test

## Global Constraints

- 직접 블렌더 모델링하지 않는다. 1차는 지오메트리로 섬 비율만 맞춘다.
- 점프·달리기·클릭 이동·음성·로그인·이모트·꾸미기·상점·수집을 넣지 않는다.
- 대화는 근접 범위 안에서만 전달한다. 전역 채팅창을 두지 않는다.
- 카피는 짧게, 한국어. 닉네임 칸 문구는 `이름`, 입장 `섬으로`, 힌트 `WASD로 걷기`, 채팅 `말하기`.
- 더미 닉네임은 `방문객`. 플레이어 말에 가까우면 `안녕` 한 줄만 답한다.
- 애니메이션 라이브러리를 추가하지 않는다.
- 커밋은 사용자가 요청할 때만 한다.

## File Structure

- `src/world/constants.ts` — 반경, 속도, 거리, 색
- `src/world/island.ts` — 섬 안으로 위치 클램프
- `src/world/movement.ts` — 카메라 기준 WASD 걷기
- `src/world/proximity.ts` — XZ 거리
- `src/world/nickname.ts` — 닉네임 정규화
- `src/world/chat.ts` — 메시지 정규화, 청취자 판정
- `src/world/dummy.ts` — 웨이포인트 순찰
- `src/scene/*.tsx` — 섬, 랜드마크, 플레이어, 더미, 카메라
- `src/ui/*.tsx` — 이름 칸, HUD, 채팅 입력
- `src/App.tsx` — 세션 조립
- `src/world/*.test.ts` — bun:test

---

### Task 1: 테스트 러너와 섬 경계

**Files:**
- Modify: `package.json`
- Create: `src/world/constants.ts`
- Create: `src/world/island.ts`
- Test: `src/world/island.test.ts`

**Interfaces:**
- Consumes: 없음
- Produces: `ISLAND_WALK_RADIUS`, `clampToIsland(position: Vec2, radius: number): Vec2`, `type Vec2 = { x: number; z: number }`

- [ ] **Step 1: `package.json`에 test 스크립트**

```json
"test": "bun test"
```

- [ ] **Step 2: 실패하는 섬 클램프 테스트**

```ts
import { describe, expect, test } from 'bun:test'
import { clampToIsland } from './island.ts'
import { ISLAND_WALK_RADIUS } from './constants.ts'

describe('clampToIsland', () => {
  test('섬 안 좌표는 그대로 둔다', () => {
    expect(clampToIsland({ x: 3, z: -2 }, ISLAND_WALK_RADIUS)).toEqual({
      x: 3,
      z: -2,
    })
  })

  test('섬 밖 좌표는 가장자리로 끌어온다', () => {
    const clamped = clampToIsland({ x: 100, z: 0 }, ISLAND_WALK_RADIUS)
    expect(clamped.z).toBeCloseTo(0)
    expect(clamped.x).toBeCloseTo(ISLAND_WALK_RADIUS)
    expect(Math.hypot(clamped.x, clamped.z)).toBeCloseTo(ISLAND_WALK_RADIUS)
  })
})
```

- [ ] **Step 3: 테스트 실행 — 모듈 없음으로 실패하는지 확인**

Run: `bun test src/world/island.test.ts`

- [ ] **Step 4: constants + clamp 구현**

`ISLAND_GRASS_RADIUS = 16`, `ISLAND_WALK_RADIUS = 15.2`, `ISLAND_SAND_RADIUS = 18.2`. `clampToIsland`는 원점 기준 수평 거리로 자른다.

- [ ] **Step 5: 테스트 통과 확인**

Run: `bun test src/world/island.test.ts`

---

### Task 2: 카메라 기준 걷기

**Files:**
- Create: `src/world/movement.ts`
- Test: `src/world/movement.test.ts`

**Interfaces:**
- Consumes: `Vec2`, `ISLAND_WALK_RADIUS`, `WALK_SPEED`, `clampToIsland`
- Produces: `walkVector(input, cameraYaw)`, `stepWalk(position, input, cameraYaw, dt, speed, radius)`

- [ ] **Step 1: 실패하는 걷기 테스트**

`cameraYaw = 0`일 때 전진은 -Z, 우향은 +X. 대각선은 정규화되어 속도가 빨라지지 않는다. `dt = 1`, `speed = 2`로 섬 밖으로 나가려 하면 반지름 안에 남는다. 입력이 없으면 위치와 yaw를 유지한다.

- [ ] **Step 2: 테스트 실패 확인**

Run: `bun test src/world/movement.test.ts`

- [ ] **Step 3: walkVector / stepWalk 구현**

- [ ] **Step 4: 테스트 통과 확인**

---

### Task 3: 닉네임·근접·채팅·더미 순찰

**Files:**
- Create: `src/world/nickname.ts`, `proximity.ts`, `chat.ts`, `dummy.ts` + 각 `.test.ts`

**Interfaces:**
- Produces: `normalizeNickname`, `distanceXZ`, `isWithinRange`, `normalizeChat`, `listenerIdsInRange`, `stepDummy`
- `NAME_RANGE = 6`, `CHAT_RANGE = 3.2`, `MAX_NICKNAME = 10`, `MAX_CHAT = 40`
- 더미 웨이포인트: `(0, 13.5)`, `(-6, 4)`
- 더미 속도: `0.9`

- [ ] **Step 1: 각 모듈 실패 테스트 → 구현 → 통과**

닉네임: 공백 트림, 빈 값 `null`, 10자 초과는 자른다.  
채팅: 트림 후 빈 값 `null`, 40자에서 자른다.  
청취: 범위 안 id만 반환.  
더미: 목표에 가까우면 다음 웨이포인트 인덱스로 넘긴다.

---

### Task 4: 섬 씬과 임시 캐릭터

**Files:**
- Create: `src/scene/Island.tsx`, `Landmarks.tsx`, `Player.tsx`, `DummyVisitor.tsx`, `FollowCamera.tsx`, `ActorMarkup.tsx`, `IsleCanvas.tsx`
- Modify: `src/index.css`, `index.html`

**Interfaces:**
- Consumes: world 상수와 step 함수
- Produces: 전체화면 Canvas. 플레이어/더미 pose ref. 카메라 yaw ref.

지오메트리 섬: 물 평면, 모래 원기둥, 풀 원기둥, 나무 하나, 부두 하나, 벤치 하나.  
플레이어/더미는 캡슐 + 짧은 코. 색은 `--player` / `--dummy`.  
OrbitControls를 쓰지 않는다. 드래그로 yaw만 돌린다.  
채팅 입력이 포커스면 걷지 않는다.

색: sky `#8ec4e0`, water `#4e96b8`, sand `#e6d0a0`, grass `#6fa86c`, foliage `#3f7a48`, trunk `#7a5a3a`, dock `#c4a574`, player `#e4b56a`, dummy `#6a9cbf`, ink `#3d4a3c`, paper `#f4efe4`.

---

### Task 5: 이름 칸, HUD, 근접 대화

**Files:**
- Create: `src/ui/NameGate.tsx`, `Hud.tsx`, `ChatBar.tsx`
- Modify: `src/App.tsx`, `src/index.css`

입장 전에도 섬과 더미가 보인다. 이름 칸은 하단 작은 종이 카드.  
입장 후 HUD: 닉네임 + `WASD로 걷기`.  
`NAME_RANGE` 안이면 상대 닉네임, `CHAT_RANGE` 안이면 채팅 입력.  
말풍선은 캐릭터 위. 플레이어 말이 더미에게 들리면 0.8초 뒤 `안녕`.  
입력 포커스 중 WASD는 이동에 쓰이지 않는다.

---

### Task 6: README와 문서 단계 표시

**Files:**
- Modify: `README.md` — 지금 단계를 1차 MVP로 갱신
- Modify: `docs/기획서.md` 상태는 초안 유지, 구현 계획 링크만 README Docs에 추가
