# Invoice Web MVP - AI 개발 가이드라인

> **목적**: 이 문서는 AI 에이전트가 Invoice Web MVP 프로젝트에서 작업할 때 따라야 할 프로젝트별 규칙을 정의합니다.
> 일반적인 개발 지식이 아닌 **프로젝트 특화 규칙만** 포함합니다.

---

## 📋 프로젝트 개요

**프로젝트명**: Invoice Web MVP
**설명**: 견적서 발급자(관리자)와 수신자(클라이언트) 간의 견적서 관리를 디지털화한 웹 플랫폼
**기술 스택**: Next.js 15 (App Router), TypeScript (Strict Mode), Tailwind CSS v4, shadcn/ui, Zustand, React Hook Form + Zod
**언어**: 모든 주석/문서는 **한국어**, 변수/함수명은 **영어 CamelCase**

**참고 문서**:
- `@/docs/PRD.md`: 제품 요구사항 정의 - 기능 명세, 사용자 여정 확인 필수
- `@/docs/ROADMAP.md`: 개발 로드맵 - 우선순위 및 개발 단계 확인
- `CLAUDE.md`: 프로젝트 기본 설정 - 디렉토리 구조, 개발 패턴

---

## 🗂️ 디렉토리 구조 및 파일 생성 규칙

### 절대 규칙: 파일/컴포넌트 생성 위치 가이드

#### 1. **app/** - Next.js App Router 페이지 및 레이아웃

```
app/
├── layout.tsx                      # 루트 레이아웃 (ThemeProvider, Toaster 포함)
├── page.tsx                        # 홈페이지 (공개)
├── (protected)/                    # 라우트 그룹: 인증 필요 페이지
│   ├── layout.tsx                 # 인증 필요 페이지 레이아웃 (AppLayout 사용)
│   ├── dashboard/page.tsx         # 관리자 대시보드
│   ├── invoices/
│   │   ├── page.tsx               # 견적서 목록
│   │   ├── new/page.tsx           # 견적서 생성
│   │   └── [id]/page.tsx          # 견적서 상세 (관리자 수정 모드)
│   └── share/[token]/             # 라우트 그룹: 공개 공유 페이지
│       ├── page.tsx               # 공유 토큰으로 접근하는 견적서 목록 (인증 불필요)
│       └── invoices/[id]/page.tsx # 공유 토큰으로 접근하는 견적서 상세 (인증 불필요, 열람 전용)
```

**규칙**:
- `(protected)`: 인증이 필요한 모든 관리자 페이지는 이 그룹 내에 배치
- `(protected)/share/[token]`: 클라이언트 공개 공유 페이지는 별도 서브 라우트 그룹으로 분리
- 각 페이지 디렉토리는 page.tsx 외에 필요하면 `components/` 서브폴더로 페이지 전용 컴포넌트 생성
- 페이지별 레이아웃이 필요하면 해당 디렉토리에 `layout.tsx` 추가

#### 2. **components/** - 재사용 가능한 컴포넌트 (Atomic Design 패턴)

```
components/
├── ui/                     # shadcn/ui 및 재사용 가능한 기본 UI 컴포넌트
│   ├── button.tsx         # 버튼 (shadcn/ui)
│   ├── card.tsx           # 카드 (shadcn/ui)
│   ├── dialog.tsx         # 다이얼로그 (shadcn/ui)
│   ├── input.tsx          # 입력 필드 (shadcn/ui)
│   └── ... (다른 shadcn/ui 컴포넌트들)
│
├── layout/                # 레이아웃 및 구조 컴포넌트
│   ├── app-layout.tsx     # 전체 앱 레이아웃
│   ├── header.tsx         # 헤더
│   ├── sidebar.tsx        # 사이드바
│   ├── container.tsx      # 컨테이너
│   └── ... (다른 레이아웃 컴포넌트)
│
└── features/              # 비즈니스 로직을 포함한 기능 컴포넌트
    ├── theme-toggle.tsx   # 테마 토글 (비즈니스 로직 포함)
    ├── mobile-nav.tsx     # 모바일 네비게이션
    ├── user-nav.tsx       # 사용자 네비게이션
    └── ... (다른 기능 컴포넌트)
```

