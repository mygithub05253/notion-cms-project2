# Invoice Web MVP 로드맵 및 개발 가이드

이 문서는 Invoice Web MVP 프로젝트의 로드맵 사용 방법과 개발 프로세스를 설명합니다.

---

## 빠른 시작

### 1단계: 로드맵 이해하기

**파일**: `/docs/ROADMAP.md`

로드맵은 4개 Phase로 구성됩니다:
- **Phase 1**: 애플리케이션 골격 (1주일)
- **Phase 2**: UI/UX 완성 (2-3주일)
- **Phase 3**: 핵심 기능 구현 (3-4주일)
- **Phase 4**: 최적화 및 배포 (1-2주일)

### 2단계: 작업 선택하기

로드맵에서 다음 작업을 선택:
1. "우선순위" 표시된 작업
2. 의존성이 완료된 작업
3. 현재 Phase에 포함된 작업

### 3단계: 작업 파일 확인하기

**디렉토리**: `/tasks/`

- **000-sample.md**: 작업 파일 템플릿
- **001-project-setup.md**: Task 001 상세 사항
- **README.md**: 작업 관리 가이드

### 4단계: 작업 구현하기

작업 파일의 "구현 체크리스트"를 따라 개발

### 5단계: 테스트 수행하기

- API/비즈니스 로직은 반드시 **테스트 체크리스트** 항목 수행
- Playwright MCP로 E2E 테스트 실행

### 6단계: 작업 완료하기

완료 후:
1. 작업 파일의 체크리스트 모두 체크 (✓)
2. "변경 사항 요약" 작성
3. ROADMAP.md에서 Task를 ✅로 표시

---

## 주요 용어 설명

### Phase (단계)

프로젝트를 논리적으로 구분한 큰 단계:
- Phase 1: 기초 구축
- Phase 2: UI 완성
- Phase 3: 기능 구현
- Phase 4: 마무리

### Task (작업)

Phase 내의 구체적인 구현 단위. 각 Task는:
- 명확한 목표와 요구사항
- 의존성 명시
- 예상 기간 표시
- 상세 구현 체크리스트

### Feature ID (기능 식별자)

PRD에서 정의한 기능 식별자 (F001-F012):
- F001: 관리자 인증
- F002: 견적서 조회
- ... (이하 PRD 참조)

---

## 개발 프로세스 상세

### 1. 작업 선택

ROADMAP.md에서:

```markdown
#### Task 001: 프로젝트 구조 및 라우팅 설정 (우선순위)

**상태**: 진행 예정
**의존성**: 없음
```

이 경우:
- "우선순위" 표시 → 지금 바로 시작
- "의존성: 없음" → 선행 작업 불필요
- "상태: 진행 예정" → 아직 시작하지 않음

### 2. 작업 파일 읽기

`/tasks/001-project-setup.md`를 열어:

```markdown
## 개요
작업의 핵심 목표 파악

## 요구사항
구현할 기능 명확히 함

## 구현 체크리스트
단계별 구현 방법 확인

## 수락 기준
완료 기준 확인
```

### 3. 코드 작성

작업 파일의 "관련 파일" 섹션을 따라:

```
새로 생성:
- /app/(protected)/layout.tsx
- /app/(protected)/dashboard/page.tsx

수정:
- /app/page.tsx
```

각 파일을 생성/수정합니다.

### 4. 구현 진행 추적

작업 파일의 "구현 상태" 섹션을 계속 업데이트:

```markdown
### 진행 상황 요약

- [x] 1단계: 기본 구조 설정
- [x] 2단계: 기능 구현
- [ ] 3단계: 스타일 및 UX
- [ ] 4단계: 테스트
```

### 5. 테스트 수행

API/비즈니스 로직 작업인 경우 "테스트 체크리스트" 수행:

```bash
# Playwright MCP 서버 실행
npm run mcp:playwright

# 테스트 시나리오 작성 및 실행
# 예: 로그인 플로우 E2E 테스트
```

