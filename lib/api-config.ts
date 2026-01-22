/**
 * API 클라이언트 기본 설정 모듈
 *
 * 모든 API 요청의 기본 설정(baseURL, headers, interceptors)을 관리합니다.
 * 환경 변수에서 API URL을 읽고, 자동으로 인증 토큰을 헤더에 추가합니다.
 */

import { getToken, getCSRFToken, saveCSRFToken } from '@/hooks/useLocalStorage';
import { validateCSRFToken, maskApiKey } from '@/lib/security';

/**
 * API Base URL 설정
 * Next.js API Routes를 사용하므로 같은 도메인의 /api 경로 사용
 * - 클라이언트: window.location.origin + '/api' (현재 도메인 자동 감지)
 * - 서버: 환경 변수 또는 기본값 http://localhost:3000/api
 *
 * Vercel 배포 시 자동으로 현재 도메인으로 감지됩니다 (https://your-app.vercel.app/api)
 */
export const API_BASE_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/api`  // 클라이언트: 동적 감지
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';  // 서버

/**
 * 요청 헤더에 자동으로 추가될 Authorization 토큰을 포함한 헤더 객체를 생성합니다.
 *
 * @param customHeaders - 추가 커스텀 헤더 (선택사항)
 * @param method - HTTP 메서드 (POST, PUT, DELETE인 경우 CSRF 토큰 추가)
 * @returns 기본 헤더와 Authorization 헤더를 포함한 Headers 객체
 *
 * @example
 * const headers = createHeaders({ 'X-Custom-Header': 'value' }, 'POST');
 */
export function createHeaders(
  customHeaders?: Record<string, string>,
  method?: string
): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // 토큰이 존재하면 Authorization 헤더 추가
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // POST, PUT, DELETE 요청에 CSRF 토큰 추가
  if (method && ['POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
    let csrfToken = getCSRFToken();

    // CSRF 토큰이 없으면 새로 생성
    if (!csrfToken) {
      // 토큰 생성은 백엔드 또는 클라이언트에서 처리
      // 여기서는 localStorage에서만 조회
    } else {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  return headers;
}

/**
 * API 요청 설정 인터페이스
 */
interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * API 응답 처리 결과
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

/**
 * API 요청을 위한 래퍼 함수
 *
 * 타임아웃, 에러 처리, 401 응답 처리를 자동으로 수행합니다.
 *
 * @template T - 응답 데이터 타입
 * @param endpoint - API 엔드포인트 (예: '/auth/login')
 * @param options - fetch 요청 옵션
 * @param options.timeout - 요청 타임아웃 (기본값: 10000ms)
 * @returns API 응답 데이터
 * @throws {Error} API 요청 실패 또는 응답 파싱 실패
 *
 * @example
 * const user = await apiFetch<User>('/auth/me', {
 *   method: 'GET',
 *   timeout: 5000,
 * });
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options;

  // AbortController를 사용한 타임아웃 처리
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // URL 구성
    const url = `${API_BASE_URL}${endpoint}`;

    // 요청 옵션 설정
    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers: createHeaders(
        fetchOptions.headers as Record<string, string>,
        fetchOptions.method
      ),
      signal: controller.signal,
    };

    // API 요청
    const response = await fetch(url, requestOptions);

    // 401 Unauthorized 처리 (토큰 만료 또는 인증 실패)
    if (response.status === 401) {
      // 로컬 스토리지에서 인증 데이터 삭제
      const { clearAuthData } = await import('@/hooks/useLocalStorage');
      clearAuthData();

      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }

    // 403 Forbidden 처리 (CSRF 검증 실패 또는 권한 부족)
    if (response.status === 403) {
      const contentType = response.headers.get('content-type');

      // JSON 응답인 경우 에러 메시지 추출
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        // CSRF 검증 실패 여부 확인
        if (
          errorData.message &&
          errorData.message.includes('CSRF')
        ) {
          throw new Error(
            'CSRF 검증 실패: 요청이 거부되었습니다. 페이지를 새로고침하고 다시 시도해주세요.'
          );
        }
        throw new Error(errorData.message || '요청이 거부되었습니다.');
      }

      throw new Error('요청이 거부되었습니다 (권한 부족 또는 CSRF 검증 실패).');
    }

    // 다른 HTTP 에러 처리 (4xx, 5xx)
    if (!response.ok) {
      const contentType = response.headers.get('content-type');

      // JSON 응답인 경우 에러 메시지 추출
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || '요청 처리 중 오류가 발생했습니다.';
        throw new Error(errorMessage);
      }

      throw new Error(
        `요청 실패 (상태 코드: ${response.status}): ${response.statusText}`
      );
    }

    // 응답 파싱
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const data: T = await response.json();
      return data;
    }

    // JSON이 아닌 응답 (예: 문자열, 바이너리)
    const text = await response.text();
    return text as T;
  } catch (error) {
    // 타임아웃 에러 처리
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`요청 타임아웃 (${timeout}ms): ${endpoint}`);
    }

    // 네트워크 에러 또는 기타 에러
    if (error instanceof TypeError) {
      throw new Error(
        `네트워크 오류: ${error.message}. API 서버가 실행 중인지 확인해주세요.`
      );
    }

    // 기존 에러 재던지기
    throw error;
  } finally {
    // 타임아웃 정리
    clearTimeout(timeoutId);
  }
}

/**
 * POST 요청 헬퍼 함수
 *
 * @template T - 응답 데이터 타입
 * @param endpoint - API 엔드포인트
 * @param data - 요청 본문
 * @param options - 추가 옵션
 * @returns API 응답 데이터
 */
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * GET 요청 헬퍼 함수
 *
 * @template T - 응답 데이터 타입
 * @param endpoint - API 엔드포인트
 * @param options - 추가 옵션
 * @returns API 응답 데이터
 */
export async function apiGet<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * PUT 요청 헬퍼 함수
 *
 * @template T - 응답 데이터 타입
 * @param endpoint - API 엔드포인트
 * @param data - 요청 본문
 * @param options - 추가 옵션
 * @returns API 응답 데이터
 */
export async function apiPut<T>(
  endpoint: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE 요청 헬퍼 함수
 *
 * @template T - 응답 데이터 타입
 * @param endpoint - API 엔드포인트
 * @param options - 추가 옵션
 * @returns API 응답 데이터
 */
export async function apiDelete<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}
