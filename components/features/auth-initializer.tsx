'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * 인증 초기화 컴포넌트
 *
 * 앱이 로드될 때 저장된 토큰으로 사용자 세션을 복구합니다.
 * localStorage에 저장된 토큰이 있으면 사용자 정보를 로드합니다.
 *
 * @returns null - 렌더링하지 않고 초기화 작업만 수행
 */
export function AuthInitializer() {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    // 앱 로드 시 인증 상태 초기화
    initializeAuth();
  }, [initializeAuth]);

  // 이 컴포넌트는 초기화 작업만 수행하고 아무것도 렌더링하지 않음
  return null;
}
