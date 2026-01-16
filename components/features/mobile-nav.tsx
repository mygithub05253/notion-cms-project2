'use client';

import { X } from 'lucide-react';
import { useUIStore } from '@/store/use-ui-store';
import { useMediaQuery } from 'usehooks-ts';
import { MAIN_NAV_ITEMS, BREAKPOINTS } from '@/lib/constants';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { NavItem } from '@/components/features/nav-item';
import { Button } from '@/components/ui/button';

/**
 * 모바일 네비게이션 컴포넌트
 * 모바일 화면에서 Sheet로 사이드바 메뉴를 표시합니다
 */
export function MobileNav() {
  const mobileMenuOpen = useUIStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen);
  const isMobile = useMediaQuery(BREAKPOINTS.MOBILE);

  // 모바일이 아니면 렌더링하지 않음
  if (!isMobile) {
    return null;
  }

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>메뉴</SheetTitle>
        </SheetHeader>

        <Separator className="my-4" />

        {/* 모바일 네비게이션 메뉴 */}
        <nav className="space-y-1">
          {MAIN_NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left"
            >
              <NavItem {...item} />
            </button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
