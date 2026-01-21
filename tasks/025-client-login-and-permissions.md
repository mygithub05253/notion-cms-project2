# Task 025: 클라이언트 로그인 기능 및 권한 관리

**상태**: 진행 예정
**우선순위**: 높음 (Phase 5 두 번째 Task)
**의존성**: Task 024 (랜딩 페이지 및 로그인 분기)
**예상 기간**: 2-3일
**시작 예정일**: 2026-01-24

---

## 목표

클라이언트 역할 기반 인증 시스템을 구현하고, 클라이언트 대시보드 페이지를 생성하여 공유 링크 기반 견적서 접근을 강화합니다. 또한 권한 관리 시스템을 완성하여 관리자와 클라이언트의 접근 범위를 명확히 합니다.

---

## 현재 문제

1. **클라이언트 인증 메커니즘 부재**
   - 클라이언트용 별도 로그인 로직 없음
   - 클라이언트 역할 처리 미흡

2. **클라이언트 대시보드 없음**
   - 클라이언트가 공유 링크 기반으로만 접근
   - 클라이언트용 중앙 집중식 대시보드 부재

3. **권한 관리 시스템 미완성**
   - 역할별 접근 제어 부분적
   - 라우트 보호 로직 미흡

---

## 구현 사항

### 1. User 모델 및 타입 확장 (`/types/index.ts`)

- [ ] User 타입에 필드 추가 (필요시)
  - [ ] `role: 'admin' | 'client'` (이미 있을 가능성)
  - [ ] `profile?: { company?: string, phone?: string }` (선택사항)
- [ ] UserRole 타입 확인
  ```typescript
  type UserRole = 'admin' | 'client';
  ```
- [ ] 권한 관련 타입 추가
  ```typescript
  type Permission = 'read:invoices' | 'create:invoices' | 'update:invoices' | 'delete:invoices' | ...;
  ```

### 2. 클라이언트 로그인 API 구현 (`/lib/api.ts` 확장)

- [ ] 클라이언트 인증 엔드포인트 추가
  ```typescript
  loginClientApi(email: string, token?: string): Promise<LoginResponse>;
  ```
- [ ] 기존 `loginApi` 함수와 통합
  - [ ] 관리자: `loginApi(email, password)` → role: 'admin'
  - [ ] 클라이언트: `loginClientApi(email, token)` → role: 'client'
- [ ] 또는 공유 링크 기반 인증
  ```typescript
  loginWithShareTokenApi(token: string): Promise<LoginResponse>;
  ```

### 3. Zustand 인증 스토어 확장 (`/store/useAuthStore.ts`)

- [ ] 상태 추가
  - [ ] `userRole: 'admin' | 'client' | null` (또는 User.role 사용)
  - [ ] `permissions: Permission[]` (선택사항)
- [ ] 액션 추가
  ```typescript
  loginClient(email: string, token?: string): Promise<void>
  loginWithShareToken(token: string): Promise<void>
  hasPermission(permission: Permission): boolean
  hasRole(role: UserRole | UserRole[]): boolean
  ```
- [ ] 기존 액션 확장
  ```typescript
  login(email, password): Promise<void>  // 관리자 전용으로 명시
  ```

### 4. 클라이언트 대시보드 페이지 생성 (`/app/(protected)/client-dashboard/page.tsx`)

- [ ] 페이지 제목: "클라이언트 대시보드" 또는 "내 견적서"
- [ ] 클라이언트가 접근한 공유 견적서 목록 표시
  - [ ] 카드 형식 또는 테이블 형식
  - [ ] 각 견적서: 제목, 발급자, 생성일, 상태, "보기" 버튼
- [ ] 필터링/정렬 (선택사항)
  - [ ] 최신순/생성일순 정렬
  - [ ] 상태별 필터 (draft, sent, accepted, rejected)
- [ ] 공유 링크 변환
  - [ ] 기존에 공유 링크로 접근했던 견적서를 대시보드에서도 보기
  - [ ] 공유 토큰 기반에서 사용자 기반으로 전환 (선택사항)
