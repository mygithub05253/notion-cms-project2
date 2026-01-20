# Phase 4: 고급 기능 및 최적화 계획

**작성일**: 2026-01-20
**상태**: 계획 수립
**목표**: 프로덕션 배포 준비 및 최적화

---

## 개요

Phase 1-3이 완료되어 모든 핵심 기능이 구현되었습니다. Phase 4에서는 성능 최적화, 보안 강화, 배포 자동화, 문서화를 완성하여 프로덕션 수준의 애플리케이션을 완성합니다.

### 기존 상태
- ✅ Next.js 16.1.1 (App Router)
- ✅ TypeScript strict mode
- ✅ 모든 핵심 기능 (인증, CRUD, 공유, PDF)
- ✅ Playwright E2E 테스트
- ✅ npm run build 성공

### 최종 목표
- 🎯 Lighthouse 점수 80점 이상
- 🎯 페이지 로드 시간 < 2초
- 🎯 OWASP Top 10 보안 기준 준수
- 🎯 Vercel 자동 배포 파이프라인
- 🎯 완전한 문서화

---

## Task 020: 성능 최적화 (예상 2-3일)

### 목표
페이지 로드 시간 < 2초, Lighthouse 80점 이상 달성

### 서브태스크

#### Task 020-1: next.config.ts 성능 최적화 설정
**목표**: Next.js 빌드 및 렌더링 최적화

**구현 항목**:
- Image 최적화 (WebP, AVIF 포맷)
- 압축 활성화 (SWC)
- 보안 헤더 설정 (X-Content-Type-Options, X-Frame-Options)
- 정적 최적화 설정

**수락 기준**:
- next.config.ts 수정 완료
- npm run build 성공
- 보안 헤더 설정 확인

---

#### Task 020-2: @next/bundle-analyzer 설치 및 번들 분석
**목표**: 번들 크기 파악 및 최적화 대상 찾기

**구현 항목**:
- @next/bundle-analyzer 설치
- 분석 플러그인 통합
- npm run analyze 실행
- 큰 번들(jsPDF, html2canvas 등) 파악

**수락 기준**:
- 번들 분석 완료
- 최적화 대상 리스트 작성
- 분석 리포트 생성

---

#### Task 020-3: 렌더링 성능 최적화
**목표**: 불필요한 재렌더링 방지

**구현 항목**:
- InvoiceTable에 React.memo 적용
- InvoiceForm에 useMemo 적용
- 콜백 핸들러에 useCallback 적용

**수락 기준**:
- 주요 컴포넌트 메모이제이션 완료
- npm run build 성공
- DevTools에서 재렌더링 감소 확인

---

#### Task 020-4: API 캐싱 전략 구현
**목표**: 반복 API 요청 제거로 성능 개선

**구현 항목**:
- SWR 패키지 설치
- hooks/useFetchInvoices.ts 생성
- 대시보드 페이지에 SWR 적용
- 캐싱 무효화 로직 구현

**수락 기준**:
- SWR 설치 및 설정
- API 캐싱 훅 작동
- 중복 요청 감소 확인

---

#### Task 020-5: Lighthouse 성능 검증
**목표**: 성능 기준 달성 확인

**구현 항목**:
- Chrome DevTools Lighthouse 실행
- 각 페이지 분석 (대시보드, 목록, 상세)
- FCP < 1.5s, LCP < 2.5s 확인
- 성능 리포트 문서화

**수락 기준**:
- Lighthouse 80점 이상 달성
- 모든 핵심 페이지 기준 충족
- docs/PERFORMANCE.md 작성

---

## Task 021: 보안 강화 (예상 2-3일)

### 목표
OWASP Top 10 기준 준수, 보안 헤더 및 인증 강화

### 서브태스크

#### Task 021-1: middleware.ts 보안 설정
**목표**: 요청 수준의 보안 헤더 및 CSRF 검증

**구현 항목**:
- middleware.ts 생성
- 보안 헤더 추가 (CSP, X-Content-Type-Options, X-Frame-Options)
- CSRF 토큰 검증
- (protected) 라우트 인증 확인

**수락 기준**:
- middleware.ts 생성
- 보안 헤더 설정
- npm run build 성공

