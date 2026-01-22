'use client';

import { create } from 'zustand';
import type { User } from '@/types';

/**
 * 인증 상태 관리 스토어 (Zustand)
 * 사용자 인증 상태, 로그인/로그아웃 기능을 관리합니다
 */
interface AuthStore {
  // 상태
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  login: (email: string, password: string) => Promise<void>;
  loginClient: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // 초기 상태
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // 로그인
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // API 호출을 동적으로 임포트하여 순환 의존성 방지
      const { loginApi } = await import('@/lib/api-auth');
      const { setToken, setStoredUser } = await import('@/hooks/useLocalStorage');

      // 백엔드 API 호출
      const response = await loginApi(email, password);

      // 토큰 저장
      setToken(response.token);
      setStoredUser(response.user);

      // 상태 업데이트
      set({
        currentUser: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인 실패';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // 클라이언트 로그인
  loginClient: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // API 호출을 동적으로 임포트하여 순환 의존성 방지
      const { loginClientApi } = await import('@/lib/api-auth');
      const { setToken, setStoredUser } = await import('@/hooks/useLocalStorage');

      // 백엔드 API 호출
      const response = await loginClientApi(email, password);

      // 토큰 저장
      setToken(response.token);
      setStoredUser(response.user);

      // 상태 업데이트
      set({
        currentUser: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인 실패';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      // 동적 임포트로 순환 의존성 방지
      const { logoutApi } = await import('@/lib/api-auth');
      const { clearAuthData } = await import('@/hooks/useLocalStorage');

      // 백엔드 API 호출 (옵션)
      try {
        await logoutApi();
      } catch {
        // API 호출 실패해도 로컬 스토리지는 정리
      }

      // 로컬 스토리지 정리
      clearAuthData();

      // 상태 초기화
      set({
        currentUser: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      // 오류가 발생해도 상태는 초기화
      set({
        currentUser: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  // 앱 초기화 시 인증 상태 복구
  initializeAuth: async () => {
    try {
      const { getToken, getStoredUser } = await import('@/hooks/useLocalStorage');

      // 저장된 토큰 확인
      const token = getToken();
      if (!token) {
        set({ isAuthenticated: false, currentUser: null });
        return;
      }

      // 저장된 사용자 정보 확인
      const user = getStoredUser();
      if (user) {
        set({
          currentUser: user,
          isAuthenticated: true,
        });
      } else {
        // 토큰은 있지만 사용자 정보가 없으면, 서버에서 조회 시도 (선택사항)
        try {
          const { getMeApi } = await import('@/lib/api-auth');
          const userData = await getMeApi();
          const { setStoredUser } = await import('@/hooks/useLocalStorage');
          setStoredUser(userData);
          set({
            currentUser: userData,
            isAuthenticated: true,
          });
        } catch {
          // 서버 조회 실패 시 토큰만 있는 상태로 유지
          set({ isAuthenticated: true, currentUser: null });
        }
      }
    } catch (error) {
      console.error('초기 인증 확인 중 오류:', error);
      set({ isAuthenticated: false, currentUser: null });
    }
  },

  // 사용자 정보 설정
  setCurrentUser: (user: User | null) => {
    set({
      currentUser: user,
      isAuthenticated: user !== null,
    });
  },

  // 에러 메시지 설정
  setError: (error: string | null) => {
    set({ error });
  },

  // 에러 메시지 초기화
  clearError: () => {
    set({ error: null });
  },
}));