- [ ] 빈 상태 처리
  - [ ] "아직 공유된 견적서가 없습니다"
  - [ ] "공유 링크를 통해 견적서를 확인하세요"

### 5. 클라이언트 프로필 페이지 (선택사항)

- [ ] 페이지: `/app/(protected)/client-profile/page.tsx`
- [ ] 클라이언트 정보 조회
  - [ ] 이메일
  - [ ] 이름
  - [ ] 가입 날짜
- [ ] 로그아웃 버튼
- [ ] 설정 (선택사항)
  - [ ] 이메일 알림 수신 여부
  - [ ] 테마 설정

### 6. 권한 검사 미들웨어 구현 (`/middleware.ts` 확장)

- [ ] 라우트별 역할 요구사항 정의
  ```typescript
  const roleRequiredRoutes = {
    '/dashboard': ['admin'],
    '/invoices': ['admin'],
    '/client-dashboard': ['client'],
    '/share': ['client', 'public']  // 공개
  };
  ```
- [ ] 요청 시 토큰 검증 및 역할 확인
- [ ] 역할 불일치 시 리디렉션
  - [ ] 관리자가 클라이언트 라우트 접근 → 관리자 대시보드로 리디렉션
  - [ ] 클라이언트가 관리자 라우트 접근 → 클라이언트 대시보드로 리디렉션
  - [ ] 미인증 → 로그인 분기 페이지로 리디렉션

### 7. AuthGuard 컴포넌트 확장 (`/components/features/auth-guard.tsx`)

- [ ] 기존 역할 확인 로직 유지
- [ ] 역할 불일치 시 처리 개선
  ```typescript
  if (requiredRole && !authStore.hasRole(requiredRole)) {
    // 리디렉션 또는 에러 표시
  }
  ```
- [ ] 권한 기반 접근 제어 (선택사항)
  ```typescript
  if (!authStore.hasPermission(requiredPermission)) {
    // 접근 거부
  }
  ```

### 8. 레이아웃 컴포넌트 조정

- [ ] `/app/(protected)/layout.tsx`에서 역할별 헤더/사이드바 커스터마이징
  - [ ] 관리자: 대시보드, 견적서 관리, 설정 메뉴
  - [ ] 클라이언트: 내 견적서, 프로필 메뉴
- [ ] 네비게이션 링크 역할별 필터링

### 9. 로그아웃 기능

- [ ] 기존 로그아웃 로직 유지
- [ ] 로그아웃 후 로그인 분기 페이지로 리디렉션

---

## 구현 체크리스트

### Phase 1: 타입 및 API 정의

- [ ] `/types/index.ts`에서 User 타입 확인 (role 필드)
- [ ] 권한 관련 타입 추가 (필요시)
- [ ] `/lib/api.ts`에 클라이언트 인증 API 추가
  - [ ] `loginClientApi(email, token?)` 함수
  - [ ] 또는 기존 `loginApi` 확장

### Phase 2: 상태 관리 확장

- [ ] `/store/useAuthStore.ts`에 클라이언트 액션 추가
  - [ ] `loginClient()` 액션
  - [ ] `hasRole()` 메서드
  - [ ] `hasPermission()` 메서드 (선택사항)

### Phase 3: 클라이언트 대시보드 구현

- [ ] `/app/(protected)/client-dashboard/page.tsx` 생성
- [ ] 공유 견적서 목록 표시 로직
- [ ] 빈 상태 처리
- [ ] 반응형 디자인 적용

### Phase 4: 권한 관리 시스템

- [ ] `/middleware.ts` 확장
- [ ] `/components/features/auth-guard.tsx` 확장
- [ ] 라우트 보호 테스트

### Phase 5: 스타일링 및 최적화

- [ ] 클라이언트 대시보드 스타일링 (다크모드 포함)
- [ ] 모바일 레이아웃 확인
- [ ] 성능 최적화 (필요시)

