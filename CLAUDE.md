# CLAUDE.md

Claude Code (claude.ai/code) 개발 가이드

## Project Context

프로젝트 개발 시 다음 문서를 참고하세요:

- **PRD 문서**: @/docs/PRD.md
- **개발 로드맵**: @/docs/ROADMAP.md

## 프로젝트 개요

**Invoice Web MVP**는 견적서 발급자(관리자)와 수신자(클라이언트) 간의 견적서 관리를 디지털화한 웹 플랫폼입니다.

상세한 프로젝트 요구사항은 @/docs/PRD.md를 참조하세요.

## 개발 환경 및 명령어

### 주요 명령어
- **개발 서버**: `npm run dev` (http://localhost:3000)
- **프로덕션 빌드**: `npm run build`
- **빌드 결과 실행**: `npm start`
- **린트 검사**: `npm run lint`
- **Playwright MCP**: `npm run mcp:playwright`

### 빌드 및 타입 체크
- Next.js는 빌드 시 자동으로 TypeScript 타입 검사를 수행합니다
- `npm run build` 실패 → TypeScript 에러가 있으므로 수정 필요

## 아키텍처 및 디렉토리 구조

### 루트 레벨 구조
```
claude-nextjs-starters/
├── app/                    # Next.js App Router (Server Components 기본)
│   ├── layout.tsx         # 루트 레이아웃 (테마 및 토스터 통합)
│   ├── page.tsx           # 홈페이지
│   └── (dashboard)/       # 라우트 그룹 - 대시보드 섹션
│       ├── layout.tsx     # 대시보드 레이아웃 (사이드바, 네비게이션)
│       ├── components/    # 컴포넌트 라이브러리 페이지
│       ├── form-example/  # React Hook Form + Zod 예제
│       ├── table-example/ # 테이블 컴포넌트 예제
│       ├── dialog-example/# 다이얼로그 컴포넌트 예제
│       └── grid-example/  # 그리드 레이아웃 예제
├── components/            # 컴포넌트 라이브러리
│   ├── ui/                # shadcn/ui 재사용 가능 컴포넌트 (원자 단위)
│   ├── layout/            # 레이아웃 및 구조 컴포넌트
│   └── features/          # 비즈니스 로직을 포함한 기능 컴포넌트
├── lib/                   # 유틸리티 함수 및 상수
├── hooks/                 # 커스텀 React 훅 (use-sidebar.ts 등)
├── store/                 # Zustand 전역 상태 관리 (use-ui-store.ts 등)
├── providers/             # Context Providers (theme-provider.tsx 등)
├── types/                 # TypeScript 타입 정의 (index.ts)
├── node_modules/          # 의존성
├── public/                # 정적 자산 (이미지, 폰트 등)
└── package.json           # 프로젝트 메타데이터 및 스크립트

```

### 핵심 기술 스택

**프론트엔드:**
- **Framework**: Next.js 16.1.1 (App Router, Server Components 우선, React 19.2.3)
- **UI Library**: shadcn/ui + Radix UI (접근성 기본 제공)
- **Styling**: Tailwind CSS v4 + Tailwind Merge
- **상태관리**: Zustand
- **폼 처리**: React Hook Form + Zod (유효성 검사)
- **알림**: Sonner (토스트 알림)
- **테마**: next-themes (라이트/다크 모드)
- **아이콘**: Lucide React
- **유틸리티**: usehooks-ts, date-fns, clsx, class-variance-authority

**개발:**
- **언어**: TypeScript (Strict Mode)
- **린팅**: ESLint 9
- **Node**: 20+

## 개발 패턴 및 주의사항

### App Router 및 Server Component 원칙
1. **모든 컴포넌트는 기본적으로 Server Component**입니다
   - 클라이언트 전용 기능(상태, 이벤트 핸들러 등)이 필요하면 `'use client'` 지시어 추가
   - 예: 폼, 토스터, 다이얼로그 등의 인터랙션

2. **폴더 구조**
   - `(dashboard)` 같은 괄호 표기는 라우트 그룹으로, URL에 영향을 주지 않음
   - 예: `/app/(dashboard)/form-example/page.tsx` → `http://localhost:3000/form-example`

### 컴포넌트 구조 원칙
프로젝트는 Atomic Design 원칙을 기반으로 컴포넌트를 계층적으로 구조화합니다:

1. **컴포넌트/ui/** - shadcn/ui 및 Radix UI 기반 재사용 컴포넌트
   - 개별 UI 원소 (Button, Card, Dialog, Input 등)
   - 비즈니스 로직 없음, 스타일링 중심
   - 예: `components/ui/button.tsx`, `components/ui/dialog.tsx`

2. **컴포넌트/layout/** - 페이지 레이아웃 및 구조 컴포넌트
   - 전체 레이아웃 구조 (AppLayout, Sidebar, Header 등)
   - 하위 컴포넌트 조합으로 구성
   - 예: `components/layout/app-layout.tsx`, `components/layout/sidebar.tsx`

3. **컴포넌트/features/** - 기능별 비즈니스 컴포넌트
   - 비즈니스 로직을 포함한 상위 컴포넌트 (ThemeToggle, MobileNav 등)
   - 하나 이상의 UI 컴포넌트를 조합하여 기능 구현
   - 예: `components/features/theme-toggle.tsx`, `components/features/user-nav.tsx`

### Tailwind CSS + shadcn/ui
- shadcn/ui 컴포넌트는 `components/ui/` 폴더에 위치
- Tailwind의 class 충돌 방지를 위해 `cn()` 유틸리티 사용
  ```typescript
  import { cn } from '@/lib/utils';

  className={cn("base-class", condition && "conditional-class")}
  ```

### 폼 및 유효성 검사
- React Hook Form + Zod 조합 사용
- Zod 스키마 먼저 정의 → React Hook Form에서 resolver로 활용
- 예제는 `app/(dashboard)/form-example/page.tsx` 참고

### 테마 구현
- `next-themes` 라이브러리로 라이트/다크 모드 관리
- 루트 레이아웃(`app/layout.tsx`)에서 ThemeProvider 및 기본 설정 필수

### 상태 관리 (Zustand)
- 복잡한 전역 상태가 필요한 경우에만 사용
- 간단한 로컬 상태는 `useState` 선호
- 예제: `store/use-ui-store.ts` (UI 상태 관리)

### Providers 패턴
프로젝트에서는 Context API와 함께 Provider 컴포넌트를 통해 전역 설정을 관리합니다:

1. **providers/ 디렉토리** - 재사용 가능한 Provider 정의
   - `theme-provider.tsx`: next-themes 라이브러리 래퍼
   - 테마 설정(라이트/다크 모드) 관리

2. **app/layout.tsx에서 Provider 통합**
   ```typescript
   <ThemeProvider>
     <Providers>
       {children}
     </Providers>
   </ThemeProvider>
   ```

3. **새로운 Provider 추가 시 주의사항**
   - 루트 레이아웃에서 필수 providers만 통합
   - 성능 영향 고려 (과도한 provider 중첩 피하기)

### 타입 정의 관리
TypeScript 타입을 효율적으로 관리하기 위한 패턴:

1. **types/ 디렉토리** - 프로젝트 전역 타입
   - `types/index.ts`: 공용 인터페이스 및 타입 정의
   - 여러 파일에서 사용되는 타입만 분리

2. **컴포넌트별 타입** - 로컬 타입
   - 특정 컴포넌트에서만 사용하는 타입은 해당 파일 내부에 정의
   - 재사용성이 필요할 때만 types/ 폴더로 이동

3. **tsconfig.json 경로 별칭**
   - `@/*` 별칭으로 프로젝트 루트에서 절대 경로 지원
   - 예: `import { cn } from '@/lib/utils'`

## 코딩 스타일

### 명명 규칙
- 변수/함수: `camelCase`
- 컴포넌트/타입: `PascalCase`
- 상수: `UPPER_SNAKE_CASE` (필요시)

### 코드 주석
- 복잡한 비즈니스 로직에 **한국어 주석** 추가
- shadcn/ui 컴포넌트 사용 시 코드는 명확한 편이므로 과도한 주석 불필요

### 타입 정의
- `tsconfig.json`의 `paths` 설정으로 `@/*` 경로 앨리어스 사용
- 복잡한 타입은 별도 파일 분리 권장

## 일반적인 개발 패턴

### 새로운 페이지 추가 (예: `/my-page`)
```
app/(dashboard)/my-page/page.tsx  # 페이지 컴포넌트 작성
```

### 새로운 컴포넌트 추가
컴포넌트의 역할과 재사용성에 따라 적절한 폴더에 배치:

1. **shadcn/ui 기본 컴포넌트**: `components/ui/`
   - Button, Dialog, Card, Input 등 shadcn/ui 컴포넌트
   - 커스터마이징이 필요하면 해당 폴더의 파일 수정

2. **레이아웃 컴포넌트**: `components/layout/`
   - 페이지 전체 구조를 정의하는 컴포넌트
   - AppLayout, Sidebar, Header, Footer 등
   - UI 컴포넌트를 조합하여 구성

3. **기능 컴포넌트**: `components/features/`
   - 비즈니스 로직을 포함한 기능 단위 컴포넌트
   - ThemeToggle, MobileNav, UserNav 등
   - UI 컴포넌트 및 layout 컴포넌트를 사용

4. **페이지 전용 컴포넌트**: 페이지 디렉토리 내부
   - 특정 페이지에서만 사용하는 컴포넌트
   - 각 페이지 디렉토리 내 `components/` 폴더 생성

### 디버깅
- 브라우저 개발자 도구의 Network/Console 탭 활용
- Server Component는 서버 콘솔에서 로그 확인
- Client Component는 브라우저 콘솔에서 로그 확인

## 배포 및 최적화

- **정적 생성**: 가능한 모든 페이지를 정적 생성(ISG)하도록 설계
- **이미지 최적화**: `<Image />` 컴포넌트 사용 필수
- **번들 크기**: Vercel Analytics로 모니터링 가능
- **배포**: Vercel 플랫폼 추천 (Next.js 최적화 제공)

## MCP 서버 (Model Context Protocol)

프로젝트는 Claude Code와의 통합을 위해 MCP 서버를 지원합니다.

### 설정 파일
- **위치**: `.mcp.json` - MCP 서버 설정 파일

### Playwright MCP 서버
- **명령어**: `npm run mcp:playwright`
- **용도**: E2E 테스트, 브라우저 자동화, 스크린샷 캡처 등
- **예시**: 페이지 상호작용 테스트, 스타일 검증 등

### 새로운 MCP 서버 추가
프로젝트에 MCP 서버를 추가할 때는:
1. `.mcp.json` 파일에 서버 설정 추가
2. `package.json`의 scripts에 실행 명령어 추가
3. 해당 기능 문서화

