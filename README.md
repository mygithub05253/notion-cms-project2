# Invoice Web MVP

노션에서 관리하는 견적서를 클라이언트가 웹으로 확인하고 PDF로 다운로드할 수 있는 플랫폼입니다.

## 🎯 프로젝트 개요

**목적**: 견적서 발급자(관리자)와 견적서 수신자(클라이언트) 간의 견적서 관리를 디지털화하여, 안전하고 효율적인 견적서 공유 및 관리 프로세스 제공

**범위**:
- 관리자: 견적서 생성, 수정, 삭제, 공유 링크 생성
- 클라이언트: 공유된 견적서 열람, PDF 다운로드

**사용자**:
- 견적서 발급자 (관리자)
- 견적서 수신자 (클라이언트)

## 📱 주요 페이지

### 공개 페이지 (인증 불필요)
1. **홈/로그인 페이지** (`/`)
   - 관리자 인증 (이메일, 비밀번호)
   - F001: 관리자 인증

### 보호된 페이지 (관리자, 인증 필수)
2. **대시보드** (`/dashboard`)
   - 모든 견적서 조회 및 관리
   - F002, F004, F006: 견적서 목록, 생성, 삭제

3. **견적서 목록** (`/invoices`)
   - 발급한 모든 견적서 조회
   - F002: 견적서 목록 조회

4. **새 견적서** (`/invoices/new`)
   - 새로운 견적서 작성 및 저장
   - F004, F010: 견적서 생성, 폼 입력

5. **견적서 상세** (`/invoices/[id]`)
   - 견적서 정보 확인, 수정, 삭제, 공유
   - F003, F005, F006, F007: 조회, 수정, 삭제, 공유 링크 생성

### 공개 페이지 (클라이언트, 공유 토큰 필수)
6. **공유 견적서 목록** (`/share/[token]`)
   - 공유된 견적서 목록 확인
   - F002, F008: 조회, 공유 링크 검증

7. **공유 견적서 상세** (`/share/[token]/invoices/[id]`)
   - 견적서 내용 확인, PDF 다운로드
   - F003, F009: 조회, PDF 다운로드

## ⚡ 핵심 기능

### 인증 및 권한관리
- **F001** - 관리자 인증: 이메일과 비밀번호를 통한 관리자 로그인

### 견적서 관리
- **F002** - 견적서 조회: 관리자가 발급한 모든 견적서 목록 조회
- **F003** - 견적서 상세 조회: 견적서의 모든 항목 및 금액 정보 표시
- **F004** - 견적서 생성: 새로운 견적서 작성 및 저장
- **F005** - 견적서 수정: 발급된 견적서 내용 편집 (관리자만)
- **F006** - 견적서 삭제: 발급된 견적서 삭제 (관리자만)

### 공유 및 PDF
- **F007** - 공유 링크 생성: 클라이언트가 접근할 수 있는 고유 공유 URL 생성
- **F008** - 공유 링크 조회: 고유 공유 링크로 견적서 열람 (인증 불필요)
- **F009** - PDF 다운로드: 견적서를 PDF 형식으로 다운로드

### UI/UX
- **F010** - 기본 폼 입력: 견적서 제목, 설명, 항목 입력 폼
- **F011** - 사용자 정보 관리: 로그인한 사용자 정보 저장 및 조회
- **F012** - 오류 처리 및 알림: 사용자 친화적 에러 메시지 및 성공 알림

## 🛠️ 기술 스택

