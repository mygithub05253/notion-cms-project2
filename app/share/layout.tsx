/**
 * 공개 견적서 공유 페이지 레이아웃
 * 로그인 없이 접근 가능한 공개 페이지
 * ShareHeader를 사용하여 간단한 헤더 표시
 */

import { ReactNode } from 'react';

interface ShareLayoutProps {
  children: ReactNode;
}

export default function ShareLayout({ children }: ShareLayoutProps) {
  return <>{children}</>;
}