**규칙**:
- **components/ui/**: shadcn/ui 컴포넌트만 배치. UI 로직만 담당, 비즈니스 로직 없음
  - 새로운 shadcn/ui 컴포넌트 추가 시 여기에 생성
  - 이미 생성된 컴포넌트는 수정 가능 (필요시 커스터마이징)

- **components/layout/**: 페이지 구조를 정의하는 컴포넌트
  - AppLayout, Header, Sidebar 등 전역 레이아웃 담당
  - UI 컴포넌트를 조합하여 구성

- **components/features/**: 비즈니스 로직이 포함된 기능 컴포넌트
  - 상태 관리, API 호출, 이벤트 핸들링 포함 가능
  - UI 및 layout 컴포넌트를 사용하여 구성
  - 예: ThemeToggle (테마 변경 로직), MobileNav (네비게이션 상태 관리)

- **페이지 전용 컴포넌트**: 특정 페이지에서만 사용하는 컴포넌트
  - 각 페이지 디렉토리 내 `components/` 폴더 생성
  - 예: `app/(protected)/invoices/components/invoice-form.tsx`

#### 3. **store/** - Zustand 상태 관리

```
store/
├── useAuthStore.ts       # 인증 상태 (사용자 정보, 로그인/로그아웃)
├── useInvoiceStore.ts    # 견적서 상태 (견적서 목록, 상세 정보)
└── use-ui-store.ts       # UI 상태 (모달, 드롭다운 등 UI 전역 상태)
```

**규칙**:
- Zustand store 이름 규칙: `use{EntityName}Store.ts` (예: useAuthStore, useInvoiceStore)
- 파일명: camelCase (use로 시작)
- **복잡한 전역 상태만 Zustand 사용**. 간단한 로컬 상태는 `useState` 선호
- 각 store는 단일 책임 원칙 준수 (인증, 견적서, UI 등으로 분리)

#### 4. **types/** - TypeScript 타입 정의

```
types/
└── index.ts              # 프로젝트 전역 타입 중앙 관리
```

**규칙**:
- 여러 파일에서 **재사용되는 타입만** `types/index.ts`에 정의
- 특정 컴포넌트/페이지에서만 사용하는 타입은 **해당 파일 내부에 정의**
- 복잡한 타입이 많아지면 `types/` 내에 세분화 가능 (예: `types/invoice.ts`)
- tsconfig.json의 `@/*` 별칭으로 `@/types`로 import

#### 5. **lib/** - 유틸리티 함수 및 상수

```
lib/
├── constants.ts          # 프로젝트 전역 상수 (SITE_METADATA 등)
└── utils.ts              # 유틸리티 함수 (cn() 등)
```

**규칙**:
- 상수는 `UPPER_SNAKE_CASE` 사용
- 유틸리티 함수는 camelCase 사용
- 한 곳에서만 사용되는 상수/함수는 해당 파일 내부에 정의

#### 6. **providers/** - Context Providers

```
providers/
└── theme-provider.tsx    # next-themes를 래핑한 테마 제공자
```

**규칙**:
- 파일명: `{service}-provider.tsx` (예: theme-provider.tsx)
- `app/layout.tsx`에서 필수 providers만 통합
- 과도한 provider 중첩 피하기 (성능 영향)

#### 7. **hooks/** - 커스텀 React 훅

```
hooks/
└── (필요시 생성)
```

**규칙**:
- 파일명: `use{HookName}.ts` (예: useSidebar.ts)
- 여러 컴포넌트에서 재사용되는 로직만 훅으로 분리

---

## 🎯 컴포넌트 구조 및 구현 규칙

### 컴포넌트 분류 기준

| 폴더 | 담당 내용 | 예시 | 사용 대상 |
|------|---------|------|---------|
| **ui/** | UI만 담당, 비즈니스 로직 없음 | Button, Card, Input, Dialog | shadcn/ui 기반 원자 단위 컴포넌트 |
| **layout/** | 페이지 구조 및 레이아웃 | AppLayout, Header, Sidebar | 전역 레이아웃 구성 |
| **features/** | 비즈니스 로직 포함 | ThemeToggle, UserNav, InvoiceForm | 기능 단위 고수준 컴포넌트 |
| **페이지 내 components/** | 특정 페이지만 사용 | InvoiceDetailForm (invoices/[id]에서만) | 페이지 특화 컴포넌트 |

### 'use client' 지시어 사용 규칙

**기본 원칙**: 모든 컴포넌트는 Server Component (기본값)

**'use client' 추가 조건** (다음 중 하나 이상):
- 상태 관리 (`useState`, `useReducer`)
- 이벤트 핸들링 (`onClick`, `onChange` 등)
- 브라우저 API 사용 (`localStorage`, `window` 등)
- 제공자 사용 (Context 소비)
- 커스텀 훅 사용

**예시**:
```typescript
// ✅ Server Component (use client 불필요)
export default function InvoiceList({ invoices }: Props) {
  return <div>{invoices.map(inv => <InvoiceCard key={inv.id} invoice={inv} />)}</div>;
}

// ✅ Client Component (상태 관리 필요)
'use client';
export default function InvoiceForm() {
  const [title, setTitle] = useState('');
  return <input value={title} onChange={(e) => setTitle(e.target.value)} />;
}
```

---

## 📝 명명 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수/함수 | camelCase | `const getInvoiceTotal = () => {}` |
| 컴포넌트/타입 | PascalCase | `function InvoiceCard() {}`, `type InvoiceData = {}` |
| 상수 | UPPER_SNAKE_CASE | `const MAX_INVOICE_ITEMS = 100` |
| 파일명 (컴포넌트) | PascalCase | `InvoiceForm.tsx` |
| 파일명 (훅/함수) | camelCase 또는 PascalCase | `useInvoiceStore.ts`, `utils.ts` |
| 파일명 (타입/인터페이스) | PascalCase 또는 camelCase | `types/index.ts` |
| 스토어 함수 | camelCase + 동사 | `setUserInfo()`, `clearInvoices()` |

---

## 💬 언어 및 주석 규칙

- **주석**: 모든 주석은 **한국어** 작성
- **변수/함수명**: 영어 사용
- **복잡한 비즈니스 로직**: 반드시 한국어 주석 추가
- **자명한 코드**: 과도한 주석 불필요

**예시**:
```typescript
// ✅ 좋은 예
// 견적서의 전체 금액을 계산한다 (세금 포함)
function calculateTotalAmount(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ❌ 피할 예
// 합계 계산
function sum(arr: any[]) {
  return arr.reduce((a, b) => a + b, 0);
}
```

---

## 🔌 기술 스택 사용 규칙

### TypeScript (Strict Mode)

- **금지**: `any` 타입 절대 사용 금지
- **필수**: 모든 함수 매개변수와 반환값에 타입 정의
- **권장**: `unknown` 사용 시 타입 가드 적용

```typescript
// ✅ 올바른 예
function processData(data: Record<string, unknown>): string {
  if (typeof data === 'object' && data !== null) {
    return JSON.stringify(data);
  }
  return '';
}

// ❌ 피할 예
function processData(data: any) {
  return JSON.stringify(data);
}
```

### Tailwind CSS + shadcn/ui

- **클래스 병합**: `cn()` 유틸리티 사용하여 class 충돌 방지
- **커스톰 스타일**: Tailwind 클래스 최우선, 필요시에만 CSS Module 또는 styled 사용
- **반응형 설계**: Mobile-First 접근법 (sm, md, lg, xl, 2xl 우선)

```typescript
// ✅ 올바른 예
import { cn } from '@/lib/utils';

export function Button({ className, ...props }: ButtonProps) {
  return <button className={cn('px-4 py-2 bg-blue-500', className)} {...props} />;
}

// ❌ 피할 예
export function Button({ className, ...props }: ButtonProps) {
  return <button className={`px-4 py-2 bg-blue-500 ${className}`} {...props} />;
}
```

### 폼 처리 (React Hook Form + Zod)

- **Zod 스키마 먼저 정의**: 타입 안전성과 유효성 검사 동시 제공
- **resolver**: `@hookform/resolvers/zod`로 React Hook Form과 통합
- **에러 처리**: 필드별 에러 메시지 표시, 전역 에러도 토스트로 표시

```typescript
// ✅ 올바른 예
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const invoiceSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  items: z.array(z.object({
    name: z.string(),
    price: z.number().positive(),
  })),
});

export function InvoiceForm() {
  const form = useForm({ resolver: zodResolver(invoiceSchema) });
  // ...
}
```

### Zustand 상태 관리

- **조건**: 복잡한 전역 상태가 필요한 경우만 사용
- **간단한 상태**: `useState` 선호
- **구조**: 액션과 상태를 명확히 분리
- **구독**: 필요한 부분만 구독하기 (성능 최적화)

```typescript
// ✅ 올바른 예
import { create } from 'zustand';

interface InvoiceState {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  removeInvoice: (id: string) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  addInvoice: (invoice) => set((state) => ({
    invoices: [...state.invoices, invoice],
  })),
  removeInvoice: (id) => set((state) => ({
    invoices: state.invoices.filter(inv => inv.id !== id),
  })),
}));
```

### 토스트/알림 (Sonner)

- **성공**: `toast.success('작업이 완료되었습니다')`
- **에러**: `toast.error('오류가 발생했습니다')`
- **정보**: `toast.info('정보 메시지')`
- **로딩**: `toast.loading('처리 중...')`

---

## 📁 핵심 파일 수정 규칙

### 동시 수정 필수 파일

다음과 같은 작업 시 **다중 파일 동시 수정**이 필요합니다:

| 상황 | 수정 필요 파일 | 이유 |
|------|---------------|------|
| **새로운 Provider 추가** | `app/layout.tsx`, `providers/{name}-provider.tsx` | 루트 레이아웃에서 Provider 통합 필요 |
| **새로운 라우트 그룹 추가** | `app/(group)/layout.tsx`, `@/docs/ROADMAP.md` (필요시) | 레이아웃 상속 구조 및 문서 동기화 |
| **전역 상수 추가** | `lib/constants.ts`, 관련 컴포넌트 | 일관성 유지 |
| **타입 추가** | `types/index.ts`, 관련 컴포넌트 | 재사용 가능한 타입은 중앙 관리 |
| **기능 추가** | 해당 페이지, `docs/ROADMAP.md`, `README.md` (필요시) | 진행 상황 및 문서 동기화 |

---

## ⛔ 금지 사항 (Prohibited Actions)

**다음 행동은 절대 금지합니다**:

### 코드 관련
- ❌ `any` 타입 사용
- ❌ UI 컴포넌트에 비즈니스 로직 혼재
- ❌ 과도한 Provider 중첩 (성능 저하)
- ❌ prop drilling (3단계 이상의 깊은 props 전달)
- ❌ 전역 CSS 수정 (격리된 스타일 사용)
- ❌ 원본 shadcn/ui 컴포넌트 구조 변경 (필요시 wrapper 컴포넌트 생성)

### 파일 구조 관련
- ❌ 명확한 위치 규칙 없이 임의로 컴포넌트 생성
- ❌ components/ui/에 shadcn/ui가 아닌 비즈니스 로직 컴포넌트 생성
- ❌ app/ 디렉토리 직접 수정 (라우트 그룹 구조 훼손)

### 상태 관리 관련
- ❌ 모든 상태를 Zustand로 관리 (필요한 것만 선택)
- ❌ 복잡한 상태 로직을 Zustand 내에 직접 작성 (별도 함수로 분리)

### 문서 관련
- ❌ 기능 추가 후 `docs/ROADMAP.md` 미업데이트
- ❌ 주요 구조 변경 후 `README.md` 미업데이트

---

## ✅ 개발 체크리스트

새로운 기능/페이지를 추가할 때마다 다음을 확인하세요:

### 1. 파일/폴더 생성
- [ ] 올바른 위치에 파일 생성 (app/, components/{ui|layout|features}/, etc.)
- [ ] 파일명이 올바른 명명 규칙 준수 (PascalCase for components, camelCase for utils)
- [ ] 필요하면 `components/` 서브폴더 생성 (페이지 전용 컴포넌트)

### 2. 타입 및 인터페이스
- [ ] 필요한 타입 정의 (재사용 타입은 `types/index.ts`, 로컬 타입은 파일 내)
- [ ] 모든 함수 매개변수와 반환값에 타입 정의
- [ ] `any` 타입 사용 안 함

### 3. 컴포넌트 구조
- [ ] `use client`가 필요한 곳에만 추가
- [ ] UI 컴포넌트에 비즈니스 로직 없음
- [ ] 컴포넌트가 올바른 폴더에 배치 (ui/, layout/, features/)

### 4. 상태 관리
- [ ] 전역 상태가 필요한지 확인 (필요하면 store 추가)
- [ ] 단순 로컬 상태는 `useState` 사용
- [ ] 새 store 생성 시 올바른 이름 규칙 (use{Name}Store.ts)

### 5. 스타일링
- [ ] Tailwind 클래스 사용 (CSS Module 대신)
- [ ] 클래스 충돌 시 `cn()` 유틸리티 사용
- [ ] Mobile-First 반응형 설계 확인

### 6. 폼 및 유효성 검사
- [ ] React Hook Form + Zod 조합 사용
- [ ] Zod 스키마 먼저 정의
- [ ] 에러 메시지 표시

### 7. 언어 및 주석
- [ ] 변수/함수명은 영어
- [ ] 복잡한 로직에 한국어 주석 추가
- [ ] 문서/커밋 메시지는 한국어

### 8. 문서 업데이트
- [ ] 기능 추가/수정 시 `docs/ROADMAP.md` 업데이트
- [ ] 구조 변경 시 `README.md` 업데이트
- [ ] PRD.md와 불일치 없음 확인

---

## 🚀 일반적인 개발 시나리오

### 시나리오 1: 새로운 페이지 추가

1. `app/(protected)/{feature}/page.tsx` 생성
2. 필요하면 `app/(protected)/{feature}/layout.tsx` 추가
3. 페이지 전용 컴포넌트는 `app/(protected)/{feature}/components/` 폴더에 생성
4. 타입이 필요하면 `types/index.ts`에 추가 (재사용 가능하면)
5. 라우팅 확인 및 네비게이션에 링크 추가

### 시나리오 2: 새로운 전역 컴포넌트 추가

1. 컴포넌트 유형 판단:
   - UI만 → `components/ui/`
   - 레이아웃 → `components/layout/`
   - 비즈니스 로직 → `components/features/`
2. 올바른 폴더에 파일 생성
3. 필요하면 타입 추가 (`types/index.ts` 또는 파일 내)
4. 사용처 파일에서 import

### 시나리오 3: 전역 상태 추가

1. `store/use{Entity}Store.ts` 파일 생성
2. Zustand `create` 함수로 store 정의
3. 상태와 액션 명확히 분리
4. 필요한 컴포넌트에서 구독 (필요한 부분만)

### 시나리오 4: 새로운 프로바이더 추가

1. `providers/{service}-provider.tsx` 생성
2. Context 생성 및 Provider 컴포넌트 작성
3. `app/layout.tsx`의 `<ThemeProvider>` 아래에 추가
4. 과도한 중첩 피하기 (성능)

---

## 📌 중요 참고사항

1. **라우트 그룹 구조**:
   - `(protected)`: 로그인 필요 (관리자 페이지)
   - `(protected)/share/[token]`: 공개 공유 (토큰 기반 접근)

2. **인증 관리**:
   - `useAuthStore` 참고하여 로그인/로그아웃 상태 관리
   - 보호된 라우트에서 인증 확인 로직 추가

3. **API 통합**:
   - 백엔드 연동 시 `.env` 파일에서 환경 변수 설정
   - API 호출은 Server Component 또는 별도 API 유틸리티에서 처리

4. **성능 최적화**:
   - 이미지는 `<Image />` 컴포넌트 사용
   - 큰 리스트는 가상화 고려
   - Provider 중첩 최소화

5. **테스트 및 배포**:
   - `npm run build` 실패 → TypeScript 에러 확인
   - `npm run lint` 실행하여 코드 품질 확인
   - Vercel 배포 권장

---

## 📞 문제 해결

| 상황 | 해결 방법 |
|------|---------|
| **TypeScript 에러** | tsconfig.json의 strict mode 확인, 타입 추가 |
| **클래스 스타일 충돌** | `cn()` 유틸리티 사용, Tailwind 우선순위 확인 |
| **Provider 오류** | `app/layout.tsx`에서 Provider 순서 확인 |
| **Zustand 상태 업데이트 안 됨** | `set()` 함수 올바르게 사용하는지 확인 |
| **라우팅 404 에러** | 파일 위치, 라우트 그룹 구조 확인 |

---

**마지막 업데이트**: 2026-01-16