---

#### Task 021-2: lib/security.ts 유틸 함수
**목표**: 보안 기능 유틸리티 함수 작성

**구현 항목**:
- CSRF 토큰 생성 함수
- CSRF 토큰 검증 함수
- API 키 마스킹 함수
- 기타 보안 유틸

**수락 기준**:
- lib/security.ts 생성
- 모든 함수 타입 안전
- npm run build 성공

---

#### Task 021-3: API 클라이언트 보안 헤더 추가
**목표**: 자동 인증 및 CSRF 토큰 추가

**구현 항목**:
- lib/api-config.ts에 인터셉터 추가
- Authorization 헤더 자동 추가
- CSRF 토큰 자동 추가 (POST, PUT, DELETE)
- 401/403 에러 처리

**수락 기준**:
- API 클라이언트 인터셉터 구현
- 헤더 자동 추가 확인
- E2E 테스트 통과

---

#### Task 021-4: 환경 변수 보안
**목표**: 민감 정보 안전 관리

**구현 항목**:
- .env.example 작성
- JWT_SECRET, CSRF_SECRET 환경 변수 추가
- lib/env.ts 확장
- 환경별 설정 분리

**수락 기준**:
- .env.example 생성
- 모든 필수 변수 나열
- .gitignore 확인

---

#### Task 021-5: OWASP 기준 검증
**목표**: 보안 기준 최종 확인

**구현 항목**:
- OWASP Top 10 체크리스트 작성
- 각 항목별 보안 대책 확인
- npm audit 실행
- 보안 문서 작성

**수락 기준**:
- OWASP 체크리스트 완료
- npm audit 취약점 없음
- 보안 문서 (docs/SECURITY.md) 작성

---

## Task 022: 배포 준비 (예상 2-3일)

### 목표
Vercel 배포 및 CI/CD 파이프라인 구성

### 서브태스크

#### Task 022-1: 배포 환경 설정
**목표**: Vercel 배포 준비

**구현 항목**:
- .env.example 완성
- Vercel 프로젝트 생성
- 환경 변수 추가 (Settings → Environment Variables)
- 배포 테스트

**수락 기준**:
- Vercel 프로젝트 설정
- 환경 변수 모두 추가
- Preview 배포 성공

---

#### Task 022-2: Vercel 자동 배포 설정
**목표**: GitHub 푸시 시 자동 배포

**구현 항목**:
- Vercel과 GitHub 리포지토리 연동
- 자동 배포 설정
- Preview 및 Production 배포 분리
- Custom Domain 설정 (선택)

**수락 기준**:
- git push → 자동 배포 확인
- Preview URL 생성 확인
- Production 배포 성공

---

#### Task 022-3: GitHub Actions CI/CD
**목표**: 자동 테스트 및 배포 파이프라인

**구현 항목**:
- .github/workflows/deploy.yml 생성
- 테스트 자동 실행 (npm run build, npm run lint, npm run test:e2e)
- 성공 시 Vercel 배포
- Vercel 토큰 설정 (GitHub Secrets)

**수락 기준**:
- GitHub Actions 워크플로우 생성
- Secrets 설정
- 자동 배포 확인

---

#### Task 022-4: 환경별 설정 관리
**목표**: Development, Staging, Production 환경 분리

**구현 항목**:
- .env.development 생성
- .env.staging 생성
- .env.production 생성
- 환경별 다른 API URL, 로그 레벨 등 설정

**수락 기준**:
- 환경 파일 모두 생성
- 각 환경에서 올바른 변수 로드 확인
- 배포 테스트 성공

---

#### Task 022-5: 배포 후 검증 및 모니터링
**목표**: 배포 후 정상 작동 확인

**구현 항목**:
- 헬스 체크 API 생성 (/api/health)
- Vercel Analytics 활성화
- 배포 후 E2E 테스트 실행
- 모니터링 대시보드 설정

**수락 기준**:
- 헬스 체크 엔드포인트 작동
- Vercel Analytics 활성화
- 배포 후 모든 기능 테스트 통과

---

## Task 023: 문서화 (예상 1-2일)

