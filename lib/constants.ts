import { NavItem, AppConfig } from '@/types';

/**
 * 애플리케이션 설정
 */
export const APP_CONFIG: AppConfig = {
  appName: 'Invoice Web',
  appDescription: 'Invoice management platform with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
};

/**
 * 메인 네비게이션 메뉴 아이템
 * Sidebar에서 사용됩니다
 * 참고: (protected) 라우트 그룹은 URL에 포함되지 않으므로 경로에서 제외
 */
export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    title: '대시보드',
    href: '/dashboard',
    icon: 'Home',
  },
  {
    title: '견적서 목록',
    href: '/invoices',
    icon: 'FileText',
  },
  {
    title: '새 견적서',
    href: '/invoices/new',
    icon: 'Plus',
  },
];

/**
 * 사이드바 축소/확장 너비 설정 (Tailwind)
 */
export const SIDEBAR_WIDTH = {
  FULL: 'w-64',      // 펼쳐진 상태: 16rem (256px)
  COLLAPSED: 'w-20', // 축소된 상태: 5rem (80px)
};

/**
 * 반응형 브레이크포인트 (tailwind 기반)
 */
export const BREAKPOINTS = {
  MOBILE: '(max-width: 768px)',
  TABLET: '(max-width: 1024px)',
  DESKTOP: '(min-width: 1024px)',
};

/**
 * 사이트 메타데이터
 */
export const SITE_METADATA = {
  title: APP_CONFIG.appName,
  description: APP_CONFIG.appDescription,
  keywords: ['invoice', 'nextjs', 'tailwindcss', 'shadcn', 'typescript'],
  authors: [{ name: 'Invoice Web Team' }],
  creator: 'Invoice Web',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: APP_CONFIG.baseUrl,
    siteName: APP_CONFIG.appName,
    title: APP_CONFIG.appName,
    description: APP_CONFIG.appDescription,
  },
};
