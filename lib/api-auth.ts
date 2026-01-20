/**
 * 인증 API 모듈
 *
 * 로그인, 로그아웃, 사용자 정보 조회 등 인증 관련 API 함수를 제공합니다.
 */

import type { User } from '@/types';
import { apiFetch, apiPost, apiGet } from '@/lib/api-config';

/**
 * 로그인 API 응답 타입
 */
interface LoginResponse {
  token: string;
  user: User;
}

/**
 * 로그인 API 함수
 *
 * 이메일과 비밀번호로 사용자를 인증하고 JWT 토큰을 받아옵니다.
 *
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호
 * @returns 토큰과 사용자 정보
 * @throws {Error} 로그인 실패 또는 네트워크 오류
 *
 * @example
 * const response = await loginApi('user@example.com', 'password123');
 * console.log(response.token); // JWT 토큰
 * console.log(response.user);  // 사용자 정보
 */
export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await apiPost<LoginResponse>('/auth/login', {
      email,
      password,
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      // 에러 메시지 개선
      if (error.message.includes('네트워크')) {
        throw new Error('네트워크 연결을 확인해주세요.');
      }
      throw error;
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
}

/**
 * 로그아웃 API 함수
 *
 * 사용자를 로그아웃합니다. 서버에서 토큰을 무효화하거나 세션을 종료할 수 있습니다.
 *
 * @throws {Error} 로그아웃 요청 실패
 *
 * @example
 * await logoutApi();
 */
export async function logoutApi(): Promise<void> {
  try {
    await apiFetch<void>('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    if (error instanceof Error) {
      // 네트워크 오류는 로그만 하고 진행 (로컬 스토리지 정리는 이미 진행됨)
      if (error.message.includes('네트워크')) {
        console.warn('로그아웃 요청 중 네트워크 오류 발생. 로컬 데이터는 정리되었습니다.');
        return;
      }
    }
    // 기타 에러는 던지기
    throw error;
  }
}

/**
 * 현재 사용자 정보 조회 API 함수
 *
 * 인증된 사용자의 현재 정보를 서버에서 조회합니다.
 * 토큰 유효성 검증과 사용자 정보 동기화에 사용됩니다.
 *
 * @returns 현재 로그인한 사용자 정보
 * @throws {Error} 사용자 정보 조회 실패 또는 인증 실패
 *
 * @example
 * const user = await getMeApi();
 * console.log(user.email); // 사용자 이메일
 */
export async function getMeApi(): Promise<User> {
  try {
    const user = await apiGet<User>('/auth/me');
    return user;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('인증이 만료')) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      if (error.message.includes('네트워크')) {
        throw new Error('네트워크 연결을 확인해주세요.');
      }
    }
    throw error;
  }
}

/**
 * 토큰 갱신 API 함수 (선택사항)
 *
 * Refresh 토큰을 사용하여 새로운 Access 토큰을 발급받습니다.
 * 토큰 만료 시 자동으로 갱신할 때 사용됩니다.
 *
 * @param refreshToken - Refresh 토큰
 * @returns 새로운 Access 토큰
 * @throws {Error} 토큰 갱신 실패
 *
 * @example
 * const { token } = await refreshTokenApi(refreshToken);
 * setToken(token);
 */
export async function refreshTokenApi(refreshToken: string): Promise<{ token: string }> {
  try {
    const response = await apiPost<{ token: string }>('/auth/refresh', {
      refreshToken,
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('인증이 만료')) {
        throw new Error('갱신 토큰이 만료되었습니다. 다시 로그인해주세요.');
      }
    }
    throw error;
  }
}

/**
 * 회원가입 API 함수
 *
 * 새로운 사용자 계정을 생성합니다.
 *
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호
 * @param name - 사용자명
 * @returns 로그인 응답 (토큰과 사용자 정보)
 * @throws {Error} 회원가입 실패
 *
 * @example
 * const response = await signupApi('user@example.com', 'password123', 'John Doe');
 */
export async function signupApi(
  email: string,
  password: string,
  name: string
): Promise<LoginResponse> {
  try {
    const response = await apiPost<LoginResponse>('/auth/signup', {
      email,
      password,
      name,
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('네트워크')) {
        throw new Error('네트워크 연결을 확인해주세요.');
      }
      if (error.message.includes('이미 존재')) {
        throw new Error('이미 가입된 이메일입니다.');
      }
    }
    throw error;
  }
}