---

## 수락 기준

- [ ] 클라이언트 로그인 플로우 완전 구현
- [ ] 클라이언트 대시보드 페이지 생성 및 작동
- [ ] 관리자는 클라이언트 대시보드 접근 불가 (리디렉션)
- [ ] 클라이언트는 관리자 대시보드 접근 불가 (리디렉션)
- [ ] 공유 링크는 인증 없이 접근 가능 (기존 기능 유지)
- [ ] 로그아웃 후 인증 상태 완전 제거
- [ ] 모바일과 데스크톱에서 모두 정상 작동
- [ ] npm run build 성공
- [ ] TypeScript 컴파일 에러 없음

---

## 테스트 체크리스트 (Playwright MCP)

### 테스트 시나리오

1. **클라이언트 로그인 플로우**
   - [ ] 로그인 분기 페이지에서 "클라이언트 로그인" 클릭
   - [ ] 클라이언트 로그인 페이지로 이동
   - [ ] 클라이언트 이메일 입력 및 로그인
   - [ ] 클라이언트 대시보드로 리디렉션

2. **클라이언트 대시보드**
   - [ ] 클라이언트 대시보드 페이지 렌더링
   - [ ] 공유된 견적서 목록 표시
   - [ ] 각 견적서에 "보기" 버튼 표시
   - [ ] "보기" 클릭 시 견적서 상세 페이지로 이동

3. **권한 관리 - 클라이언트 제한**
   - [ ] 클라이언트로 로그인된 상태
   - [ ] `/dashboard` (관리자 대시보드) 접근 시도
   - [ ] 클라이언트 대시보드로 리디렉션 확인
   - [ ] `/invoices/new` (견적서 생성) 접근 시도
   - [ ] 리디렉션 또는 접근 거부 확인

4. **권한 관리 - 관리자 제한**
   - [ ] 관리자로 로그인된 상태
   - [ ] `/client-dashboard` 접근 시도
   - [ ] 관리자 대시보드로 리디렉션 또는 접근 거부

5. **로그아웃**
   - [ ] 클라이언트 대시보드에서 로그아웃 버튼 클릭
   - [ ] 로그인 분기 페이지로 리디렉션
   - [ ] 이전 페이지 접근 불가 확인

6. **공유 링크 접근 (인증 불필요)**
   - [ ] 로그인하지 않은 상태에서 공유 링크 접근
   - [ ] 공유 견적서 목록 표시 확인
   - [ ] 로그인 후에도 접근 가능 확인

7. **모바일 반응형**
   - [ ] 모바일 뷰에서 클라이언트 대시보드 레이아웃 확인
   - [ ] 목록 아이템 터치 가능성 확인

---

## 참고 파일

- **인증 스토어**: `/store/useAuthStore.ts`
- **API 클라이언트**: `/lib/api.ts`
- **미들웨어**: `/middleware.ts`
- **AuthGuard**: `/components/features/auth-guard.tsx`
- **레이아웃**: `/app/(protected)/layout.tsx`
- **타입**: `/types/index.ts`

---

## 변경 사항 요약

### 신규 파일
- `/app/(protected)/client-dashboard/page.tsx` (클라이언트 대시보드)
- `/app/(protected)/client-profile/page.tsx` (선택사항)

### 수정 파일
- `/types/index.ts` (권한 타입 추가)
- `/lib/api.ts` (클라이언트 인증 API 추가)
- `/store/useAuthStore.ts` (클라이언트 액션 추가)
- `/middleware.ts` (권한 검사 확장)
- `/components/features/auth-guard.tsx` (역할 확인 확장)
- `/app/(protected)/layout.tsx` (네비게이션 커스터마이징)

---

## 다음 Task

**Task 026: 다크모드 UI 개선 및 테마 토글 완성**
- 모든 페이지 다크모드 호환성 검증
- 테마 토글 버튼 추가

---

**작성일**: 2026-01-21
**버전**: 1.0
**상태**: 진행 예정
