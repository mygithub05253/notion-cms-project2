import { AppLayout } from '@/components/layout/app-layout';
import { AuthGuard } from '@/components/features/auth-guard';

/**
 * 보호된 라우트 레이아웃 - 관리자 전용
 * 인증이 필요하고 관리자(admin) 역할만 접근 가능한 페이지 (대시보드, 견적서 관리 등)에 AppLayout을 적용합니다.
 * AuthGuard로 인증 상태를 확인하고, 미인증 사용자 또는 일반 클라이언트를 로그인 페이지로 리디렉션합니다.
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="admin">
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}
