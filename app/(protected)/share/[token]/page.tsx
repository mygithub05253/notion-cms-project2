/**
 * 공개 견적서 목록 페이지 (클라이언트)
 * F002, F008 기능 구현
 * 공유 토큰으로 접근하는 클라이언트가 견적서 목록을 확인합니다
 */

import { ShareHeader } from '@/components/features/share-header';
import { ShareInvoicesContent } from './share-invoices-content';
import { mockInvoices } from '@/lib/mock-data';

export default function ShareInvoicesPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;

  // Mock 데이터에서 공유된 견적서 필터
  // 실제 구현: API 호출로 토큰 기반 데이터 로드
  // TODO: 실제 토큰 검증 및 데이터 페칭 로직 구현 (Phase 3)
  const sharedInvoices = mockInvoices;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 헤더 */}
      <ShareHeader />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 lg:py-12">
        <ShareInvoicesContent token={token} invoices={sharedInvoices} />
      </main>
    </div>
  );
}
