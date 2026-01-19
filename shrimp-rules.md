# Invoice Web Phase 2 Development Guidelines

AI 에이전트를 위한 프로젝트 특화 개발 규칙 문서입니다.

## Project Overview

**프로젝트명**: Invoice Web MVP
**현재 단계**: Phase 2 - UI/UX 마크업 완성 (Task 005-011)
**목표**: 모든 주요 페이지의 정적 마크업 및 스타일링 완성
**기술 스택**: Next.js 16.1.1, TypeScript, Tailwind CSS v4, shadcn/ui, React Hook Form, Zod, Sonner

**Phase 2 범위**:
- Task 005: 로그인 페이지 검증
- Task 006: 대시보드 UI
- Task 007: 견적서 생성/수정 폼
- Task 008: 견적서 상세 조회
- Task 009-010: 공개 페이지 UI
- Task 011: 에러 처리 및 알림 통합

---

## Project Architecture

### 디렉토리 구조 (필수 준수)

```
invoice-web/
├── app/                           # Next.js App Router
│   ├── page.tsx                   # 로그인 페이지 (public)
│   ├── layout.tsx                 # 루트 레이아웃
│   └── (protected)/               # 인증 필요 페이지 그룹
│       ├── layout.tsx             # 대시보드 레이아웃 (AppLayout)
│       ├── dashboard/
│       │   └── page.tsx           # 대시보드
│       ├── invoices/
│       │   ├── new/
│       │   │   └── page.tsx       # 견적서 생성
│       │   └── [id]/
│       │       └── page.tsx       # 견적서 상세/수정
│       └── share/
│           └── [token]/
│               ├── page.tsx       # 공개 목록
│               └── invoices/
│                   └── [id]/
│                       └── page.tsx # 공개 상세
├── components/                    # UI 컴포넌트 라이브러리
│   ├── ui/                        # shadcn/ui 기본 컴포넌트
│   ├── layout/                    # 레이아웃 컴포넌트
│   │   ├── app-layout.tsx
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── container.tsx
│   └── features/                  # 기능 컴포넌트
│       ├── empty-state.tsx        # ✓ Task 004
│       ├── items-table.tsx        # ✓ Task 004
│       ├── invoice-card.tsx       # ✓ Task 004
│       ├── invoice-table.tsx      # ✓ Task 004
│       └── confirm-dialog.tsx     # ✓ Task 004
├── lib/
│   ├── mock-data.ts               # ✓ Mock 데이터
│   └── utils.ts
├── types/
│   └── index.ts                   # ✓ 타입 정의
└── public/
```

---

## Code Standards

### 명명 규칙

- **변수/함수**: `camelCase`
- **컴포넌트/클래스/인터페이스**: `PascalCase`
- **상수**: `UPPER_SNAKE_CASE`
- **파일명**: kebab-case (컴포넌트는 예외, PascalCase)

### 주석 규칙

- **모든 주석/문서**: 한국어로 작성
- **변수/함수명**: 영어로 작성
- JSDoc 사용: 컴포넌트와 공용 함수에 필수

### TypeScript 규칙

- **Strict Mode** 필수
- `any` 타입 금지
- Props 인터페이스 명시적 정의

---

## Phase 2 Specific Rules (Task 005-011)

### 허용되는 작업

- ✅ 정적 마크업 생성
- ✅ Tailwind CSS 스타일링
- ✅ shadcn/ui 컴포넌트 사용
- ✅ Props 인터페이스 정의
- ✅ Mock 데이터 표시
- ✅ 플레이스홀더 이벤트 핸들러 (`onClick={() => {}}`)
- ✅ TODO 주석 작성

### 금지되는 작업

- ❌ useState/useReducer (상태 관리)
- ❌ useEffect (부수 효과)
- ❌ API 호출/fetch
- ❌ 실제 이벤트 로직 구현
- ❌ Zustand 스토어 생성
- ❌ 비즈니스 로직
- ❌ CSS-in-JS (Tailwind만 사용)

### Mock 데이터 사용

- **위치**: lib/mock-data.ts
- **사용**: 모든 페이지에서 import하여 표시

### 반응형 디자인

- **Mobile First**: 작은 화면부터 큰 화면으로
- **브레이크포인트**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Tailwind 클래스**: `md:`, `lg:` prefix 사용

### 접근성 (WCAG AA)

- **라벨**: 모든 입력 필드에 `<Label>` 또는 `htmlFor` 속성
- **의미론적 HTML**: `<button>`, `<a>`, `<form>` 등 올바른 요소 사용
- **키보드 네비게이션**: 모든 버튼/링크는 탭으로 포커스 가능

---

## Styling Standards

### Tailwind CSS 규칙

- **Mobile First**: 기본 CSS는 모바일을 위해, 큰 화면은 prefix 사용
- **색상**: Tailwind 기본 팔레트 사용
- **클래스 병합**: `cn()` 함수 사용
  ```typescript
  import { cn } from '@/lib/utils';
  className={cn("base-class", condition && "conditional")}
  ```

### shadcn/ui 사용

- **import**: `@/components/ui/...`에서만 import
- **variant**: new-york 스타일 (기본 설정)
- **추가 클래스**: `className` prop으로 확장

### Dark Mode

- **라이브러리**: next-themes (이미 통합)
- **클래스**: Tailwind `dark:` prefix 사용
- **예시**: `bg-white dark:bg-slate-950`

---

## Prohibited Actions

### 절대 금지

1. **상태 관리**: useState, useReducer, Zustand 금지
2. **데이터 페칭**: fetch, axios, API 라우트 금지
3. **복잡한 로직**: 비즈니스 로직, 계산 함수 금지
4. **실제 이벤트**: 실제 동작 구현 금지 (플레이스홀더만 사용)
5. **스타일링**: CSS-in-JS, 인라인 스타일 금지
6. **구조 변경**: 디렉토리 변경, 파일 삭제/이동 금지

---

## File Change Guidelines

### 수정할 파일 (Phase 2)

| 파일 | Task | 변경사항 |
|------|------|---------|
| app/page.tsx | 005 | 로그인 페이지 검증 |
| app/(protected)/dashboard/page.tsx | 006 | 대시보드 완성 |
| app/(protected)/invoices/new/page.tsx | 007 | 폼 UI |
| app/(protected)/invoices/[id]/page.tsx | 007, 008 | 폼 UI, 상세 조회 |
| app/(protected)/share/[token]/page.tsx | 009 | 목록 UI |
| app/(protected)/share/[token]/invoices/[id]/page.tsx | 010 | 상세 UI |

### 이미 완성된 컴포넌트 (Task 004)

- ✅ components/features/empty-state.tsx
- ✅ components/features/items-table.tsx
- ✅ components/features/invoice-card.tsx
- ✅ components/features/invoice-table.tsx
- ✅ components/features/confirm-dialog.tsx
- ✅ lib/mock-data.ts
- ✅ types/index.ts

---

## Build Verification

### 빌드 검증

```bash
npm run build
```

**성공 기준**:
- ✅ TypeScript 에러 0개
- ✅ 모든 라우트 생성됨
- ✅ npm run dev로 시각적 검증 완료

---

**최종 목표**: Phase 2 완료 시 모든 주요 페이지 UI 완성
**다음 단계**: Task 005 → Task 006 → ... → Task 011
