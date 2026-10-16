# Cottoncandy Diary · 솜사탕 다이어리

현재의 솜사탕 투두를 바탕으로 확장할 개인 다이어리 프로젝트입니다.
이 저장소는 기존 `react-home`에서 이름을 변경했습니다.

## 이번 정리 범위

- `todolist/` 안의 Vite 앱과 실행 설정을 저장소 루트로 이동했습니다.
- 앱 진입부, 투두 기능, 스타일을 나누고 import 경로를 수정했습니다.
- 기존 화면과 투두 동작, localStorage 키 `cotton_candy_todos_v1`을 유지합니다.
- 새 기능, Tailwind 전환, DB/API 구현, 실제 클라우드 배포는 이번 작업에 포함하지 않습니다.

## 폴더 구조

```text
src/
  main.jsx                     React 진입점
  app/
    App.jsx                    기존 투두 상태·저장·화면 조합
  features/
    todos/
      constants.js             기존 카테고리
      components/
        Header.jsx             날짜·시계·달성률
        Editor.jsx             할 일 입력
        TodoList.jsx           목록·검색·필터·정렬
        TodoItem.jsx           개별 항목·수정·삭제
  styles/
    global.css                 전역 스타일
    app.css                    기존 앱 스타일
index.html
package.json
package-lock.json
vite.config.js
eslint.config.js
vercel.json
```

## 현재 구현 / 향후 구성

| 구분 | 현재 | 향후 방향 |
| --- | --- | --- |
| 프런트엔드 | React + Vite | React 유지 |
| 스타일 | 기존 일반 CSS | Tailwind 도입 예정, 현재 미설치 |
| 저장 | 브라우저 localStorage | Neon PostgreSQL 연동 예정, 현재 미구현 |
| 서버/API | 없음 | Vercel Functions의 루트 `api/`에서 구현 예정 |
| DB 코드 | 없음 | 서버 전용 `server/db/`에서 관리 예정 |
| 서비스 기능 | 투두 CRUD, 카테고리, 검색, 상태 필터, 정렬, 완료 항목 정리, 시계·달성률·알림 | 다이어리 기능 확장 예정, 현재 미구현 |
| 배포 | 루트에서 Vite 빌드 가능하도록 설정 | Vercel 사용 |

`api/`, `server/db/`는 구현 시 생성할 위치이며 지금은 빈 코드나 SDK를 추가하지 않았습니다.
새 다이어리 기능은 `src/features/` 아래 기능별 폴더에 배치합니다.
Neon 접속 정보는 나중에 서버 환경변수로만 설정하며, 브라우저에 노출되는 `VITE_` 변수나 프런트엔드 코드에 넣지 않습니다.
Supabase는 이 프로젝트의 예정 구성에 포함하지 않습니다.

## 로컬 실행

Node.js 22.12 이상 또는 24 LTS를 사용합니다. 기존 lockfile과 의존성 버전을 유지합니다.
저장소 루트에서 실행합니다.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
npm run lint
```

## Vercel 배포 설정

GitHub의 `jyuus-maker/cottoncandy-diary`를 가져와 다음 값으로 배포합니다.

| 항목 | 값 |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | 저장소 루트 (`.`), `todolist` 지정 금지 |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| 환경변수 / DB 연결 | 현재 필요 없음 |

빌드·출력 설정은 루트 `vercel.json`에도 명시했습니다.
현재는 DB 없이 기존 투두가 동작하며 저장 데이터는 접속한 주소와 브라우저별로 보관됩니다.
GitHub Pages의 Jekyll 배포 설정은 Vercel 배포와 별개입니다.

## 솜사탕 룰렛

`src/features/wheel/`에서 관리하는 정적 유틸리티입니다. 상단 도구 메뉴로 투두와 전환합니다.

- `Wheel.jsx`: 선택지 입력, SVG 룰렛, 회전/정지, 결과 및 다시 돌리기
- `wheel.js`: 선택지 파싱, 색상, 당첨 칸 정렬 계산
- `wheel.css`: 기존 솜사탕 테마에 맞춘 기능 전용 스타일
- 목록 저장 키는 원본과 같은 `lunch_roulette_list`를 사용합니다.
- 선택지를 한 줄씩 입력하고, 회전 중 STOP을 누르면 무작위로 뽑힌 칸에서 감속 정지합니다.
- 결과는 AI 대기 없이 즉시 표시하며 고정 문구를 사용합니다. Gemini SDK, API 키, 네트워크 호출, DB가 필요 없습니다.
- 원본은 다른 저장소에 보존되어 있으므로 참고용 점메추 폴더는 통합 후 제거했습니다.
- 현재 일반 CSS를 사용하며 Tailwind 도입은 여전히 미구현 상태입니다.

### 책갈피 메뉴
- 최외곽 카드 위에 투두·룰렛 책갈피를 나란히 배치합니다.
- 호버 또는 키보드 포커스 시 우상단으로 살짝 올라가며 시계 방향으로 기울어집니다.
