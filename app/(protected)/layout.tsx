import { AppLayout } from '@/components/layout/app-layout';
import { AuthGuard } from '@/components/features/auth-guard';

/**
 * 보호된 라우트 레이아웃
 * 인증이 필요한 모든 페이지 (대시보드, 견적서 관리 등)에 AppLayout을 적용합니다.
 * AuthGuard로 인증 상태를 확인하고, 미인증 사용자를 로그인 페이지로 리디렉션합니다.
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}