### 6. 작업 완료

모든 항목 완료 후:

1. 작업 파일 체크리스트 모두 체크 ✓
2. "변경 사항 요약" 작성
3. ROADMAP.md 업데이트:

```markdown
- ✅ Task 001: 프로젝트 구조 설정
```

---

## 구조 우선 접근법 (Structure-First Approach)

이 프로젝트는 **구조 우선 접근법**을 사용합니다:

### 개념

실제 기능 구현보다 **애플리케이션의 전체 구조와 골격을 먼저 완성**합니다.

### 순서

1. **Phase 1**: 라우팅, 레이아웃, 타입 정의 (골격)
2. **Phase 2**: 모든 페이지 UI 완성 (껍데기)
3. **Phase 3**: 데이터 연동 및 기능 구현 (살)
4. **Phase 4**: 최적화 및 배포 (마무리)

### 장점

- 중복 작업 최소화
- 병렬 개발 가능 (UI팀과 백엔드팀 독립)
- 변경에 유연함
- 초기에 전체 앱 플로우 체험 가능

### 개발 팀 협업

이 구조로 인해:

- **UI 개발자**: Phase 2 진행 중 백엔드 API 완성 대기
- **백엔드 개발자**: Phase 1 완료 후 API 개발 착수
- **통합 테스터**: Phase 3에서 E2E 테스트 담당

---

## 의존성 관리

### 의존성 확인

각 작업의 "의존성" 필드:

```markdown
**의존성**: Task 001, Task 002
```

이 경우 Task 001과 Task 002가 먼저 완료되어야 합니다.

### 의존성 없는 작업 우선

**병렬 개발 가능**:

```
Task 001 (의존성: 없음)
├─ Task 002 (의존성: Task 001)
├─ Task 003 (의존성: Task 001)
└─ Task 004 (의존성: Task 002, 003)
```

이 경우:
- Task 001부터 시작
- Task 002, 003은 Task 001 완료 후 동시 진행 가능
- Task 004는 Task 002, 003 모두 완료 후 시작

---

## E2E 테스트 (Playwright MCP)

### 언제 테스트하는가?

다음 작업들에서 반드시 E2E 테스트 수행:

- Task 013: API 클라이언트
- Task 014: 인증 시스템
- Task 015: 견적서 조회
- Task 016: CRUD 기능
- Task 017: 공유 링크
- Task 018: PDF 다운로드
- Task 019: 통합 테스트

### 테스트 방법

각 작업 파일의 "테스트 체크리스트" 섹션:

```markdown
## 테스트 체크리스트 (Playwright MCP)

### 기본 플로우 테스트

- [ ] 로그인 플로우: 이메일 입력 → 비밀번호 입력 → 로그인 → 대시보드
  1. http://localhost:3000 접근
  2. 이메일 입력 필드에 admin@example.com 입력
  3. 비밀번호 입력 필드에 password123 입력
  4. "로그인" 버튼 클릭
  5. 예상 결과: http://localhost:3000/dashboard로 리디렉션
```

### Playwright 실행

```bash
# 개발 서버 실행 (별도 터미널)
npm run dev

# 다른 터미널에서 Playwright MCP 실행
npm run mcp:playwright

# Playwright 테스트 코드 작성 및 실행
# 예: 로그인 플로우 테스트
```

---

## 파일 구조 참고

### 프로젝트 루트

```
invoice-web/
├── app/                    # Next.js App Router
├── components/             # React 컴포넌트
├── lib/                    # 유틸리티 함수
├── hooks/                  # React 훅
├── store/                  # Zustand 상태 관리
├── types/                  # TypeScript 타입
├── docs/                   # 문서
│   ├── PRD.md             # 프로젝트 요구사항
│   ├── ROADMAP.md         # 개발 로드맵 (이 문서)
│   └── ROADMAP_GUIDE.md   # 로드맵 사용 가이드
└── tasks/                  # 작업 상세 파일
    ├── README.md          # 작업 관리 가이드
    ├── 000-sample.md      # 템플릿
    ├── 001-project-setup.md
    └── ... (이하 동일)
```

