/**
 * 공유 페이지 헤더 컴포넌트
 * 공개 견적서 페이지에서 사용하는 간단한 헤더
 * 로그인 없이 접근 가능한 공개 페이지용
 */

import Link from 'next/link';

export function ShareHeader() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* 로고/회사명 */}
        <div className="flex items-center gap-2">
          <div className="font-bold text-lg text-foreground">Invoice Web</div>
        </div>

        {/* 간단한 네비게이션 (선택) */}
        <nav className="text-sm text-muted-foreground">
          {/* 향후 추가 가능 */}
        </nav>
      </div>
    </header>
  );
}
