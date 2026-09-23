# 에셋 출처

모이섬은 직접 하이폴리 모델링을 하지 않고, CC0 로우폴리 GLB와 낮은 폴리 지오메트리로 조립한다.

Kenney 에셋은 [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)이다. 출처 표기는 필수가 아니지만, 이 문서와 각 키트 폴더의 라이선스 사본을 둔다.

| 키트 | Kenney 페이지 | 원본 라이선스 사본 |
| --- | --- | --- |
| Pirate Kit 2.1 | [pirate-kit](https://kenney.nl/assets/pirate-kit) | `public/models/kenney-pirate/LICENSE.txt` |
| Mini Characters 1 | [mini-characters](https://kenney.nl/assets/mini-characters) | `public/models/kenney-mini/License.txt` |

## Kenney Pirate Kit

- 제작: [Kenney](https://kenney.nl)
- 받은 곳: [OpenGameArt — Pirate Kit](https://opengameart.org/content/pirate-kit) (`kenney_pirate-kit_2.1.zip`)
- 로컬 경로: `public/models/kenney-pirate/`

배·대포·해적기 GLB는 넣지 않았다. 다리 달린 플랫폼(`structure-fence.glb` 등)은 집으로 쓰지 않는다.

### 씬에 연결 (`src/scene/models.ts`)

| 파일 | 역할 |
| --- | --- |
| `palm-detailed-straight.glb` | 언덕 야자 |
| `palm-straight.glb` | 같은 자리의 작은 야자 |
| `structure-platform-dock.glb` | 북쪽 물가 부두 |
| `patch-sand.glb` | 부두 앞 모래 |
| `patch-grass.glb` | 야자 아래 풀 |
| `rocks-sand-a.glb` | 물가 바위 |
| `grass-plant.glb` | 가장자리 풀 포기 |
| `Textures/colormap.png` | 위 GLB가 참조하는 팔레트 |

### 저장만 (씬 미연결)

같은 키트에서 골라 두었지만, 현재 코드에서 로드하지 않는다.

| 파일 | 비고 |
| --- | --- |
| `structure-fence.glb` | 울타리 플랫폼 (과거 부유 이슈로 제외) |
| `structure.glb` | 구조물 베이스 |
| `structure-roof.glb` | 지붕 조각 |

## Kenney Mini Characters

- 제작: [Kenney](https://kenney.nl)
- 받은 곳: [OpenGameArt — Mini Character 1](https://opengameart.org/content/mini-character-1) (`kenney_mini-characters.zip`)
- 로컬 경로: `public/models/kenney-mini/`

걷기·서 있기 애니메이션이 GLB에 들어 있다.

### 입장에서 고르는 모습 (`src/world/looks.ts`)

| 파일 | 역할 |
| --- | --- |
| `character-female-a.glb` | 남색 |
| `character-female-f.glb` | 보라 |
| `character-male-b.glb` | 주황 |
| `character-male-c.glb` | 모자 |
| `previews/character-female-a.png` | 입장 캐러셀 |
| `previews/character-female-f.png` | 입장 캐러셀 |
| `previews/character-male-b.png` | 입장 캐러셀 |
| `previews/character-male-c.png` | 입장 캐러셀 |

### 저장만 (선택지 미연결)

키트 전체 캐릭터 GLB를 두었고, 나중에 외형을 늘릴 때 쓸 수 있다.

| 파일 |
| --- |
| `character-female-b.glb` |
| `character-female-c.glb` |
| `character-female-d.glb` |
| `character-female-e.glb` |
| `character-male-a.glb` |
| `character-male-d.glb` |
| `character-male-e.glb` |
| `character-male-f.glb` |

공통: `Textures/colormap.png` — 위 캐릭터 GLB가 참조하는 팔레트

## 지형과 집

섬은 풀밭이 물 위에 두껍게 올라오고, 모래 턱이 물에 잠기지 않으며, 절벽이 물 아래로 내려가게 만든다.  
마을 집 세 채는 낮은 폴리 오두막(벽·처마·굴뚝·문·창·화분)으로 내륙 광장 주위에 앉힌다. Kenney GLB가 아니다.  
주민은 둥근 씨 모양 몸이다. 플레이어는 Mini Characters 중 고른 모습이다.