### 프론트엔드
- **Framework**: Next.js 16.1.1 (App Router)
- **Runtime**: React 19.2.3
- **Language**: TypeScript 5+ (Strict Mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand 5.0.9
- **Form Handling**: React Hook Form 7.69.0
- **Validation**: Zod 4.3.4
- **Icons**: Lucide React
- **Date Handling**: date-fns 4.1.0
- **Toast Notifications**: Sonner 2.0.7
- **Theme**: next-themes 0.4.6

### 개발 도구
- **Linter**: ESLint 9
- **TypeScript**: Strict Mode 활성화
- **Package Manager**: npm

### 배포
- **Platform**: Vercel (권장)

## 🚀 시작하기

### 필수 요구사항
- Node.js 20.x 이상
- npm 또는 pnpm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
# http://localhost:3000 에서 앱 실행됩니다

# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start

# 린트 검사
npm run lint
```

## 📂 프로젝트 구조

```
invoice-web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 로그인 페이지
│   ├── globals.css              # 글로벌 스타일
│   └── (protected)/             # 인증이 필요한 라우트 그룹
│       ├── layout.tsx           # 보호된 라우트 레이아웃
│       ├── dashboard/
│       │   └── page.tsx         # 대시보드
│       ├── invoices/
│       │   ├── page.tsx         # 견적서 목록
│       │   ├── new/
│       │   │   └── page.tsx     # 새 견적서 생성
│       │   └── [id]/
│       │       └── page.tsx     # 견적서 상세 (관리자 모드)
│       └── share/
│           └── [token]/
│               ├── page.tsx     # 공개 견적서 목록
│               └── invoices/[id]/
│                   └── page.tsx # 공개 견적서 상세 (클라이언트 모드)
│
├── components/
│   ├── ui/                      # shadcn/ui 기본 컴포넌트
│   ├── layout/                  # 레이아웃 컴포넌트
│   │   ├── app-layout.tsx       # 앱 전체 레이아웃
│   │   ├── header.tsx           # 헤더/네비게이션
│   │   ├── sidebar.tsx          # 사이드바
│   │   └── ...
│   └── features/                # 기능별 컴포넌트
│       ├── theme-toggle.tsx     # 테마 토글
│       ├── user-nav.tsx         # 사용자 네비게이션
│       └── ...
│
├── lib/
│   ├── utils.ts                 # 유틸리티 함수 (cn 등)
│   ├── constants.ts             # 상수 (APP_CONFIG, MAIN_NAV_ITEMS)
│   └── api.ts                   # API 클라이언트 (개발 필요)
│
├── hooks/
│   ├── useAuth.ts               # 인증 훅 (개발 필요)
│   ├── useInvoice.ts            # 견적서 훅 (개발 필요)
│   └── use-sidebar.ts           # 사이드바 훅
│
├── store/
│   ├── useAuthStore.ts          # 인증 상태 (Zustand)
│   ├── useInvoiceStore.ts       # 견적서 상태 (Zustand)
│   └── use-ui-store.ts          # UI 상태 (Zustand)
│
├── types/
│   └── index.ts                 # TypeScript 타입 정의
│
├── providers/
│   └── theme-provider.tsx       # 테마 프로바이더
│
├── public/                      # 정적 자산
├── docs/
│   ├── PRD.md                   # 프로젝트 요구사항
│   └── ROADMAP.md               # 개발 로드맵
├── tsconfig.json                # TypeScript 설정
├── tailwind.config.ts           # Tailwind CSS 설정
├── package.json                 # 패키지 메타데이터
└── README.md                    # 이 파일
```

## 📊 데이터 모델

### User (사용자)
```typescript
{
  id: string;           // UUID
  email: string;        // UNIQUE
  password: string;     // 해시됨
  name: string;
  role: 'admin' | 'client';
  createdAt: Date;
  updatedAt: Date;
}
```

### Invoice (견적서)
```typescript
{
  id: string;           // UUID
  title: string;
  description?: string;
  createdBy: string;    // User.id
  clientName: string;
  clientEmail?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  totalAmount: number;
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

### InvoiceItem (견적서 항목)
```typescript
{
  id: string;           // UUID
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  displayOrder: number;
}
```

### InvoiceShare (공유 링크)
```typescript
{
  id: string;           // UUID
  invoiceId: string;
  token: string;        // UNIQUE
  expiresAt?: Date;
  createdAt: Date;
}
```

## 📈 개발 진행도

### Phase 1: 기본 구조 및 인증
- [x] 프로젝트 초기화 (Next.js 15 + shadcn/ui)
- [ ] 로그인 페이지 UI 완성
- [ ] 인증 로직 구현
- [ ] 보호된 라우트 설정
- [ ] 사용자 상태 관리 (Zustand)

### Phase 2: 견적서 관리 기능
- [ ] 대시보드 페이지 구현
- [ ] 견적서 목록 테이블 구현
- [ ] 견적서 생성/수정 폼 구현
- [ ] 견적서 상세 페이지 구현
- [ ] 견적서 삭제 기능 구현
- [ ] 백엔드 API 연동

### Phase 3: 공유 및 PDF 기능
- [ ] 공유 링크 생성 로직 구현
- [ ] 공개 견적서 목록 페이지 구현
- [ ] 공개 견적서 상세 페이지 구현
- [ ] PDF 다운로드 기능 구현
- [ ] 보안 및 성능 최적화

### Phase 4: 테스트 및 배포
- [ ] 단위 테스트 작성
- [ ] E2E 테스트 (Playwright)
- [ ] 성능 최적화
- [ ] 배포 준비 및 Vercel 배포

## 🔐 보안 고려사항

1. **인증 및 권한**
   - 모든 API 요청은 HTTPS 사용
   - 인증 토큰은 httpOnly 쿠키에 저장 권장
   - 공유 링크는 예측 불가능한 토큰 사용 (UUID)

2. **데이터 무결성**
   - 견적서 삭제 시 아카이빙 고려 (물리적 삭제 대신 soft delete)
   - 감사 로그 기록 (추후 기능)

## 📋 개발 규칙

- **언어**: 모든 주석 및 문서는 한국어로 작성
- **변수명**: camelCase (영어)
- **컴포넌트**: PascalCase
- **들여쓰기**: 2 spaces
- **타입**: TypeScript Strict Mode 필수

## 📖 문서

- [PRD (Product Requirements Document)](./docs/PRD.md) - 상세 요구사항
- [ROADMAP](./docs/ROADMAP.md) - 개발 로드맵
- [개발자 가이드](./docs/DEVELOPER.md) - 새로운 개발자 온보딩 및 개발 환경 설정
- [API 문서](./docs/API.md) - 모든 API 엔드포인트 및 사용 방법
- [배포 가이드](./docs/DEPLOYMENT.md) - Vercel 배포 단계별 가이드
- [개발 규칙](./CLAUDE.md) - 코딩 컨벤션 및 개발 표준

## 🙏 기여

이 프로젝트는 현재 활발히 개발 중입니다. 버그 리포트나 기능 제안은 이슈로 등록해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

## 💬 지원

질문이나 문제가 있으시면 이슈를 등록해주세요. 최대한 빠르게 답변드리겠습니다.

---

**마지막 업데이트**: 2026년 1월 21일
**현재 버전**: 0.2.0 (문서화 단계)