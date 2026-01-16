import { AppLayout } from '@/components/layout/app-layout';

/**
 * 보호된 라우트 레이아웃
 * 인증이 필요한 모든 페이지 (대시보드, 견적서 관리 등)에 AppLayout을 적용합니다.
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
