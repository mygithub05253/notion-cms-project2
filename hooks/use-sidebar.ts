'use client';

import { useUIStore } from '@/store/use-ui-store';

/**
 * 사이드바 상태 관리 커스텀 훅
 * Zustand 스토어를 래핑하여 사이드바 기능을 제공합니다
 */
export function useSidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  return {
    /** 사이드바 열림/닫힘 상태 */
    isOpen: sidebarOpen,
    /** 사이드바 토글 함수 */
    toggle: toggleSidebar,
    /** 사이드바 상태 설정 함수 */
    setOpen: setSidebarOpen,
  };
}
