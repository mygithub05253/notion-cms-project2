# 개발자 가이드

새로운 개발자가 프로젝트에 빠르게 온보딩될 수 있도록 하는 종합적인 가이드입니다.

## 📋 목차

- [시작하기](#시작하기)
- [프로젝트 구조](#프로젝트-구조)
- [기술 스택](#기술-스택)
- [코딩 컨벤션](#코딩-컨벤션)
- [컴포넌트 개발](#컴포넌트-개발)
- [상태 관리](#상태-관리)
- [API 클라이언트](#api-클라이언트)
- [E2E 테스트](#e2e-테스트)
- [디버깅 가이드](#디버깅-가이드)
- [자주 묻는 질문](#자주-묻는-질문)

---

## 시작하기

### 사전 요구사항

- **Node.js**: 20 이상
- **npm**: 10 이상 또는 pnpm
- **Git**: 버전 관리 및 협업

### 1단계: 프로젝트 클론

```bash
git clone https://github.com/your-org/invoice-web.git
cd invoice-web
```

### 2단계: 의존성 설치

```bash
npm install
```

또는 pnpm을 사용하는 경우:

```bash
pnpm install
```

### 3단계: 환경 변수 설정

`.env.example` 파일을 참고하여 `.env.local` 파일을 생성하세요.

```bash
cp .env.example .env.local
```

필수 환경 변수:

```
# 애플리케이션
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# 보안 (개발용 기본값 제공됨)
JWT_SECRET=dev-jwt-secret-minimum-32-chars-change-for-production-!!!
CSRF_SECRET=dev-csrf-secret-minimum-32-chars-change-for-production-!

# Notion API 설정
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
NOTION_ITEMS_DATABASE_ID=your_items_database_id
NOTION_SHARES_DATABASE_ID=your_shares_database_id
NOTION_USERS_DATABASE_ID=your_users_database_id

# 개발 환경
NEXT_PUBLIC_DEBUG_API=true
LOG_LEVEL=debug
```

**Notion API 설정 방법**:

1. https://www.notion.so/my-integrations 에 접속
2. "Create new integration" 클릭
3. 생성된 토큰을 `NOTION_API_KEY`에 입력
4. 각 데이터베이스에서 "Connections" 메뉴에서 integration 추가

### 4단계: 개발 서버 실행

```bash
npm run dev
```

개발 서버가 시작되면 브라우저에서 `http://localhost:3000`으로 접속할 수 있습니다.

### 5단계: 타입 체크 및 린트

```bash
# TypeScript 타입 체크
npm run build

# ESLint 검사
npm run lint
```

---

## 프로젝트 구조

```
invoice-web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃 (테마, 토스터 통합)
│   ├── page.tsx                 # 로그인 페이지
│   ├── globals.css              # 글로벌 스타일
│   ├── api/                     # API 라우트
│   │   ├── health/              # 헬스체크
│   │   └── notion/              # Notion API 통합
│   │       ├── invoices/        # 견적서 API
│   │       └── ...
│   └── (protected)/             # 인증 필요 라우트 그룹
│       ├── layout.tsx           # 보호된 라우트 레이아웃
│       ├── dashboard/           # 대시보드
│       ├── invoices/            # 견적서 관리
│       │   ├── page.tsx         # 목록
│       │   ├── new/             # 새 견적서
│       │   └── [id]/            # 상세 페이지
│       └── share/               # 공유 페이지
│           └── [token]/         # 공개 공유 페이지
│
├── components/                   # React 컴포넌트
│   ├── ui/                      # shadcn/ui 컴포넌트 (재사용 가능)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/                  # 레이아웃 컴포넌트
│   │   ├── app-layout.tsx       # 앱 전체 레이아웃
│   │   ├── header.tsx           # 헤더/네비게이션
│   │   ├── sidebar.tsx          # 사이드바
│   │   └── ...
│   └── features/                # 기능별 비즈니스 컴포넌트
│       ├── theme-toggle.tsx     # 테마 토글
│       ├── user-nav.tsx         # 사용자 네비게이션
│       ├── invoice-form.tsx     # 견적서 폼
│       └── ...
│
├── lib/                         # 유틸리티 및 헬퍼 함수
│   ├── utils.ts                # 클래스명 병합 등 유틸
│   ├── constants.ts            # 상수 정의
│   ├── security.ts             # 보안 관련 함수
│   ├── api-config.ts           # API 클라이언트 설정
│   ├── api-auth.ts             # 인증 API
│   ├── api-invoice.ts          # 견적서 API
│   ├── api-share.ts            # 공유 API
│   └── ...
│
├── hooks/                       # 커스텀 React 훅
│   ├── useAuth.ts              # 인증 훅
│   ├── useInvoice.ts           # 견적서 훅
│   ├── useLocalStorage.ts      # 로컬 스토리지 훅
│   ├── use-sidebar.ts          # 사이드바 상태 훅
│   └── ...
│
├── store/                       # Zustand 전역 상태 관리
│   ├── useAuthStore.ts         # 인증 상태
│   ├── useInvoiceStore.ts      # 견적서 상태
│   └── use-ui-store.ts         # UI 상태
│
├── types/                       # TypeScript 타입 정의
│   ├── index.ts                # 메인 타입 정의
│   ├── api.ts                  # API 응답 타입
│   └── notion.ts               # Notion 타입
│
├── providers/                   # Context Providers
│   ├── theme-provider.tsx      # 테마 프로바이더
│   └── ...
│
├── public/                      # 정적 자산
│   ├── images/
│   ├── fonts/
│   └── ...
│
├── docs/                        # 프로젝트 문서
│   ├── PRD.md                  # 프로덕션 요구사항
│   ├── ROADMAP.md              # 개발 로드맵
│   ├── API.md                  # API 문서
│   ├── DEPLOYMENT.md           # 배포 가이드
│   └── ...
│
├── e2e/                         # E2E 테스트
│   ├── login-flow.spec.ts
│   └── ...
│
├── .env.example                # 환경 변수 템플릿
├── .env.local                  # 로컬 환경 변수 (git 제외)
├── tsconfig.json               # TypeScript 설정
├── next.config.ts              # Next.js 설정
├── tailwind.config.ts          # Tailwind CSS 설정
├── package.json                # 프로젝트 메타데이터
└── README.md                   # 프로젝트 소개
```

---

## 기술 스택

### 프론트엔드 프레임워크

| 라이브러리 | 버전 | 용도 |
| -------- | ---- | ---- |
| Next.js | 16.1.1 | React 프레임워크 (App Router) |
| React | 19.2.3 | UI 라이브러리 |
| TypeScript | 5+ | 정적 타입 지정 |

### UI/스타일링

| 라이브러리 | 버전 | 용도 |
| -------- | ---- | ---- |
| Tailwind CSS | v4 | 유틸리티 CSS 프레임워크 |
| shadcn/ui | - | 재사용 가능한 UI 컴포넌트 |
| Radix UI | - | 접근성 기반 UI 컴포넌트 라이브러리 |
| Lucide React | - | 아이콘 라이브러리 |

### 상태 관리 및 폼

| 라이브러리 | 버전 | 용도 |
| -------- | ---- | ---- |
| Zustand | 5.0.9 | 전역 상태 관리 |
| React Hook Form | 7.69.0 | 폼 상태 관리 |
| Zod | 4.3.4 | 스키마 검증 |

### 기타 유틸리티

| 라이브러리 | 용도 |
| -------- | ---- |
| Sonner | 토스트 알림 |
| next-themes | 라이트/다크 모드 |
| date-fns | 날짜 처리 |
| clsx | 클래스명 조건부 지정 |
| class-variance-authority | 컴포넌트 스타일 변형 |

### 개발 도구

| 도구 | 버전 | 용도 |
| ---- | ---- | ---- |
| ESLint | 9 | 코드 린팅 |
| Playwright | - | E2E 테스트 |
| Node | 20+ | 런타임 |

---

## 코딩 컨벤션

### 파일 및 폴더 명명

```
컴포넌트 파일:        PascalCase (MyComponent.tsx)
훅 파일:              useMyHook.ts 또는 use-my-hook.ts
유틸리티 파일:        camelCase (utils.ts, constants.ts)
폴더:                 camelCase (components, hooks, lib)
```

### 변수 및 함수명

```typescript
// 변수: camelCase
const userName = 'John Doe';
const isLoading = true;
const API_BASE_URL = 'http://localhost:5000';

// 함수: camelCase
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// 상수: UPPER_SNAKE_CASE
const DEFAULT_PAGE_SIZE = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
```

### 컴포넌트 명명

```typescript
// 컴포넌트: PascalCase
function InvoiceForm() {
  return <form>{/* ... */}</form>;
}

// 컴포넌트 파일명도 PascalCase
// ✅ InvoiceForm.tsx
// ❌ invoiceForm.tsx
```

### 타입 정의

```typescript
// 인터페이스: PascalCase
interface User {
  id: string;
  email: string;
  name: string;
}

// 타입 별칭: PascalCase
type InvoiceStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

// 제네릭: T, U, K 등
interface ApiResponse<T> {
  success: boolean;
  data: T;
}
```

### 주석 작성

```typescript
// 한국어 주석 사용
// 복잡한 비즈니스 로직에는 주석 추가

// ✅ 좋은 예: 비즈니스 로직이 명확
const processInvoice = (invoice: Invoice) => {
  // 공유 링크가 있는 견적서만 공개
  if (!invoice.shareToken) return null;

  return invoice;
};

// ❌ 나쁜 예: 불필요한 주석
// 변수 선언
const name = 'John';
```

### 들여쓰기 및 포맷

```
들여쓰기: 2 spaces
세미콜론: 필수
따옴표: 작은따옴표(') 권장, JSX에서는 큰따옴표(") 사용
```

---

## 컴포넌트 개발

### 컴포넌트 구조 (Atomic Design)

프로젝트는 다음과 같이 컴포넌트를 계층화합니다:

#### 1. UI 컴포넌트 (`components/ui/`)

기본 UI 요소들, shadcn/ui 기반, 비즈니스 로직 없음

```typescript
// components/ui/button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'default',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md font-medium',
        variant === 'default' && 'bg-blue-500 text-white',
        variant === 'outline' && 'border border-gray-300',
        className
      )}
      {...props}
    />
  );
}
```

#### 2. 레이아웃 컴포넌트 (`components/layout/`)

페이지 구조를 정의하는 컴포넌트, UI 컴포넌트 조합

```typescript
// components/layout/app-layout.tsx
'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### 3. 기능 컴포넌트 (`components/features/`)

비즈니스 로직을 포함한 고수준 컴포넌트

```typescript
// components/features/invoice-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createInvoiceApi } from '@/lib/api-invoice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface InvoiceFormProps {
  onSuccess: () => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    // 폼 설정
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await createInvoiceApi(data);
      toast.success('견적서가 생성되었습니다.');
      onSuccess();
    } catch (error) {
      toast.error('견적서 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* 폼 필드 */}
      <Button type="submit" disabled={isLoading}>
        생성
      </Button>
    </form>
  );
}
```

### Server Component와 Client Component

```typescript
// ✅ Server Component (기본값)
// app/page.tsx - 서버에서만 실행
export default async function Page() {
  const invoices = await getInvoices(); // 서버에서 데이터 조회

  return <InvoiceList invoices={invoices} />;
}

// ✅ Client Component (상태/이벤트 필요할 때)
// components/features/invoice-form.tsx
'use client';

import { useState } from 'react';

export function InvoiceForm() {
  const [title, setTitle] = useState('');

  return (
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
}
```

### Props 정의 및 타입 안전성

```typescript
// ✅ Props 명시적 정의
interface CardProps {
  title: string;
  description?: string;
  children: ReactNode;
  variant?: 'default' | 'elevated';
  onClick?: () => void;
}

export function Card({
  title,
  description,
  children,
  variant = 'default',
  onClick,
}: CardProps) {
  return (
    <div
      className={`p-4 rounded-lg ${
        variant === 'elevated' ? 'shadow-lg' : 'border'
      }`}
      onClick={onClick}
    >
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
```

---

## 상태 관리

### Zustand 사용 (전역 상태)

```typescript
// store/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
```

### 컴포넌트에서 상태 사용

```typescript
// components/features/user-nav.tsx
'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';

export function UserNav() {
  const { user, logout } = useAuthStore();

  return (
    <div>
      <span>{user?.name}</span>
      <Button onClick={logout}>로그아웃</Button>
    </div>
  );
}
```

### useState (로컬 상태)

```typescript
// 단순한 로컬 상태는 useState 사용
'use client';

import { useState } from 'react';

export function InvoiceFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<'draft' | 'sent'>('draft');

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="draft">작성 중</option>
        <option value="sent">발송됨</option>
      </select>
    </div>
  );
}
```

---

## API 클라이언트

### API 요청 기본 사용법

```typescript
// lib/api-config.ts에서 제공하는 함수들
import {
  apiFetch,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from '@/lib/api-config';

// GET 요청
const invoices = await apiGet<Invoice[]>('/invoices');

// POST 요청
const newInvoice = await apiPost<Invoice>('/invoices', {
  title: '새 견적서',
  clientName: '홍길동',
  items: [],
});

// PUT 요청 (수정)
const updated = await apiPut<Invoice>('/invoices/123', {
  title: '수정된 제목',
});

// DELETE 요청
await apiDelete<void>('/invoices/123');
```

### API 모듈 사용

```typescript
// lib/api-invoice.ts에서 제공하는 함수들
import {
  getInvoicesApi,
  getInvoiceApi,
  createInvoiceApi,
  updateInvoiceApi,
  deleteInvoiceApi,
} from '@/lib/api-invoice';

// 목록 조회
const invoices = await getInvoicesApi(1, 20);

// 상세 조회
const invoice = await getInvoiceApi('invoice-id');

// 생성
const newInvoice = await createInvoiceApi({
  title: '새 견적서',
  clientName: '홍길동',
  items: [
    {
      description: '개발',
      quantity: 40,
      unitPrice: 50000,
    },
  ],
});
```

### 에러 처리

```typescript
'use client';

import { useState } from 'react';
import { getInvoicesApi } from '@/lib/api-invoice';
import { toast } from 'sonner';

export function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await getInvoicesApi(1, 10);
      setInvoices(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchInvoices} disabled={isLoading}>
        {isLoading ? '로딩 중...' : '조회'}
      </button>
    </div>
  );
}
```

---

## E2E 테스트

### Playwright 설치

```bash
npm run mcp:playwright
```

### 테스트 작성 방법

```typescript
// e2e/invoice-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('견적서 작성 플로우', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전 로그인
    await page.goto('http://localhost:3000');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("로그인")');
    await page.waitForURL('**/dashboard');
  });

  test('새 견적서를 생성할 수 있어야 함', async ({ page }) => {
    // 새 견적서 버튼 클릭
    await page.click('button:has-text("새 견적서")');

    // 폼 입력
    await page.fill('input[placeholder="제목"]', '웹사이트 개발');
    await page.fill('input[placeholder="클라이언트 이름"]', '홍길동');

    // 항목 추가
    await page.click('button:has-text("항목 추가")');
    await page.fill('input[placeholder="항목 설명"]', '개발');
    await page.fill('input[placeholder="수량"]', '40');
    await page.fill('input[placeholder="단가"]', '50000');

    // 제출
    await page.click('button:has-text("생성")');

    // 성공 확인
    await expect(page.locator('text=견적서가 생성되었습니다')).toBeVisible();
  });

  test('견적서를 수정할 수 있어야 함', async ({ page }) => {
    // 견적서 선택
    await page.click('text=웹사이트 개발');

    // 수정 버튼
    await page.click('button:has-text("수정")');

    // 제목 변경
    await page.fill('input[value="웹사이트 개발"]', '모바일 앱 개발');

    // 저장
    await page.click('button:has-text("저장")');

    // 확인
    await expect(page.locator('text=모바일 앱 개발')).toBeVisible();
  });
});
```

### 테스트 실행

```bash
# 모든 E2E 테스트 실행
npm run test:e2e

# 특정 파일 테스트
npm run test:e2e -- e2e/invoice-flow.spec.ts

# 브라우저 보기 모드
npm run test:e2e -- --headed

# 디버그 모드
npm run test:e2e -- --debug
```

---

## 디버깅 가이드

### 브라우저 개발자 도구

```
1. Chrome 개발자 도구 열기: F12 또는 Ctrl+Shift+I
2. Console 탭: 자바스크립트 에러 확인
3. Network 탭: API 요청/응답 확인
4. Elements 탭: DOM 구조 및 스타일 확인
5. Application 탭: localStorage, cookies 확인
```

### Server Component 디버깅

```typescript
// app/(protected)/invoices/page.tsx
export default async function InvoicesPage() {
  console.log('서버 콘솔에 출력됨'); // 터미널에 출력

  const invoices = await getInvoicesApi();

  return <InvoiceList invoices={invoices} />;
}
```

**출력 위치**: 터미널 (개발 서버 실행 중인 터미널)

### Client Component 디버깅

```typescript
// components/features/invoice-form.tsx
'use client';

export function InvoiceForm() {
  console.log('클라이언트 콘솔에 출력됨'); // 브라우저 콘솔에 출력

  return <form>{/* ... */}</form>;
}
```

**출력 위치**: 브라우저 개발자 도구 Console 탭

### TypeScript 에러 해결

```bash
# 타입 체크 및 에러 확인
npm run build

# 출력 예시:
# Type 'string' is not assignable to type 'number'
# 해당 파일명과 줄 번호가 표시됨
```

### API 디버깅

```typescript
// .env.local에서 활성화
NEXT_PUBLIC_DEBUG_API=true

// 그 후 API 요청 시 브라우저 콘솔에서:
// [API] GET /invoices
// [API] Response: { ... }
// 를 통해 요청/응답 확인 가능
```

---

## 자주 묻는 질문

### Q: Server Component와 Client Component의 차이가 뭔가요?

**Server Component**:
- 기본값
- 서버에서만 실행
- 데이터베이스 직접 접근 가능
- `await` 사용 가능
- 보안 정보(API 키 등) 포함 가능

**Client Component**:
- `'use client'` 지시어 필요
- 브라우저에서 실행
- useState, onClick 등 상호작용 가능
- 큰 번들 크기 (필요할 때만 사용)

### Q: 컴포넌트를 어느 폴더에 만들어야 하나요?

- **UI 컴포넌트** (Button, Dialog, Form 등): `components/ui/`
- **레이아웃 컴포넌트** (Header, Sidebar, Layout): `components/layout/`
- **기능 컴포넌트** (InvoiceForm, UserNav): `components/features/`
- **페이지별 컴포넌트** (특정 페이지에서만 사용): 페이지 디렉토리 내 `components/`

### Q: 전역 상태가 필요한가요?

전역 상태는 여러 컴포넌트에서 **자주** 사용되는 데이터에만 사용하세요:

- ✅ 인증 정보 (사용자, 토큰)
- ✅ 테마 설정 (라이트/다크 모드)
- ✅ UI 상태 (사이드바 열림/닫힘)

- ❌ 폼 입력값 (로컬 상태 사용)
- ❌ 페이지별 데이터 (props 사용)

### Q: API 요청 시 로딩 상태를 어떻게 관리하나요?

```typescript
'use client';

import { useState } from 'react';

export function InvoiceList() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      const data = await getInvoicesApi();
      // 데이터 처리
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleFetch} disabled={isLoading}>
      {isLoading ? '로딩 중...' : '조회'}
    </button>
  );
}
```

### Q: 환경 변수는 어떻게 사용하나요?

```typescript
// 클라이언트에서 접근 가능 (NEXT_PUBLIC_ 접두사)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// 서버에서만 접근 가능
const jwtSecret = process.env.JWT_SECRET;
```

### Q: Tailwind CSS 클래스가 적용되지 않아요.

```typescript
// ✅ 정적 클래스명
className="bg-blue-500 text-white"

// ❌ 동적 클래스명 (작동 안 함)
className={`bg-${color}-500`}

// ✅ 동적 클래스명 올바른 방법
import { cn } from '@/lib/utils';

className={cn(
  'text-white',
  color === 'blue' && 'bg-blue-500',
  color === 'red' && 'bg-red-500'
)}
```

### Q: 폼 유효성 검증은 어떻게 하나요?

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  clientName: z.string().min(1, '클라이언트 이름은 필수입니다'),
  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().positive(),
    })
  ),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### Q: 테스트를 어떻게 작성하나요?

E2E 테스트는 `e2e/` 폴더에 Playwright로 작성합니다:

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('사용자가 로그인할 수 있어야 함', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // 입력
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button:has-text("로그인")');

  // 확인
  await expect(page).toHaveURL('**/dashboard');
});
```

실행: `npm run test:e2e`

---

**마지막 업데이트**: 2026년 1월 21일
**가이드 버전**: 1.0.0
