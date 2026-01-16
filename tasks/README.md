# 작업 관리 가이드 (Tasks Directory)

이 디렉토리는 Invoice Web MVP 프로젝트의 세부 작업 파일들을 포함합니다. 각 작업 파일은 ROADMAP.md에서 정의된 Task를 상세하게 설명합니다.

---

## 디렉토리 구조

```
/tasks/
├── README.md (이 파일)
├── 000-sample.md (작업 템플릿 - 모든 작업이 따르는 형식)
├── 001-project-setup.md (Task 001: 프로젝트 구조 및 라우팅)
├── 002-type-definitions.md (Task 002: 타입 정의)
├── 003-layout-skeleton.md (Task 003: 레이아웃 골격)
├── 004-ui-components.md (Task 004: UI 컴포넌트)
├── ... (이하 동일한 형식)
└── 023-documentation.md (Task 023: 문서화)
```

---

## 작업 파일 작성 규칙

### 파일명 규칙

- 형식: `XXX-description.md`
- XXX: 3자리 작업 번호 (001, 002, 003, ...)
- description: 영문 소문자, 하이픈으로 단어 구분

### 예시

```
001-project-setup.md
002-type-definitions.md
012-api-client.md
023-documentation.md
```

---

## 작업 파일 구조

모든 작업 파일은 다음 섹션을 포함해야 합니다:

```markdown
# Task XXX: [한국어 작업 제목]

**우선순위**: [높음/중상/중/중하] | **의존성**: [Task XXX, Task YYY] | **기대 기간**: [1-2일]

---

## 개요
작업의 핵심 목표 (한 문단)

---

## 요구사항

### 기능 요구사항
- 구현할 기능 나열

### 기술 요구사항
- 사용 기술 명시

---

## 관련 파일

생성/수정할 파일 목록

---

## 구현 체크리스트

### 1단계: [단계명]
- [ ] 세부 구현 항목
- [ ] 세부 구현 항목

### 2단계: [단계명]
- [ ] 세부 구현 항목

... (N단계까지)

---

## 테스트 체크리스트 (API/비즈니스 로직 작업의 경우)

**Playwright MCP를 사용한 E2E 테스트**

### 기본 플로우 테스트
- [ ] 시나리오 설명

### 에러 처리 테스트
- [ ] 에러 시나리오

### 성능 테스트
- [ ] 성능 기준

---

## 수락 기준

작업 완료의 조건:
1. 기능 완성
2. 테스트 통과
3. 코드 품질

---

## 구현 상태

### 진행 상황 요약
- [ ] 1단계
- [ ] 2단계
- [ ] 3단계

### 변경 사항 요약
작업 완료 후 기입:
- 생성/수정 파일 요약
- 주요 변경사항
- 알려진 문제

---

## 참고 자료
관련 문서 및 링크
```

---

## 작업 진행 프로세스

### 1. 작업 파일 생성

새 작업을 시작할 때:

1. `/tasks/000-sample.md` 템플릿 참고
2. 새 파일 생성: `XXX-description.md`
3. 모든 섹션 작성
4. ROADMAP.md에 Task 정보 기반으로 작성

### 2. 작업 수행

작업 파일을 따라 구현:

1. **구현 체크리스트** 항목을 하나씩 체크
2. 각 단계 완료 후 진행 상황 업데이트
3. API/비즈니스 로직은 **테스트 체크리스트** 항목도 수행
4. Playwright MCP로 E2E 테스트 실행

```bash
# Playwright MCP 서버 실행
npm run mcp:playwright
```

### 3. 작업 완료

작업이 완료되었을 때:

1. **구현 상태** 섹션 완성:
   - 모든 체크리스트 항목에 체크 표시
   - "변경 사항 요약" 작성
2. ROADMAP.md에서 해당 Task에 ✅ 표시
3. 작업 파일의 "상태" 필드를 "완료 ✅"로 변경

---

## 상태 표시 규칙

### 작업 상태

- **진행 예정**: 아직 시작하지 않음
- **진행 중**: 현재 작업 중
- **완료 ✅**: 모든 항목 완료 및 테스트 통과

### 체크리스트 상태

- **[ ]**: 미완료 (기본)
- **[x]**: 완료

### ROADMAP.md 상태

```markdown
- Task 001: 프로젝트 구조 (우선순위) → 시작 예정
- ✅ Task 001: 프로젝트 구조 → 완료된 작업
- Task 002: 타입 정의 → 진행 중
```

