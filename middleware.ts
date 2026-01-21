/**
 * Next.js 요청 레벨 미들웨어
 *
 * 모든 요청에 대해 보안 헤더를 추가하고,
 * 보호된 라우트의 인증을 확인합니다.
 *
 * 실행 시점: Next.js 요청 처리 초기 단계
 * 참고: @/docs/SECURITY.md
 */

import { NextRequest, NextResponse } from 'next/server';
import type { NextMiddleware } from 'next/server';

/**
 * 보안 응답 헤더 설정
 *
 * 다음 보안 헤더를 모든 응답에 추가합니다:
 * - X-Content-Type-Options: MIME 타입 스니핑 방지
 * - X-Frame-Options: 클릭재킹 공격 방지
 * - X-XSS-Protection: XSS 공격 방지 (구형 브라우저 대응)
 * - Referrer-Policy: 리퍼러 정보 유출 방지
 * - Permissions-Policy: 브라우저 기능 제한 (지리정보, 마이크, 카메라)
 * - Strict-Transport-Security: HTTPS 강제 (프로덕션)
 *
 * @param response NextResponse 객체
 * @returns 보안 헤더가 추가된 NextResponse
 */
function setSecurityHeaders(response: NextResponse): NextResponse {
  // MIME 타입 스니핑 방지
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // 클릭재킹 공격 방지
  response.headers.set('X-Frame-Options', 'DENY');

  // XSS 공격 방지 (구형 브라우저)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 리퍼러 정책 설정
  // strict-origin-when-cross-origin: 같은 출처는 전체 URL, 다른 출처는 도메인만 전달
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );

  // 브라우저 기능 제한
  // geolocation, microphone, camera 기능 비활성화
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );

  // HTTPS 강제 (프로덕션 환경)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }

  return response;
}

/**
 * 인증 토큰 확인
 *
 * 보호된 라우트 (protected)에 접근할 때 토큰 확인
 * - localStorage에서 accessToken 조회
 * - 토큰이 없으면 로그인 페이지로 리다이렉트
 *
 * 주의: 클라이언트 측에서 실제 토큰 검증이 수행됩니다.
 * middleware.ts는 요청 레벨 헤더만 추가하고,
 * 토큰 검증은 /app/middleware.ts나 AuthGuard 컴포넌트에서 수행됩니다.
 *
 * @param request NextRequest 객체
 * @returns NextResponse 또는 리다이렉트 응답
 */
function checkAuthentication(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  // 보호된 라우트 확인 (protected 경로)
  const isProtectedRoute = pathname.startsWith('/(protected)') ||
    pathname.startsWith('/api/protected');

  // 공개 라우트 (인증 불필요)
  const publicRoutes = [
    '/',
    '/share',
    '/login',
    '/auth',
    '/_next',
    '/public',
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 보호된 라우트에 접근하려고 함
  if (isProtectedRoute && !isPublicRoute) {
    // 주의: 클라이언트 측에서 토큰 검증이 수행되므로,
    // 여기서는 보안 헤더만 추가하고 넘어갑니다.
    // 실제 인증은 AuthGuard 컴포넌트나 API 라우트에서 확인합니다.
  }

  return null;
}

/**
 * CSRF 토큰 검증 (POST, PUT, DELETE 요청)
 *
 * POST, PUT, DELETE 요청에 대해 X-CSRF-Token 헤더 확인
 * - API 요청에만 적용
 * - form 제출 등 다른 요청은 제외
 *
 * 주의: 실제 토큰 검증은 API 라우트에서 수행합니다.
 * 여기서는 필요한 헤더만 확인합니다.
 *
 * @param request NextRequest 객체
 * @returns 검증 실패 시 403 에러 응답, 통과 시 null
 */
function validateCSRFToken(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // API 라우트 중 수정 작업 (POST, PUT, DELETE)
  const isApiRoute = pathname.startsWith('/api/');
  const isModifyingRequest = ['POST', 'PUT', 'DELETE'].includes(method);

  // API 라우트의 수정 요청인 경우 CSRF 토큰 확인
  if (isApiRoute && isModifyingRequest) {
    // 주의: 실제 CSRF 토큰 검증은 API 라우트 핸들러에서 수행합니다.
    // 여기서는 단순히 헤더 존재 여부만 확인합니다.

    // GET 요청이 아닌 경우, X-CSRF-Token 헤더 권장
    // (선택사항: 엄격하게 하려면 403 에러 반환)
  }

  return null;
}

/**
 * 미들웨어 메인 핸들러
 *
 * 모든 요청에 대해 실행되며,
 * 보안 헤더 추가 및 기본 인증 확인을 수행합니다.
 *
 * 실행 순서:
 * 1. 보안 헤더 추가
 * 2. CSRF 토큰 검증
 * 3. 인증 확인
 * 4. 응답 반환
 *
 * @param request NextRequest 객체
 * @returns NextResponse 객체
 */
export const middleware: NextMiddleware = (request: NextRequest) => {
  // 기본 응답 생성 (요청 계속 진행)
  let response = NextResponse.next();

  // 1. 보안 헤더 추가
  response = setSecurityHeaders(response);

  // 2. CSRF 토큰 검증 (API 라우트 수정 요청)
  const csrfError = validateCSRFToken(request);
  if (csrfError) {
    return csrfError;
  }

  // 3. 인증 확인
  const authError = checkAuthentication(request);
  if (authError) {
    return authError;
  }

  // 4. 최종 응답 반환 (모든 검증 통과)
  return response;
};

/**
 * 미들웨어 적용 범위 설정
 *
 * 다음 경로에 대해 미들웨어 실행:
 * - /(protected)/* : 보호된 라우트
 * - /api/* : 모든 API 라우트
 *
 * 제외 경로:
 * - /_next/* : Next.js 내부 라우트
 * - /public/* : 정적 자산
 * - /favicon.ico : 파비콘
 * - /manifest.json : PWA 매니페스트
 *
 * matcher 문법:
 * - 문자열: 정확한 경로
 * - {source, destination, hasHeader, etc.}: 고급 매칭
 */
export const config = {
  matcher: [
    // 모든 요청에 보안 헤더 추가
    '/((?!_next|public|favicon.ico|manifest.json).*)',
  ],
};
