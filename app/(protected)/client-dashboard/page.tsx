import { AuthGuard } from '@/components/features/auth-guard';

/**
 * 클라이언트 대시보드 페이지
 * 클라이언트가 공유받은 견적서 목록을 확인합니다
 * 진행 예정: Task 025에서 전체 구현
 */
export default function ClientDashboardPage() {
  return (
    <AuthGuard requiredRole="client">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">클라이언트 대시보드</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              공유받은 견적서를 확인하고 PDF로 다운로드합니다
            </p>
          </div>

          {/* 임시 플레이스홀더 */}
          <div className="bg-slate-50 dark:bg-slate-900/20 rounded-lg p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              클라이언트 대시보드 개발 중입니다. (Task 025)
            </p>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