---

## 테스트 체크리스트 작성 가이드 (API/비즈니스 로직)

모든 API 연동 및 비즈니스 로직 구현 작업에는 **테스트 체크리스트** 필수:

### 기본 플로우 테스트

```markdown
- [ ] 사용자 시나리오: [구체적인 설명]
  1. [단계 1]
  2. [단계 2]
  3. [예상 결과]
```

### 에러 처리 테스트

```markdown
- [ ] 에러 시나리오: [조건]
  - 예상 동작: [에러 메시지]
```

### Playwright 코드 예시

```typescript
// 기본 로그인 플로우 테스트
test('사용자가 로그인할 수 있다', async (page) => {
  await page.goto('http://localhost:3000')
  await page.fill('[name="email"]', 'admin@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button:has-text("로그인")')

  // 대시보드로 리디렉션 확인
  await expect(page).toHaveURL('http://localhost:3000/dashboard')
  await expect(page.locator('text=대시보드')).toBeVisible()
})
```

---

## 자주 묻는 질문 (FAQ)

### Q: 작업 중에 새로운 의존성이 발견되면?

A: 작업 파일의 "의존성" 섹션을 업데이트하고, 필요하다면 다른 Task의 순서를 조정하세요. ROADMAP.md도 함께 업데이트하세요.

### Q: 작업 중에 스코프가 변경되면?

A:
1. 작업 파일의 "요구사항" 섹션 업데이트
2. 필요하면 새 Task로 분할 고려
3. ROADMAP.md의 해당 Task 설명 업데이트

### Q: 테스트는 어떻게 실행하는가?

A:
```bash
# Playwright MCP 서버 실행 (백그라운드)
npm run mcp:playwright

# 또는 테스트 실행 (프로젝트의 test 명령어가 있으면)
npm test
```

### Q: 작업 파일을 어디까지 상세하게 작성해야 하는가?

A: 다른 개발자가 작업 파일만 읽고도 구현할 수 있는 수준으로 작성하세요. 애매한 부분이 있으면 PRD를 참고하거나 팀 논의를 거치세요.

---

## 예시

### 완료된 작업 파일 (000-sample.md)

위의 "000-sample.md" 파일이 완료된 작업의 예시입니다:
- 모든 체크리스트에 체크 표시
- "변경 사항 요약" 섹션 작성
- 상태: "완료 ✅"

### 진행 중인 작업 파일 (001-project-setup.md)

"001-project-setup.md" 파일이 진행 예정 작업의 예시입니다:
- 아직 체크 표시 없음
- "변경 사항 요약" 섹션 비어있음
- 상태: "진행 예정"

---

## 체크리스트 항목 작성 팁

### 좋은 예

- [ ] `/app/(protected)/dashboard/page.tsx` 생성: 대시보드 레이아웃 포함
- [ ] React Hook Form으로 폼 구현: 검증 에러 메시지 표시
- [ ] Playwright로 전체 로그인 플로우 E2E 테스트: 성공/실패 시나리오

### 나쁜 예

- [ ] 페이지 구현
- [ ] 기능 추가
- [ ] 테스트

체크리스트는 **구체적이고 측정 가능**해야 합니다.

---

## 빠른 참고

### 작업 생성 단계

```bash
# 1. 새 작업 파일 생성
cp tasks/000-sample.md tasks/XXX-description.md

# 2. 파일 편집 및 요구사항 정의

# 3. 빌드 및 개발 서버 실행
npm run build  # 타입 체크
npm run dev    # 개발 서버 (localhost:3000)

# 4. Playwright MCP로 테스트 (필요시)
npm run mcp:playwright

# 5. 작업 완료 후 ROADMAP.md 업데이트
```

### 디렉토리 구조 확인

```bash
# tasks 디렉토리 내 모든 파일 확인
ls -la tasks/

# 특정 Task 파일 확인
cat tasks/001-project-setup.md
```

---

## 연락처 및 지원

- **질문 사항**: ROADMAP.md 또는 CLAUDE.md 참고
- **문제 발생**: 해당 작업 파일의 "참고 자료" 섹션 확인
- **팀 논의**: 작업 파일의 "참고 사항" 섹션에 기록

---

**마지막 업데이트**: 2026년 1월 16일
**버전**: 1.0
