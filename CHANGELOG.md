# Changelog

모든 주요 프로젝트 변경사항을 기록합니다.

이 파일의 형식은 [Keep a Changelog](https://keepachangelog.com/)를 따릅니다.
버전 관리는 [Semantic Versioning](https://semver.org/)을 따릅니다.

---

## [0.2.0] - 2026-01-21

### Added
- 📚 종합 프로젝트 문서화
  - README.md 업데이트 (프로젝트 소개, 기술 스택, 프로젝트 구조)
  - docs/API.md (16개 API 엔드포인트 전체 문서화)
  - docs/DEVELOPER.md (개발자 온보딩 가이드)
  - docs/DEPLOYMENT.md (Vercel 배포 가이드)
  - CHANGELOG.md (버전 관리 기록)
  - LICENSE (MIT 라이선스)

- ✨ 새로운 페이지 및 기능
  - 대시보드 기본 레이아웃
  - 견적서 목록 조회 페이지
  - 견적서 생성 및 편집 폼
  - 공유 링크 기능

- 🔐 보안 기능
  - JWT 기반 인증 시스템
  - CSRF 토큰 검증
  - httpOnly 쿠키 지원

- 🎨 UI/UX
  - shadcn/ui 컴포넌트 통합
  - Tailwind CSS 스타일링
  - 라이트/다크 모드 지원
  - 반응형 디자인

- 🧪 테스트
  - Playwright E2E 테스트 설정
  - 로그인 플로우 테스트
  - 견적서 관리 테스트

### Changed
- 프로젝트 버전 0.1.0 → 0.2.0
- 마지막 업데이트 날짜 2026-01-16 → 2026-01-21

### Fixed
- 환경 변수 설정 문서 개선
- API 클라이언트 에러 처리 강화

### Security
- CSRF 보호 활성화
- JWT 시크릿 관리 가이드
- 환경 변수 보안 설정

---

## [0.1.0] - 2026-01-16

### Added
- 🏗️ 프로젝트 초기화
  - Next.js 16 App Router 구조
  - TypeScript Strict Mode 설정
  - Tailwind CSS v4 설정
  - shadcn/ui 컴포넌트 라이브러리

- 🔌 API 통합
  - lib/api-config.ts - API 클라이언트 기본 설정
  - lib/api-auth.ts - 인증 관련 API (로그인, 회원가입, 토큰 관리)
  - lib/api-invoice.ts - 견적서 CRUD API
  - lib/api-share.ts - 공유 링크 API

- 💾 상태 관리
  - Zustand 스토어 구조
  - useAuthStore - 인증 상태
  - useInvoiceStore - 견적서 상태
  - use-ui-store - UI 상태

- 🎯 기본 페이지
  - 로그인 페이지
  - 대시보드 레이아웃 (기본 구조)
  - API 헬스 체크 엔드포인트

- 📝 문서
  - CLAUDE.md - 개발 규칙 및 컨벤션
  - .env.example - 환경 변수 템플릿

- 🛠️ 개발 도구
  - ESLint 설정
  - Prettier 포맷팅
  - Husky Git Hooks

---

## 주요 마일스톤

### Phase 1: 기본 구조 및 인증 ✅
- [x] 프로젝트 초기화
- [x] 라우팅 시스템 설정
- [x] 인증 API 구현
- [x] 상태 관리 시스템

### Phase 2: 견적서 관리 🚀
- [x] 견적서 API 구현
- [x] 견적서 CRUD 컴포넌트
- [x] 폼 유효성 검증

### Phase 3: 공유 및 PDF 🚀
- [x] 공유 링크 API
- [x] PDF 다운로드 기능

### Phase 4: 문서화 ✅
- [x] README 작성
- [x] API 문서 작성
- [x] 개발자 가이드 작성
- [x] 배포 가이드 작성
- [x] 버전 기록

---

## 다음 릴리스 계획 (v0.3.0)

### 예정 사항
- [ ] 성능 최적화 (FCP < 1.5초, LCP < 2.5초)
- [ ] 보안 강화 (OWASP Top 10 대응)
- [ ] 모니터링 구현 (Sentry 통합)
- [ ] 백업 및 복구 기능
- [ ] 감사 로그 추가

---

## 기여 방법

이 프로젝트에 기여하고 싶으시다면:

1. 이슈 리포트 또는 기능 제안
2. Fork 후 새로운 브랜치 생성
3. 변경사항 커밋
4. Pull Request 제출

모든 기여는 환영합니다!

---

## 지원

문제가 발생하거나 질문이 있으면:

1. [GitHub Issues](https://github.com/your-org/invoice-web/issues)에 문제 등록
2. Discussions에서 질문
3. 자세한 내용은 [docs/DEVELOPER.md](docs/DEVELOPER.md) 참고

---

**마지막 업데이트**: 2026-01-21
