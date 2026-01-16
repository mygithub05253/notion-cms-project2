'use client';

import { create } from 'zustand';
import { UIState } from '@/types';

/**
 * UI 상태 관리 스토어 (Zustand)
 * 사이드바, 모바일 메뉴 등의 전역 UI 상태를 관리합니다
 */
export const useUIStore = create<
  UIState & {
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleMobileMenu: () => void;
    setMobileMenuOpen: (open: boolean) => void;
  }
>((set) => ({
  // 초기 상태
  sidebarOpen: true,
  mobileMenuOpen: false,

  // 액션: 사이드바 토글
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  // 액션: 사이드바 상태 직접 설정
  setSidebarOpen: (open: boolean) =>
    set({
      sidebarOpen: open,
    }),

  // 액션: 모바일 메뉴 토글
  toggleMobileMenu: () =>
    set((state) => ({
      mobileMenuOpen: !state.mobileMenuOpen,
    })),

  // 액션: 모바일 메뉴 상태 직접 설정
  setMobileMenuOpen: (open: boolean) =>
    set({
      mobileMenuOpen: open,
    }),
}));
