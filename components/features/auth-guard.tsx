'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';

/**
 * 인증된 사용자만 접근할 수 있는 보호된 라우트 컴포넌트
 *
 * 미인증 사용자가 이 컴포넌트로 감싼 페이지에 접근하면
 * 자동으로 로그인 페이지(/`)로 리디렉션합니다.
 *
 * @param children - 보호된 콘텐츠
 * @param requiredRole - 필요한 사용자 역할 (선택사항: 'admin' | 'client')
 * @returns 인증된 사용자에게만 보여주는 컴포넌트
 *
 * @example
 * // 보호된 라우트 (모든 인증된 사용자)
 * <AuthGuard>
 *   <DashboardPage />
 * </AuthGuard>
 *
 * // 역할 기반 보호 (관리자만)
 * <AuthGuard requiredRole="admin">
 *   <AdminPanel />
 * </AuthGuard>
 */
interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: User['role'];
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  useEffect(() => {
    // 로딩 중이면 대기
    if (isLoading) {
      return;
    }

    // 미인증 사용자는 로그인 분기 페이지로 리디렉션
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 역할 기반 접근 제어 (requiredRole이 지정된 경우)
    if (requiredRole && currentUser?.role !== requiredRole) {
      // 접근 불가 페이지로 리디렉션 (또는 대시보드)
      router.push('/login');
      return;
    }
  }, [isAuthenticated, currentUser, requiredRole, isLoading, router]);

  // 로딩 중에는 아무것도 표시하지 않음
  if (isLoading) {
    return null;
  }

  // 미인증 또는 역할 불일치 상태
  if (!isAuthenticated || (requiredRole && currentUser?.role !== requiredRole)) {
    return null;
  }

  // 인증된 사용자이고 역할이 일치하면 콘텐츠 렌더링
  return <>{children}</>;
}
