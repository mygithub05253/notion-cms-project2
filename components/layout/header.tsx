'use client';

import Link from 'next/link';
import { useMediaQuery } from 'usehooks-ts';
import { Menu } from 'lucide-react';
import { APP_CONFIG, BREAKPOINTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUIStore } from '@/store/use-ui-store';
import { cn } from '@/lib/utils';

interface HeaderProps {
  /** 헤더에 추가할 오른쪽 슬롯 (ThemeToggle, UserNav 등) */
  rightSlot?: React.ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 헤더 컴포넌트
 * 로고, 모바일 메뉴 버튼, 오른쪽 슬롯(테마, 사용자 메뉴)을 포함합니다
 */
export function Header({ rightSlot, className }: HeaderProps) {
  const isMobile = useMediaQuery(BREAKPOINTS.MOBILE);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-background',
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 왼쪽: 로고 */}
        <div className="flex items-center gap-4">
          {/* 모바일 메뉴 버튼 */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          )}

          {/* 로고/사이트명 */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
              N
            </div>
            <span className="hidden sm:inline-block">{APP_CONFIG.appName}</span>
          </Link>
        </div>

        {/* 오른쪽: 테마 토글, 사용자 메뉴 등 */}
        <div className="flex items-center gap-4">
          {rightSlot}
        </div>
      </div>

      <Separator />
    </header>
  );
}