### 목표
프로젝트 전체 문서화 완성

### 서브태스크

#### Task 023-1: README.md 업데이트
**목표**: 프로젝트 소개 및 설치 가이드

**구현 항목**:
- 프로젝트 제목 및 설명
- 주요 기능 목록
- 기술 스택
- 설치 및 실행 방법
- 폴더 구조
- 링크 (API 문서, 개발 가이드)

**수락 기준**:
- README.md 작성 완료
- 모든 주요 섹션 포함
- 명령어 예제 정확

---

#### Task 023-2: API 문서 (docs/API.md)
**목표**: API 엔드포인트 문서화

**구현 항목**:
- API 기본 정보 (URL, 인증)
- 엔드포인트 목록:
  - POST /auth/login
  - POST /auth/logout
  - GET /invoices
  - POST /invoices
  - PUT /invoices/:id
  - DELETE /invoices/:id
  - POST /invoices/:id/share
  - GET /share/:token/invoices
- 요청/응답 예제
- 에러 코드

**수락 기준**:
- docs/API.md 생성
- 모든 엔드포인트 문서화
- 요청/응답 예제 포함

---

#### Task 023-3: 개발자 가이드 (docs/DEVELOPER.md)
**목표**: 새로운 개발자 온보딩

**구현 항목**:
- 개발 환경 설정
- 프로젝트 구조
- 기술 스택 가이드
- 코딩 컨벤션
- 컴포넌트 개발 가이드
- 상태 관리 가이드
- API 클라이언트 사용
- E2E 테스트 가이드

**수락 기준**:
- docs/DEVELOPER.md 생성
- 모든 주요 주제 포함
- 예제 코드 포함

---

#### Task 023-4: 배포 가이드 (docs/DEPLOYMENT.md)
**목표**: 배포 프로세스 문서화

**구현 항목**:
- Vercel 배포 단계
- 환경 변수 설정
- GitHub Actions 설정
- Custom Domain 설정
- 배포 후 검증
- 문제 해결

**수락 기준**:
- docs/DEPLOYMENT.md 생성
- 배포 단계별 가이드
- 환경 변수 설명

---

#### Task 023-5: CHANGELOG 및 LICENSE
**목표**: 버전 관리 및 라이센스 문서

**구현 항목**:
- CHANGELOG.md 작성 (Keep a Changelog 형식)
- LICENSE 파일 생성 (MIT)
- 기본 변경사항 기록

**수락 기준**:
- CHANGELOG.md 생성
- LICENSE 파일 생성
- 주요 버전 기록

---

## 전체 일정

| Task | 예상 기간 | 상태 |
|------|---------|------|
| Task 020: 성능 최적화 | 2-3일 | 대기 |
| Task 021: 보안 강화 | 2-3일 | 대기 |
| Task 022: 배포 준비 | 2-3일 | 대기 |
| Task 023: 문서화 | 1-2일 | 대기 |
| **총계** | **7-11일** | - |

---

## 검수 체크리스트

### 성능 (Task 020)
- [ ] Lighthouse 80점 이상
- [ ] FCP < 1.5초
- [ ] LCP < 2.5초
- [ ] 번들 크기 최소화

### 보안 (Task 021)
- [ ] OWASP Top 10 준수
- [ ] CSP 헤더 설정
- [ ] CSRF 토큰 검증
- [ ] npm audit 취약점 없음

### 배포 (Task 022)
- [ ] Vercel 자동 배포
- [ ] GitHub Actions CI/CD
- [ ] 환경 변수 관리
- [ ] 모니터링 설정

### 문서화 (Task 023)
- [ ] README.md 완성
- [ ] API 문서 완성
- [ ] 개발자 가이드 완성
- [ ] 배포 가이드 완성

---

## 다음 단계

1. **즉시 시작**: Task 020-1부터 순차적으로 진행
2. **병렬 처리**: 가능한 범위 내에서 독립적 태스크 병렬 진행
3. **정기 검증**: 각 Task 완료 후 검증 기준 확인
4. **문서 갱신**: ROADMAP.md에 진행 상황 기록

---

**작성자**: Claude Code
**최종 수정**: 2026-01-20
