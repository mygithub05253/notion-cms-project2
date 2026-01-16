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
  logout: () => void;
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
      // TODO: 백엔드 API 호출
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();

      // 임시 구현 (클라이언트만)
      const user: User = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set({
        currentUser: user,
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
  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
      error: null,
    });
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
