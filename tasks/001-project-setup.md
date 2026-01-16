# Task 001: 프로젝트 구조 및 라우팅 설정

**우선순위**: 높음 | **의존성**: 없음 | **기대 기간**: 1-2일

---

## 개요

Next.js App Router 기반의 모든 라우트 구조를 생성하고, 인증이 필요한 라우트 그룹과 공개 라우트를 분리하여 애플리케이션 기초를 마련합니다. 모든 주요 페이지의 빈 껍데기 파일을 생성하여 개발 팀이 동시에 여러 페이지를 개발할 수 있는 환경을 구축합니다.

---

## 요구사항

### 기능 요구사항

- Next.js App Router 기반 라우트 구조 최적화
- 인증이 필요한 라우트 그룹 `(protected)` 설정
- 공개 라우트 구조 (공유 링크) 설정
- 모든 주요 페이지의 빈 Server Component 생성
- TypeScript 타입 안전성 유지

### 기술 요구사항

- Next.js 16.1.1 (App Router)
- TypeScript 5.6+
- 라우트 그룹 (Route Groups) 패턴

---

## 관련 파일

```
새로 생성:
- /app/(protected)/layout.tsx
- /app/(protected)/dashboard/page.tsx
- /app/(protected)/invoices/page.tsx
- /app/(protected)/invoices/new/page.tsx
- /app/(protected)/invoices/[id]/page.tsx
- /app/share/[token]/page.tsx
- /app/share/[token]/invoices/[id]/page.tsx

수정:
- /app/page.tsx (홈/로그인 페이지)
- /app/layout.tsx (루트 레이아웃 - 확인)
```

---

## 구현 체크리스트

### 1단계: 라우트 구조 검증 및 설정

- [ ] 현재 `/app` 디렉토리 구조 확인
- [ ] `/app/(protected)` 디렉토리 생성 (라우트 그룹)
- [ ] `/app/(protected)/layout.tsx` 생성:
  ```typescript
  // 기본 레이아웃 구조
  - 헤더 자리 (추후 Header 컴포넌트)
  - 사이드바 자리 (추후 Sidebar 컴포넌트)
  - {children} 영역
  - 푸터 자리 (선택사항)
  ```
- [ ] `/app/share` 디렉토리 생성 (공개 페이지)

### 2단계: 보호된 라우트 페이지 생성

- [ ] `/app/(protected)/dashboard/page.tsx` 생성:
  ```typescript
  export default function DashboardPage() {
    return <div>대시보드 페이지 (Task 006에서 구현)</div>
  }
  ```
- [ ] `/app/(protected)/invoices/page.tsx` 생성:
  ```typescript
  export default function InvoicesPage() {
    return <div>견적서 목록 페이지 (Task 006에서 구현)</div>
  }
  ```
- [ ] `/app/(protected)/invoices/new/page.tsx` 생성:
  ```typescript
  export default function NewInvoicePage() {
    return <div>새 견적서 생성 페이지 (Task 007에서 구현)</div>
  }
  ```
- [ ] `/app/(protected)/invoices/[id]/page.tsx` 생성:
  ```typescript
  export default function InvoiceDetailPage() {
    return <div>견적서 상세 페이지 (Task 008에서 구현)</div>
  }
  ```

### 3단계: 공개 라우트 페이지 생성

- [ ] `/app/share/[token]/page.tsx` 생성:
  ```typescript
  export default function ShareListPage() {
    return <div>공유 견적서 목록 페이지 (Task 009에서 구현)</div>
  }
  ```
- [ ] `/app/share/[token]/invoices/[id]/page.tsx` 생성:
  ```typescript
  export default function ShareDetailPage() {
    return <div>공유 견적서 상세 페이지 (Task 010에서 구현)</div>
  }
  ```

### 4단계: 루트 페이지 확인

- [ ] `/app/page.tsx` 확인 (홈/로그인 페이지):
  ```typescript
  // 현재 상태 확인 - 로그인 폼 UI 기본 구조 있는지 확인
  export default function HomePage() {
    return <div>로그인 페이지 (Task 005에서 UI 완성)</div>
  }
  ```

### 5단계: 레이아웃 구조 설정

- [ ] `/app/layout.tsx` 확인:
  - Theme Provider 설정 확인
  - Toast Provider 설정 확인
  - 메타데이터 설정 확인
- [ ] `/app/(protected)/layout.tsx` 생성:
  ```typescript
  // 보호된 라우트용 레이아웃
  import Header from '@/components/layout/header'
  import Sidebar from '@/components/layout/sidebar'

  export default function ProtectedLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    )
  }
  ```

### 6단계: TypeScript 타입 확인

- [ ] `/app` 내 모든 page.tsx에 적절한 타입 적용
- [ ] 동적 라우트 매개변수 타입 정의 (예: `[id]`, `[token]`)

### 7단계: 빌드 및 테스트

- [ ] `npm run build` 실행 (TypeScript 에러 없음)
- [ ] `npm run dev` 실행
- [ ] 각 라우트 접근 확인:
  - `http://localhost:3000` → 홈 페이지
  - `http://localhost:3000/dashboard` → 대시보드 (아직 구현 전)
  - `http://localhost:3000/invoices` → 견적서 목록
  - `http://localhost:3000/invoices/new` → 새 견적서
  - `http://localhost:3000/invoices/1` → 견적서 상세
  - `http://localhost:3000/share/abc123` → 공유 목록

---

## 수락 기준

1. **라우트 구조**
   - 모든 주요 페이지에 접근 가능 (404 에러 없음)
   - 라우트 그룹 `(protected)` 정상 작동
   - 동적 라우트 매개변수 전달 확인

2. **코드 품질**
   - TypeScript 컴파일 에러 없음
   - 모든 page.tsx가 Server Component로 설정
   - 파일 구조가 명확하고 일관성 있음

3. **빌드**
   - `npm run build` 성공
   - `npm run dev` 정상 작동

---

## 구현 상태

### 진행 상황 요약

- [ ] 1단계: 라우트 구조 검증
- [ ] 2단계: 보호된 라우트 페이지 생성
- [ ] 3단계: 공개 라우트 페이지 생성
- [ ] 4단계: 루트 페이지 확인
- [ ] 5단계: 레이아웃 구조 설정
- [ ] 6단계: TypeScript 타입 확인
- [ ] 7단계: 빌드 및 테스트

### 변경 사항 요약

작업 완료 후 이 섹션을 업데이트하세요:
- 생성된 파일 목록
- 수정된 파일 목록
- 발견된 이슈 및 해결 방법

---

## 참고 자료

- Next.js App Router 문서: https://nextjs.org/docs/app
- Route Groups 패턴: https://nextjs.org/docs/app/building-your-application/routing/route-groups

---

**작업 생성일**: 2026년 1월 16일
**상태**: 진행 예정
