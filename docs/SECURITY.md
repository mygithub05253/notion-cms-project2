# 보안 정책 및 구현 가이드

Invoice Web MVP의 보안 정책, 구현 내용, 모범 사례를 설명합니다.

## 📋 목차

1. [보안 개요](#보안-개요)
2. [인증 시스템](#인증-시스템)
3. [권한 관리](#권한-관리)
4. [데이터 보호](#데이터-보호)
5. [API 보안](#api-보안)
6. [클라이언트 보안](#클라이언트-보안)
7. [배포 보안](#배포-보안)
8. [보안 검사 체크리스트](#보안-검사-체크리스트)
9. [보안 사고 대응](#보안-사고-대응)

---

## 보안 개요

### 핵심 보안 원칙

1. **기본값은 안전하게** (Secure by default)
   - 모든 라우트는 보호됨
   - 토큰이 필수
   - CSRF 토큰 검증 필수

2. **최소 권한 원칙** (Principle of Least Privilege)
   - 사용자는 필요한 권한만 부여
   - 관리자 기능은 역할 확인 필수
   - 공유 링크는 제한된 접근만 허용

3. **심층 방어** (Defense in Depth)
   - 클라이언트 + 서버 검증 (중복)
   - 여러 보안 계층
   - 다중 인증 지원 (향후)

4. **투명성과 감사** (Transparency & Audit)
   - 모든 보안 이벤트 로깅
   - 감사 추적 (Audit trail)
   - 정기적인 보안 검토

### 보안 계층

```
┌─────────────────────────────────────┐
│  Middleware (보안 헤더)              │
│  - X-Content-Type-Options           │
│  - X-Frame-Options                  │
│  - X-XSS-Protection                 │
├─────────────────────────────────────┤
│  인증 계층 (JWT)                    │
│  - Bearer Token                     │
│  - 토큰 검증                        │
│  - 토큰 갱신                        │
├─────────────────────────────────────┤
│  권한 검증 (RBAC)                   │
│  - 역할 기반 접근                    │
│  - 리소스 소유권 확인                │
├─────────────────────────────────────┤
│  데이터 검증 (Zod)                  │
│  - 입력 검증                        │
│  - 출력 검증                        │
│  - 타입 안전성                      │
├─────────────────────────────────────┤
│  CSRF 방지 (토큰)                   │
│  - 토큰 생성 및 검증                │
│  - 세션별 토큰                      │
└─────────────────────────────────────┘
```

---

## 인증 시스템

### JWT (JSON Web Token) 기반 인증

**구현 위치**: `store/useAuthStore.ts`, `lib/api-config.ts`

#### 토큰 구조

```
Header.Payload.Signature

Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "user-id",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234571490
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

#### 토큰 발급 및 검증

**로그인 플로우**:
```
1. 사용자 이메일/비밀번호 제출
2. 백엔드에서 자격증명 확인
3. 검증 성공 시 JWT 토큰 발급
4. 클라이언트에서 localStorage에 저장
5. 이후 요청에 Authorization: Bearer <token> 헤더 추가
```

**토큰 검증**:
```typescript
// lib/api-config.ts
const token = getToken();
if (token) {
  headers.Authorization = `Bearer ${token}`;
}

// API 라우트 (백엔드)
const payload = jwt.verify(token, JWT_SECRET);
```

#### 토큰 만료 처리

```typescript
// API 응답이 401 Unauthorized인 경우
if (response.status === 401) {
  // 1. 토큰 삭제
  clearAuthData();

  // 2. 로그인 페이지로 리다이렉트
  router.push('/');

  // 3. 사용자에게 알림
  toast.error('인증이 만료되었습니다. 다시 로그인해주세요.');
}
```

### 토큰 저장소

| 저장소 | 장점 | 단점 | 사용 |
|--------|------|------|------|
| localStorage | 편함, 간단 | XSS 취약 | 현재 (개발) |
| httpOnly 쿠키 | XSS 방지 | CSRF 취약 | 권장 (프로덕션) |
| sessionStorage | 임시 저장 | 탭 종료시 삭제 | - |
| 메모리 | 안전함 | 새로고침 시 삭제 | - |

**현재**: localStorage 사용 (개발 편의)
**프로덕션**: httpOnly 쿠키로 마이그레이션 필요

---

## 권한 관리

### 역할 기반 접근 제어 (RBAC)

**사용자 역할**:
```typescript
type UserRole = 'admin' | 'client';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;  // 'admin' 또는 'client'
  createdAt: Date;
  updatedAt: Date;
}
```

### 접근 제어 규칙

#### 관리자 (admin)
- ✅ 견적서 CRUD (생성, 조회, 수정, 삭제)
- ✅ 공유 링크 생성/관리
- ✅ 사용자 정보 관리
- ✅ 대시보드 접근

#### 클라이언트 (client)
- ✅ 공유 링크를 통한 견적서 조회 (읽기 전용)
- ✅ PDF 다운로드
- ✅ 응답 제출 (승인/거절)
- ❌ 견적서 생성/수정/삭제 불가
- ❌ 다른 사용자의 견적서 접근 불가

### 구현

**라우트 레벨 보호** (AuthGuard):
```typescript
// components/features/auth-guard.tsx
<AuthGuard requiredRole="admin">
  <ProtectedComponent />
</AuthGuard>

// 역할 확인 실패 시 → 로그인 페이지 리다이렉트
```

**API 레벨 보호**:
```typescript
// API 라우트에서 토큰 검증 및 역할 확인
const payload = jwt.verify(token, JWT_SECRET);
if (payload.role !== 'admin') {
  return res.status(403).json({ error: '권한이 없습니다' });
}
```

---

## 데이터 보호

### 입력 검증

**Zod 스키마 사용** (`types/index.ts`):
```typescript
// 로그인 폼 검증
export const loginSchema = z.object({
  email: z.string().email('유효한 이메일이 아닙니다'),
  password: z.string().min(6, '최소 6자 이상이어야 합니다'),
});

// 견적서 생성 검증
export const invoiceSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  clientName: z.string().min(1),
  items: z.array(invoiceItemSchema).min(1, '최소 1개 항목 필요'),
  description: z.string().optional(),
});
```

**검증 위치**:
1. 클라이언트: React Hook Form + Zod
2. 서버: API 라우트에서 재검증 (필수)

### 출력 이스케이핑

**React의 자동 이스케이핑**:
```typescript
// React는 기본적으로 텍스트 콘텐츠를 이스케이프합니다
<div>{userInput}</div>  // 안전: HTML 태그 무시됨

// 위험: dangerouslySetInnerHTML 금지
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // 금지!
```

### 민감한 정보 마스킹

**API 키 마스킹**:
```typescript
// lib/security.ts
const masked = maskApiKey('sk-proj-1234567890abcdefghijklmnop');
// 결과: 'sk-p...mnop'
```

---

## API 보안

### 보안 헤더 설정 (middleware.ts)

| 헤더 | 값 | 목적 |
|------|-----|------|
| X-Content-Type-Options | nosniff | MIME 타입 스니핑 방지 |
| X-Frame-Options | DENY | 클릭재킹 방지 |
| X-XSS-Protection | 1; mode=block | XSS 공격 방지 |
| Referrer-Policy | strict-origin-when-cross-origin | 리퍼러 정보 유출 방지 |
| Permissions-Policy | geolocation=(), microphone=(), camera=() | 브라우저 기능 제한 |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | HTTPS 강제 (프로덕션) |

**검증**:
```bash
# 보안 헤더 확인
curl -I https://example.com | grep -E "X-Content|X-Frame|X-XSS"
```

### CSRF 방지

**CSRF 토큰 메커니즘**:

```
1. 요청 생성
   ├─ 클라이언트: GET /api/csrf-token
   └─ 서버: 토큰 생성 후 응답 헤더에 포함

2. 상태 변경 요청 (POST/PUT/DELETE)
   ├─ 클라이언트: X-CSRF-Token 헤더에 토큰 포함
   └─ 서버: 토큰 검증 후 요청 처리

3. 검증 실패
   └─ 서버: 403 Forbidden 응답
```

**구현**:
```typescript
// lib/security.ts - CSRF 토큰 생성
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// lib/api-config.ts - 요청에 토큰 포함
if (['POST', 'PUT', 'DELETE'].includes(method)) {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
}

// API 라우트 - 토큰 검증
const token = req.headers['x-csrf-token'];
if (!validateCSRFToken(token, CSRF_SECRET)) {
  return res.status(403).json({ error: 'CSRF 검증 실패' });
}
```

### 요청 타임아웃

```typescript
// lib/api-config.ts
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), timeout);

// 기본값: 10초
const timeout = options.timeout || 10000;
```

### Rate Limiting

**현재**: 미구현 (백엔드에서 구현 권장)

**구현 방법** (백엔드):
```typescript
// Express 예시
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100,                  // 최대 100개 요청
  message: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.',
});

app.use(limiter);
```

---

## 클라이언트 보안

### XSS 방지

**1. React 기본 보호**:
- React는 텍스트 콘텐츠를 자동 이스케이프
- `{}` 바인딩은 안전함

**2. 위험한 패턴 회피**:
```typescript
// ❌ 위험
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 안전
<div>{userInput}</div>
```

**3. 입력 검증**:
```typescript
// lib/security.ts
export function validateInput(input: string): boolean {
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /on\w+\s*=/gi,
    /javascript:/gi,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
}
```

### CORS 설정

**현재**: 특정 도메인에서만 API 호출 허용

```typescript
// 백엔드 (예시)
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL,
  credentials: true,
}));
```

### 쿠키 설정

```typescript
// httpOnly 쿠키 사용 시
Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict; Path=/
```

| 플래그 | 설명 |
|--------|------|
| HttpOnly | JavaScript에서 접근 불가 (XSS 방지) |
| Secure | HTTPS only (중간자 공격 방지) |
| SameSite | 다른 사이트 요청에서 쿠키 전송 금지 (CSRF 방지) |
| Path | 경로 제한 |

---

## 배포 보안

### 환경 변수 관리

**필수 환경 변수** (.env.local):
```env
# 인증
JWT_SECRET=your-jwt-secret-minimum-32-characters
CSRF_SECRET=your-csrf-secret-minimum-32-characters

