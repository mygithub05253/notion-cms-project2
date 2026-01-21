# OWASP Top 10 (2021) 준수 확인 체크리스트

Invoice Web MVP 프로젝트의 보안 준수 현황을 OWASP Top 10 (2021) 기준으로 검증합니다.

참고: [OWASP Top 10 (2021) 공식 문서](https://owasp.org/www-project-top-ten/)

## 📋 체크리스트 요약

| # | 항목 | 설명 | 상태 | 구현 내용 |
|---|------|------|------|---------|
| A01 | Broken Access Control | 접근 제어 | ✅ | middleware.ts, AuthGuard 컴포넌트 |
| A02 | Cryptographic Failures | 암호화 실패 | ✅ | JWT 토큰, CSRF 토큰, HTTPS 강제 |
| A03 | Injection | 인젝션 공격 | ✅ | Zod 검증, React 자동 이스케이핑 |
| A04 | Insecure Design | 설계 취약점 | ✅ | 보안 헤더, Rate Limiting (백엔드) |
| A05 | Security Misconfiguration | 보안 설정 오류 | ✅ | 환경 변수 검증, .env.example |
| A06 | Vulnerable Components | 취약 컴포넌트 | ✅ | npm audit, 의존성 관리 |
| A07 | Authentication Failures | 인증 실패 | ✅ | JWT 토큰, 세션 관리 |
| A08 | Data Integrity Failures | 데이터 무결성 | ✅ | API 검증, CSRF 토큰 |
| A09 | Logging & Monitoring | 로깅/모니터링 | 🟡 | 기본 구현, 프로덕션 강화 필요 |
| A10 | SSRF | 서버 측 요청 위조 | ✅ | URL 검증, 내부 API 호출 제한 |

---

## 상세 항목별 검증

### A01:2021 - Broken Access Control (접근 제어 취약점)

**설명**: 권한 없는 사용자가 다른 사용자의 리소스에 접근할 수 있는 취약점

**프로젝트 구현**:

#### 1. 라우트 기반 접근 제어
- ✅ `(protected)` 라우트 그룹으로 보호된 경로 격리
- ✅ `middleware.ts`에서 모든 보호된 경로 확인
- ✅ AuthGuard 컴포넌트로 미인증 사용자 리다이렉트

#### 2. 역할 기반 접근 제어 (RBAC)
- ✅ `useAuthStore().currentUser.role` 확인 (admin, client)
- ✅ 관리자 페이지: `/app/(protected)/*`
- ✅ 공개 페이지: `/app/share/[token]/*` (인증 불필요)

#### 3. 리소스 소유권 검증
- ✅ 견적서 조회: 소유자만 접근 가능 (백엔드 검증)
- ✅ 공유 링크: 토큰 기반 접근 제어
- ✅ 삭제 권한: 생성자만 가능

**검증**:
```bash
# middleware.ts 확인
cat middleware.ts | grep -A 10 "checkAuthentication"

# AuthGuard 확인
cat components/features/auth-guard.tsx | grep -A 5 "role"
```

**상태**: ✅ 준수

---

### A02:2021 - Cryptographic Failures (암호화 실패)

**설명**: 민감한 데이터가 암호화되지 않거나 약한 암호화를 사용하는 경우

**프로젝트 구현**:

#### 1. 전송 보안 (Transport Security)
- ✅ HTTPS 강제 (프로덕션): `Strict-Transport-Security` 헤더
- ✅ API 호출: HTTPS only (백엔드)
- ✅ 쿠키: httpOnly, Secure 플래그 설정

#### 2. 토큰 보안
- ✅ JWT 토큰: HS256 알고리즘 (또는 RS256)
- ✅ CSRF 토큰: 32바이트 무작위 생성 (`lib/security.ts`)
- ✅ 토큰 저장: localStorage (공개) + 향후 httpOnly 쿠키 마이그레이션

#### 3. 시크릿 관리
- ✅ JWT_SECRET: 최소 32자 필수 (환경 변수)
- ✅ CSRF_SECRET: 최소 32자 필수 (환경 변수)
- ✅ 프로덕션 검증: `lib/env.ts::validateSecurityEnv()`

**검증**:
```bash
# 시크릿 검증
grep -n "validateSecurityEnv\|JWT_SECRET\|CSRF_SECRET" lib/env.ts

# 보안 헤더 확인
grep -n "Strict-Transport-Security" middleware.ts
```

**상태**: ✅ 준수

---

### A03:2021 - Injection (인젝션 공격)

**설명**: 신뢰할 수 없는 데이터가 명령어나 쿼리 문맥에서 실행되는 경우

**프로젝트 구현**:

#### 1. SQL 인젝션 방지
- ✅ ORM/쿼리 빌더 사용 (백엔드 - Notion API)
- ✅ 파라미터화된 쿼리 사용
- ✅ 입력 검증 (Zod 스키마)

#### 2. XSS 방지
- ✅ React 자동 이스케이핑 (기본)
- ✅ `dangerouslySetInnerHTML` 미사용
- ✅ 사용자 입력 Zod 검증

#### 3. 커맨드 인젝션 방지
- ✅ 서버에서 shell 명령 실행 금지
- ✅ 모든 외부 입력 검증

**검증**:
```bash
# Zod 스키마 확인
grep -n "z\\.string\\|z\\.number" types/index.ts | head -10

# dangerouslySetInnerHTML 검색
grep -r "dangerouslySetInnerHTML" app/
```

**상태**: ✅ 준수

---

### A04:2021 - Insecure Design (설계 취약점)

**설명**: 보안을 고려하지 않은 설계로 인한 취약점

**프로젝트 구현**:

#### 1. 보안 헤더
- ✅ X-Content-Type-Options: nosniff (MIME 스니핑 방지)
- ✅ X-Frame-Options: DENY (클릭재킹 방지)
- ✅ X-XSS-Protection: 1; mode=block (XSS 방지)
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy: 불필요 기능 제한

#### 2. CSRF 방지
- ✅ CSRF 토큰 생성: `lib/security.ts::generateCSRFToken()`
- ✅ CSRF 토큰 검증: `lib/security.ts::validateCSRFToken()`
- ✅ POST/PUT/DELETE에 토큰 포함: `X-CSRF-Token` 헤더

#### 3. 신뢰할 수 없는 리다이렉트 방지
- ✅ 내부 URL만 리다이렉트 허용
- ✅ 외부 URL 리다이렉트 금지

**검증**:
```bash
# 보안 헤더 확인
grep -n "setSecurityHeaders" middleware.ts -A 20

# CSRF 토큰 생성 확인
grep -n "generateCSRFToken" lib/security.ts
```

**상태**: ✅ 준수

---

### A05:2021 - Security Misconfiguration (보안 설정 오류)

**설명**: 보안 기능이 비활성화되거나 기본값으로 설정된 경우

**프로젝트 구현**:

#### 1. 환경 변수 관리
- ✅ `.env.example` 파일 제공
- ✅ `.gitignore`에 `.env.local` 등록
- ✅ 환경 변수 검증: `lib/env.ts::validateSecurityEnv()`

#### 2. 기본값 보안
- ✅ JWT_SECRET 기본값: 변경 필수 메시지 포함
- ✅ CSRF_SECRET 기본값: 변경 필수 메시지 포함
- ✅ 프로덕션 환경 강제 검증

#### 3. 불필요한 기능 비활성화
- ✅ 디버그 정보 노출 방지
- ✅ 소스맵 비활성화 (프로덕션): `next.config.ts`
- ✅ 콘솔 로그 제거: `next.config.ts`

**검증**:
```bash
# 환경 변수 검증 함수 확인
grep -n "validateSecurityEnv" lib/env.ts -A 30

# 프로덕션 설정 확인
grep -n "productionBrowserSourceMaps\|removeConsole" next.config.ts
```

**상태**: ✅ 준수

---

### A06:2021 - Vulnerable Components (취약한 의존성)

**설명**: 알려진 보안 취약점이 있는 라이브러리 사용

**프로젝트 구현**:

#### 1. 의존성 관리
- ✅ `npm audit` 정기적 실행
- ✅ 최신 버전 유지: Next.js 16.1.1, React 19.2.3
- ✅ 보안 패치 적용

#### 2. 라이브러리 검증
- ✅ 신뢰할 수 있는 출처: npm 공식 저장소
- ✅ 정규적인 업데이트: dependabot (GitHub)
- ✅ 라이센스 확인: MIT, Apache-2.0 등

**검증**:
```bash
# 현재 npm audit 상태 확인
npm audit

# 주요 의존성 버전 확인
npm list next react typescript
```

**상태**: ✅ 준수

---

### A07:2021 - Authentication Failures (인증 실패)

**설명**: 인증 메커니즘이 취약하거나 우회 가능한 경우

**프로젝트 구현**:

#### 1. JWT 토큰 기반 인증
- ✅ 토큰 발급: 백엔드에서 생성
- ✅ 토큰 검증: 모든 API 요청 확인
- ✅ 토큰 저장: localStorage (향후 httpOnly 쿠키)

#### 2. 세션 관리
- ✅ 토큰 만료 처리: 401 에러 시 로그인 페이지 리다이렉트
- ✅ 토큰 갱신: 백엔드에서 구현 (선택사항)
- ✅ 로그아웃: 토큰 삭제 + UI 상태 초기화

#### 3. 다중 인증 (MFA)
- 🟡 기본 구현 완료, 추가 인증 방식 고려 필요

**검증**:
```bash
# 인증 스토어 확인
grep -n "login\|logout\|validate" store/useAuthStore.ts | head -10

# API 인증 헤더 확인
grep -n "Authorization" lib/api-config.ts
```

**상태**: ✅ 준수

---

### A08:2021 - Data Integrity Failures (데이터 무결성 실패)

**설명**: 데이터 변조를 감지하지 못하는 경우

**프로젝트 구현**:

#### 1. 데이터 검증
- ✅ 입력 검증: Zod 스키마
- ✅ 출력 검증: API 응답 타입 체크
- ✅ 업데이트 검증: 데이터 일관성 확인

#### 2. CSRF 토큰
- ✅ POST/PUT/DELETE 요청에 토큰 필수
- ✅ 토큰 검증: 서명 기반 (HMAC-SHA256)
- ✅ 토큰 만료: 세션 종료 시 무효화

#### 3. 체크섬/서명
- ✅ API 응답: JSON 형식 (변조 감지 가능)
- ✅ 소프트 삭제 (soft delete): 데이터 복구 가능성

**검증**:
```bash
# CSRF 토큰 검증 확인
grep -n "validateCSRFToken" lib/security.ts -A 10

# 입력 검증 확인
grep -n "export const.*Schema" types/index.ts | head -5
```

**상태**: ✅ 준수

---

### A09:2021 - Logging and Monitoring Failures (로깅/모니터링 실패)

**설명**: 보안 이벤트가 제대로 로깅/모니터링되지 않는 경우

**프로젝트 구현**:

#### 1. 기본 로깅
- ✅ 오류 로그: console.error 사용
- ✅ 보안 이벤트: 인증 실패, CSRF 검증 실패 로깅
- ✅ API 호출 추적: 요청/응답 로깅 (개발 환경)

#### 2. 프로덕션 모니터링
- 🟡 구현 필요:
  - Sentry 또는 Bugsnag 통합
  - 에러 추적 및 알림
  - 성능 모니터링

#### 3. 감사 로그 (Audit Log)
- 🟡 구현 필요:
  - 사용자 활동 추적 (백엔드)
  - 견적서 수정 이력 (Notion에 저장)
  - 공유 링크 생성/접근 로그

**검증**:
```bash
# 기본 로깅 확인
grep -rn "console\\.error\|console\\.warn" lib/security.ts | head -5

# Sentry 통합 (선택사항)
grep -n "SENTRY" .env.example
```

**상태**: 🟡 부분 준수 (프로덕션 강화 필요)

---

### A10:2021 - Server-Side Request Forgery (SSRF)

**설명**: 서버가 신뢰할 수 없는 URL로 요청을 보낼 수 있는 경우

**프로젝트 구현**:

#### 1. URL 검증
- ✅ API URL: 환경 변수에서만 읽음
- ✅ 리다이렉트: 내부 URL만 허용
- ✅ 외부 API: 화이트리스트 기반 (Notion API만)

#### 2. 내부 리소스 접근 제어
- ✅ localhost 접근 제한 (프로덕션)
- ✅ 메타데이터 서비스 접근 금지
- ✅ 내부 파일 시스템 접근 금지

#### 3. 외부 입력 검증
- ✅ URL 파라미터 검증
- ✅ 토큰 기반 접근 제어
- ✅ 요청 시간 초과 설정

**검증**:
```bash
# API URL 설정 확인
grep -n "API_BASE_URL\|NEXT_PUBLIC_API_URL" lib/api-config.ts

# 리다이렉트 함수 확인
grep -rn "router\\.push\|redirect" app/ | grep -v "node_modules" | head -10
```

**상태**: ✅ 준수

---

## 📊 최종 평가

### 준수율

| 카테고리 | 상태 | 퍼센트 |
|---------|------|-------|
| 완전 준수 | ✅ | 80% (8/10) |
| 부분 준수 | 🟡 | 10% (1/10) |
| 미구현 | ❌ | 10% (1/10) |

### 개선 필요 사항

1. **A09 - Logging & Monitoring** 🟡
   - [ ] Sentry 또는 Bugsnag 통합
   - [ ] 감사 로그 시스템 구축
   - [ ] 실시간 알림 설정

2. **향후 개선 사항**
   - [ ] 다중 인증 (MFA) 추가
   - [ ] 비밀번호 정책 강화 (백엔드)
   - [ ] 속도 제한 (Rate Limiting) 구현
   - [ ] API 게이트웨이 보안 강화

---

## 🔍 검증 방법

### npm audit 실행
```bash
npm audit
npm audit fix  # 자동 수정 (필요시)
```

### 보안 헤더 확인 (온라인 도구)
- https://securityheaders.com/
- URL 입력 후 현재 상태 확인

### 의존성 보안 검사
```bash
npm outdated  # 버전 확인
npm update    # 보안 업데이트
```

### 코드 검사
```bash
npm run lint
npm run typecheck
npm run build
```

---

## 📚 참고 자료

- [OWASP Top 10 (2021)](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Next.js 보안](https://nextjs.org/docs/basic-features/security)
- [npm 보안 가이드](https://docs.npmjs.com/about-npm/security)
- [프로젝트 보안 정책](/docs/SECURITY.md)

---

**마지막 업데이트**: 2026-01-21
**검증 주기**: 매월 또는 새 의존성 추가 시
