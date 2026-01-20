'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/features/mobile-nav';
import { ThemeToggle } from '@/components/features/theme-toggle';
import { UserNav } from '@/components/features/user-nav';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { clearAuthData } from '@/hooks/useLocalStorage';

interface AppLayoutProps {
  /** 페이지 콘텐츠 */
  children: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 애플리케이션 메인 레이아웃
 * Header + Sidebar + Main Content를 조합합니다
 * 반응형 지원 (Desktop/Tablet/Mobile)
 */
export function AppLayout({ children, className }: AppLayoutProps) {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  // 로그아웃 핸들러
  const handleLogout = () => {
    // 인증 데이터 제거
    clearAuthData();
    // 스토어에서 사용자 정보 제거
    logout();
    // 로그인 페이지로 리디렉션
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen flex-col">
      {/* 헤더 */}
      <Header
        rightSlot={
          <div className="flex items-center gap-2">
            {currentUser && (
              <UserNav
                name={currentUser.name}
                email={currentUser.email}
                image={currentUser.image}
                onLogout={handleLogout}
              />
            )}
            <ThemeToggle />
          </div>
        }
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 (데스크톱만) */}
        <Sidebar />

        {/* 모바일 네비게이션 (모바일만) */}
        <MobileNav />

        {/* 메인 콘텐츠 */}
        <main className={cn('flex-1 overflow-y-auto', className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
