# 카드 짝 맞추기

서로 같은 그림의 카드를 찾아 모든 짝을 맞추는 브라우저 게임입니다. 쉬움 12장·보통 16장·어려움 24장과 동물·과일/식물·이모지·기술 테마를 지원합니다. 첫 카드를 뒤집으면 timer가 시작되며 완료 시간과 시도 횟수를 난이도별로 이 브라우저에 저장합니다. 소리·밝은/어두운 화면·게임 링크 공유를 지원합니다.

## 실행

Node.js 22 이상과 npm이 필요합니다. API key·계정·환경 파일·backend 설정은 필요하지 않습니다.

```sh
npm ci --ignore-scripts
npm run dev -- --host 127.0.0.1
```

표시된 localhost URL을 브라우저에서 엽니다. 정적 배포 파일은 다음 명령으로 생성합니다.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

`dist/`를 HTTPS 정적 hosting에 배포할 수 있습니다. Vite dev/preview server는 로컬 확인용입니다. lockfile과 CI action commit SHA를 고정했으며 CI는 push/PR에 읽기 권한만 사용합니다.

## 사용 흐름

난이도와 테마를 고른 뒤 카드를 두 장씩 뒤집습니다. 짝이 다르면 잠시 보여 준 뒤 되돌리고, 같으면 열린 상태로 남깁니다. 새 게임으로 전환하면 이전 판정·되돌림·완료 창 예약 작업을 취소합니다. 카드에는 키보드로 접근해 Enter/Space로 뒤집을 수 있으며 그림 이름은 앞면일 때만 읽힙니다. 공유 메뉴의 링크/공유 문구 복사는 Clipboard API를 사용합니다. Twitter·Facebook 선택은 해당 외부 공유 페이지를 엽니다.

## 기록과 개인정보

저장소 key는 `card-puzzle-best-records`, `card-puzzle-theme`, `card-puzzle-muted`입니다. 네트워크로 점수나 사용자 정보를 보내지 않으며 가짜 기록·이용자·랭킹을 넣지 않았습니다. 기록 key가 손상되었거나 읽기 권한이 없으면 기존 bytes를 자동으로 덮어쓰거나 삭제하지 않습니다. 이때 저장 실패 안내를 표시하며 현재 세션에서만 기록을 유지합니다.

## 검증 범위와 한계

로컬 Node 26.8.1에서 clean install, typecheck, 11개 자동 test, production build, npm audit와 redacted secret scan을 실행했습니다. 자동 test의 synthetic 입력·고정 board는 `tests/`에만 있으며 production seed나 공개 사용자 기록으로 사용하지 않습니다. 공개 원격 CI·hosting 실행은 source 준비와 별도입니다.

게임은 `Math.random()` 기반으로 카드를 섞습니다. 암호학적 추첨이나 돈이 걸린 게임을 위한 난수·공정성 보증을 제공하지 않습니다. 최고 기록은 이 브라우저의 개인 기록이며 서버 랭킹·다른 이용자 기록·동기화 기능은 없습니다. Clipboard와 native share는 브라우저 권한 및 HTTPS/localhost 지원이 필요하며 거절 시 안내합니다. Twitter/Facebook/native 공유 완료 여부는 외부 서비스의 결과에 달려 있습니다.

## 라이선스

First-party source는 MIT입니다. 기존 notice를 보존했으며 `RIGHTS.md`와 `THIRD_PARTY_NOTICES.md`에 실제 포함된 package·SVG·Unicode 문자 권리를 기록했습니다. 사진·raster·외부 font·과거 운영 문서·원본 ZIP·비밀 설정은 포함하지 않았습니다.
