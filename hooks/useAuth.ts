'use client';

import { useAuthStore } from '@/store/useAuthStore';

/**
 * 인증 상태 및 기능을 제공하는 커스텀 훅
 *
 * useAuthStore를 래핑하여 간편한 인증 기능 접근을 제공합니다.
 *
 * @returns 인증 상태 및 액션
 *
 * @example
 * const { currentUser, isAuthenticated, login, logout } = useAuth();
 *
 * // 현재 사용자 확인
 * if (isAuthenticated) {
 *   console.log(currentUser.name);
 * }
 *
 * // 로그인
 * await login('user@example.com', 'password');
 *
 * // 로그아웃
 * await logout();
 */
export function useAuth() {
  const {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginClient,
    logout,
    initializeAuth,
    setCurrentUser,
    setError,
    clearError,
  } = useAuthStore();

  return {
    // 상태
    currentUser,
    isAuthenticated,
    isLoading,
    error,

    // 액션
    login,
    loginClient,
    logout,
    initializeAuth,
    setCurrentUser,
    setError,
    clearError,
  };
}