### 페이지 라우트

```
/                          # 로그인 페이지
/dashboard                 # 대시보드 (관리자)
/invoices                  # 견적서 목록 (관리자)
/invoices/new              # 새 견적서 (관리자)
/invoices/[id]             # 견적서 상세 (관리자)
/share/[token]             # 공유 목록 (클라이언트)
/share/[token]/invoices/[id]  # 공유 상세 (클라이언트)
```

---

## 자주 확인하는 항목

### 빌드 전 체크

```bash
# TypeScript 에러 확인
npm run build

# ESLint 확인
npm run lint
```

### 로컬 개발 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저 열기
# http://localhost:3000
```

### 성능 확인

- Lighthouse: Chrome DevTools
- 페이지 로드 시간: DevTools Network 탭
- 번들 크기: `npm build` 후 `.next/static` 확인

---

## 문제 해결

### "Task XXX가 뭔가요?"

→ `/docs/ROADMAP.md`에서 Task 번호 검색

### "의존성이 뭔가요?"

→ 해당 Task를 시작하기 전에 먼저 완료해야 할 Task

### "테스트를 어떻게 작성하나요?"

→ `/tasks/README.md`의 "테스트 체크리스트 작성 가이드" 참고

### "작업 파일을 어떻게 수정하나요?"

→ 작업 중 마주친 내용을 파일의 "참고 사항" 섹션에 기록

### "새 Task가 필요하면?"

→ ROADMAP.md의 "요약" 섹션에 Task 추가 후, `/tasks`에 파일 생성

---

## 개발 팀 체크리스트

### 프로젝트 시작 전

- [ ] ROADMAP.md 전체 읽음
- [ ] `/tasks/README.md` 읽음
- [ ] `/tasks/000-sample.md`와 `/tasks/001-project-setup.md` 확인
- [ ] 로컬에서 `npm install` 및 `npm run dev` 확인
- [ ] 기술 스택 이해 (Next.js, TypeScript, shadcn/ui, Zustand 등)

### 작업 시작 전 (매 Task마다)

- [ ] ROADMAP.md에서 Task 요구사항 확인
- [ ] 의존성 작업 완료 확인
- [ ] `/tasks/XXX-description.md` 파일 읽음
- [ ] "수락 기준" 명확히 이해
- [ ] 필요한 기술/라이브러리 사전 학습

### 작업 중

- [ ] 체크리스트 항목을 하나씩 완료
- [ ] 완료한 항목에 체크 표시 (✓)
- [ ] 문제 발생 시 작업 파일에 기록

### 작업 완료 후

- [ ] 모든 체크리스트 항목 완료 확인
- [ ] "변경 사항 요약" 작성
- [ ] `npm run build` 및 `npm run lint` 성공 확인
- [ ] 테스트 통과 (해당사항 있음)
- [ ] ROADMAP.md 업데이트
- [ ] 다음 Task 선택

---

## 리소스

### 문서

- **PRD**: `/docs/PRD.md` - 프로젝트 요구사항 명세서
- **CLAUDE.md**: `/CLAUDE.md` - 프로젝트 개발 가이드
- **로드맵**: `/docs/ROADMAP.md` - 전체 개발 로드맵 (이 파일)
- **작업 가이드**: `/tasks/README.md` - 작업 파일 작성 및 관리 방법

### 기술 스택 문서

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Zustand**: https://github.com/pmndrs/zustand
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev
- **Playwright**: https://playwright.dev

---

## 연락처

- **질문**: 이 가이드의 "문제 해결" 섹션 참고
- **버그 신고**: 해당 작업 파일의 "참고 사항" 섹션
- **팀 논의**: 필요 시 작업 파일에 기록

---

**문서 버전**: 1.0
**작성일**: 2026년 1월 16일
**마지막 업데이트**: 2026년 1월 16일