# Notion API
NOTION_API_KEY=noti_xxxxx
NOTION_DATABASE_ID=xxxxx

# 애플리케이션
NEXT_PUBLIC_APP_URL=https://example.com
NEXT_PUBLIC_API_URL=https://api.example.com
```

**프로덕션 배포 체크리스트**:
- [ ] 모든 필수 환경 변수 설정
- [ ] 시크릿 값은 최소 32자 이상
- [ ] 강력한 무작위 문자열 사용
- [ ] 환경 변수 검증 통과: `validateSecurityEnv()`

### HTTPS 강제

```typescript
// middleware.ts
if (process.env.NODE_ENV === 'production') {
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
}
```

### 빌드 보안

```bash
# 프로덕션 빌드
npm run build

# 소스맵 제외 (next.config.ts)
productionBrowserSourceMaps: false

# 콘솔 로그 제거 (next.config.ts)
swcMinify: true
```

---

## 보안 검사 체크리스트

### 개발 중 매일

- [ ] `npm audit` 실행 (취약점 확인)
- [ ] TypeScript 타입 검사 (`npm run typecheck`)
- [ ] ESLint 실행 (`npm run lint`)
- [ ] 민감한 정보 코드에 포함 여부 확인

### PR 병합 전

- [ ] 보안 헤더 확인
- [ ] CSRF 토큰 포함 확인 (POST/PUT/DELETE)
- [ ] 입력 검증 Zod 스키마 확인
- [ ] 인증/권한 검증 추가 여부 확인
- [ ] 민감한 정보 로깅 여부 확인

### 배포 전

- [ ] 환경 변수 설정 완료
- [ ] `npm audit` 취약점 없음 확인
- [ ] 프로덕션 빌드 성공 (`npm run build`)
- [ ] 보안 헤더 모두 활성화
- [ ] HTTPS 설정 완료
- [ ] CORS 설정 확인

### 정기 (월 1회)

- [ ] 의존성 업데이트 확인
- [ ] npm audit 실행
- [ ] 보안 패치 적용
- [ ] 로그 검토 (감시)

---

## 보안 사고 대응

### 보안 취약점 발견 시

**즉시 조치**:
1. 문제 격리 (배포 중단)
2. 근본 원인 파악
3. 수정 코드 작성 및 테스트
4. 보안 패치 배포
5. 영향받은 사용자 알림

**공개 여부**:
- 공개 프로젝트: GitHub Security Advisory
- 프라이빗: 담당자 직접 연락

### 토큰 유출 시

**즉시 조치**:
1. 영향받은 사용자 로그아웃 처리
2. 토큰 블랙리스트 등록
3. 사용자에게 비밀번호 변경 권유
4. 감사 로그 검토

### 데이터 유출 시

**즉시 조치**:
1. 유출 범위 파악
2. 감시 활성화 (모니터링)
3. 영향받은 사용자 알림
4. 규정 준수 (GDPR, 개인정보보호법)

---

## 📚 참고 자료

### 보안 표준
- [OWASP Top 10 (2021)](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

### 기술 문서
- [Next.js 보안](https://nextjs.org/docs/basic-features/security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)

### 도구
- [npm audit](https://docs.npmjs.com/cli/audit)
- [OWASP ZAP](https://www.zaproxy.org/) (보안 스캔)
- [Security Headers](https://securityheaders.com/) (헤더 검증)
- [SSL Labs](https://www.ssllabs.com/) (SSL/TLS 검증)

### 관련 문서
- [OWASP_CHECKLIST.md](/docs/OWASP_CHECKLIST.md) - 상세 준수 확인
- [PERFORMANCE.md](/docs/PERFORMANCE.md) - 성능 최적화
- [DEPLOYMENT.md](/docs/DEPLOYMENT.md) - 배포 가이드

---

## 보안 정책 업데이트 이력

| 날짜 | 버전 | 변경사항 |
|------|------|---------|
| 2026-01-21 | 1.0 | 초기 보안 정책 수립 |
| - | - | - |

---

**문의**: 보안 관련 문의는 보안팀에 연락해주세요.
**최종 업데이트**: 2026-01-21
