# 배포 가이드 (Vercel)

Invoice Web을 Vercel에 배포하고 관리하는 단계별 가이드입니다.

## 📋 목차

- [사전 준비](#사전-준비)
- [Vercel 배포](#vercel-배포)
- [환경 변수 설정](#환경-변수-설정)
- [배포 후 검증](#배포-후-검증)
- [모니터링](#모니터링)
- [문제 해결](#문제-해결)
- [롤백 방법](#롤백-방법)

---

## 사전 준비

배포하기 전에 다음을 확인하세요:

### 필수 사항

1. **GitHub 계정** - 프로젝트 리포지토리가 GitHub에 푸시되어 있어야 함
2. **Vercel 계정** - https://vercel.com 에 가입
3. **빌드 성공 확인**
   ```bash
   npm run build
   npm run lint
   npm run test:e2e
   ```

---

## Vercel 배포

### 1단계: Vercel 로그인

1. https://vercel.com 방문
2. "Sign Up" → "Continue with GitHub" 클릭
3. GitHub 인증 완료

### 2단계: 프로젝트 Import

1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. "Import Git Repository" 선택
3. GitHub 계정에서 `invoice-web` 저장소 검색 및 선택
4. "Import" 클릭

### 3단계: 프로젝트 설정

**Project Settings** 페이지에서:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 4단계: 환경 변수 설정

**Environment Variables** 섹션에 다음을 추가하세요:

- NEXT_PUBLIC_API_URL: API 엔드포인트 URL
- NEXT_PUBLIC_APP_URL: 애플리케이션 URL
- JWT_SECRET: 32자 이상 강력한 시크릿 (프로덕션)
- CSRF_SECRET: 32자 이상 강력한 시크릿 (프로덕션)
- NOTION_API_KEY: Notion API 토큰
- NOTION_DATABASE_ID: Notion 메인 DB ID
- NOTION_ITEMS_DATABASE_ID: Notion Items DB ID
- NOTION_SHARES_DATABASE_ID: Notion Shares DB ID
- NOTION_USERS_DATABASE_ID: Notion Users DB ID

### 5단계: 배포

1. "Deploy" 버튼 클릭
2. 배포 진행 상황 모니터링 (약 2-5분)
3. 배포 완료 후 자동 생성된 URL 확인

---

## 환경 변수 설정

### 시크릿 생성 방법

**PowerShell** (Windows):
```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes(32))
```

**Linux/Mac**:
```bash
openssl rand -hex 32
```

### 개발 환경 (.env.local)

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=dev-jwt-secret-32-chars-minimum-!!!
CSRF_SECRET=dev-csrf-secret-32-chars-minimum-!
NOTION_API_KEY=ntn_xxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_DEBUG_API=true
LOG_LEVEL=debug
```

---

## 배포 후 검증

### 1단계: 사이트 접속

```bash
https://invoice-web.vercel.app
```

### 2단계: Health Check

```bash
curl https://invoice-web.vercel.app/api/health
```

### 3단계: 주요 기능 테스트

- [ ] 로그인 페이지 접속
- [ ] 로그인 성공
- [ ] 견적서 목록 조회
- [ ] 새 견적서 생성
- [ ] 견적서 수정/삭제
- [ ] 공유 링크 생성 및 접속

---

## 모니터링

### Vercel Analytics

**Vercel 대시보드** → **프로젝트** → **Analytics**

모니터링 항목:

- FCP (First Contentful Paint): < 1.5초 (목표)
- LCP (Largest Contentful Paint): < 2.5초 (목표)
- CLS (Cumulative Layout Shift): < 0.1 (목표)

---

## 배포 전 체크리스트

- [ ] `npm run lint` 실행 (에러 없음)
- [ ] `npm run build` 실행 (성공)
- [ ] `npm run test:e2e` 실행 (모두 통과)
- [ ] `.env.local` 파일 `.gitignore` 확인
- [ ] 시크릿은 Vercel에서만 설정
- [ ] Git 히스토리에 시크릿 없음

---

## 문제 해결

### 배포 실패 - Build Error

로컬에서 빌드 시뮬레이션:

```bash
npm run build
```

Vercel 로그 확인: Deployments → 실패한 배포 → Logs

### 500 에러

1. 함수 로그 확인 (Vercel 대시보드 → Functions)
2. 환경 변수 확인 (모든 필수 변수 설정)
3. API 연결 확인

### API 요청 실패

확인 사항:

1. NEXT_PUBLIC_API_URL 확인
2. API 서버 상태 확인
3. CORS 설정 확인

### Notion API 오류

해결 방법:

1. API 토큰 유효성 확인
2. 데이터베이스 ID 정확성 확인
3. Integration 권한 확인 (Notion 워크스페이스)

---

## 롤백 방법

1. **Vercel 대시보드** → **Deployments**
2. 정상 작동하던 버전 찾기
3. 해당 배포 클릭 → "Set as Production"

또는 Git에서:

```bash
git log --oneline -10
git revert <commit-hash>
git push origin main
```

---

## 모범 사례

### 정기적인 배포 (주 1-2회)

```
개발 → 로컬 테스트 → Production 배포
```

### 보안 검사

```bash
npm audit
npm audit fix
```

### 데이터 백업 (월 1회)

Notion에서 내보내기 후 클라우드에 저장

---

**마지막 업데이트**: 2026년 1월 21일
**배포 가이드 버전**: 1.0.0
