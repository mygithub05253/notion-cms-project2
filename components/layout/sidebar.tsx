'use client';

import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/use-sidebar';
import { useMediaQuery } from 'usehooks-ts';
import { MAIN_NAV_ITEMS, BREAKPOINTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NavItem } from '@/components/features/nav-item';
import { cn } from '@/lib/utils';

interface SidebarProps {
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 사이드바 컴포넌트
 * 네비게이션 메뉴를 표시합니다 (반응형 지원)
 * - 데스크톱: 항상 표시, 축소/확장 가능
 * - 태블릿/모바일: 숨김 (MobileNav에서 Sheet로 표시)
 */
export function Sidebar({ className }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const isTablet = useMediaQuery(BREAKPOINTS.TABLET);

  // 태블릿/모바일에서는 사이드바를 렌더링하지 않음
  // MobileNav가 대신 처리합니다
  if (isTablet) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex h-screen flex-col border-r bg-background transition-all duration-300',
        isOpen ? 'w-64' : 'w-20',
        className
      )}
    >
      {/* 사이드바 헤더: 축소 버튼 */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        {isOpen && <h1 className="text-lg font-bold">메뉴</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          title={isOpen ? '사이드바 축소' : '사이드바 확장'}
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              !isOpen && 'rotate-180'
            )}
          />
        </Button>
      </div>

      <Separator />

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {MAIN_NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            collapsed={!isOpen}
          />
        ))}
      </nav>

      {/* 사이드바 푸터 (선택사항) */}
      <Separator />
      <div className="p-4">
        <p
          className={cn(
            'text-xs text-muted-foreground',
            !isOpen && 'text-center'
          )}
        >
          {isOpen ? 'v1.0.0' : ''}
        </p>
      </div>
    </div>
  );
}
