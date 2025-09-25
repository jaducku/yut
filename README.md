
# Yut

## 윷놀이 규칙 (개발 관점 요약)

### 구성품

* 윷가락 4개(평평/둥근 면), 팀당 말 4개, 말판(십자+대각 경로, 일반적으로 29 지점)

### 던지기 결과(이동 칸 수)

* **Do(도)**: 1칸
* **Gae(개)**: 2칸
* **Geol(걸)**: 3칸
* **Yut(윷)**: 4칸 → *추가로 한 번 더 던지기*
* **Mo(모)**: 5칸 → *추가로 한 번 더 던지기*

### 턴 진행

* 각 팀은 윷을 던지고 **하나의 말**을 선택하여 나온 수만큼 전진
* 한 번의 던지기에서 나온 수치를 **여러 말로 분할**할 수 없음

### 진로 선택

* 코너/중앙 등의 **큰 지점**에 정확히 멈추면 **지름길(대각 경로)** 선택 가능

### 잡기/합치기

* **잡기**: 상대 말이 있는 칸에 도착하면 상대 말은 시작점으로, **추가로 한 번 더 던지기**
* **합치기(쌓기)**: 아군 말은 동일 칸에서 묶어 하나처럼 이동 가능(리스크: 한 번에 모두 잡힘)

### 승리 조건

* 팀 말 4개를 모두 한 바퀴 돌아 **완주**하면 승리
* 지역/가정별 변형 규칙은 **옵션**으로 노출 권장(예: 정확히 도착해야 완주, 넘어도 완주 등)

---

## 프로젝트 구조 및 개발 지침 초안

초기 프로토타입은 PNPM 워크스페이스 기반으로 구성했습니다. 루트에서 아래 명령을 사용하면 3D 클라이언트 앱을 실행/검증할 수 있습니다.

```bash
pnpm install        # 의존성 설치 (인터넷 접속 필요)
pnpm dev            # 기본 클라이언트(yut-client) 개발 서버 실행
pnpm lint           # ESLint 기반 코드 규약 검사
pnpm test           # Vitest 단위 테스트 실행
```

### apps/yut-client

* **Vite + React + TypeScript** 환경으로 구성된 3D 클라이언트.
* **three.js / React Three Fiber / drei** 조합으로 윷판, 조명, 카메라 궤도를 표현.
* **zustand** 상태 관리로 던지기/턴/기록 스토어를 구성하고, 규칙 모듈(`src/game/logic.ts`)에 윷 결과 테이블과 테스트를 정의.
* **WebGPU → WebGL2 폴백** 전략을 준비하기 위해 `src/renderer/createRenderer.ts`에서 브라우저 지원 정보를 탐지.
* 테스트(`pnpm --filter yut-client test`)는 던지기 결과(도/개/걸/윷/모) 및 말 초기화 로직을 검증.

후속 단계에서는 Colyseus 기반 멀티플레이, WebXR, 물리엔진(Rapier) 등을 `apps` 혹은 `packages` 디렉터리에 추가해 확장할 계획입니다.

## 3) Web 기반 3D 개발 최신 기술 스택 (제안)

### 렌더링/엔진

* **WebGPU(우선)** + **WebGL2(폴백)** 전략
* **three.js** 또는 **Babylon.js** (WebGPU 지원 현황 고려)
* 대안/에디터 지향: **PlayCanvas**

### React 생태계(선택)

* **React Three Fiber(R3F)** — 선언적 three.js 구성
* **@react-three/drei** — 카메라/컨트롤/텍스트 등 유틸 컴포넌트

### XR 확장(옵션)

* **WebXR Device API**로 VR/AR 세션 지원(AR에서 실제 공간에 윷판 배치)

### 물리/충돌

* **Rapier(rapier.js/wasm)** — 고성능 WASM 물리엔진
* 대안: **cannon-es**(경량), **ammo.js**(Bullet 기반)

### 멀티플레이/네트워킹(옵션)

* **Colyseus** — 권위 서버(authoritative), 동기화/매치메이킹 내장
* **Socket.IO** — 저지연 이벤트 전송, 재연결/폴백 제공
* **Cloudflare Durable Objects** — 룸/세션 상태를 엣지에 유지(서버리스)

### 에셋 파이프라인

* **glTF 2.0/GLB** 표준(“3D의 JPEG”) 채택
* 모델링 → **Blender glTF Exporter**로 PBR 머티리얼 포함 내보내기
* 압축/최적화: **Draco**(지오메트리), **meshoptimizer**(meshopt), **KTX2/BasisU**(텍스처)

### 성능/런타임

* **WebAssembly(WASM)** 로 물리/연산 가속
* **OffscreenCanvas + Web Workers** 로 파싱/렌더 분리
* **Vite + TypeScript** 개발 환경, 런타임 **Bun** 또는 **Node.js**
* **Web Audio API** 로 던지기/충돌/완주 사운드 연출

### 구현 체크리스트(요약)

* 렌더러: `WebGPU → (폴백) WebGL2` 자동 선택
* 규칙 엔진: **던지기 결과 테이블** + **추가 던지기(윷/모)** + **잡기/합치기** + **지름길 선택** 상태머신화
* 에셋: glTF/GLB + KTX2 + Draco/meshopt 파이프라인
* 멀티: Colyseus(권장) 또는 Socket.IO + Durable Objects(상태 보관)
* XR 옵션: WebXR 기반 AR 보드 배치 모드

---
