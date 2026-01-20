/**
 * 견적서 상세 페이지 (클라이언트 공개 모드)
 * F003, F009 기능 구현
 * 클라이언트가 견적서 내용을 확인하고 PDF로 다운로드합니다
 */

import { ShareHeader } from '@/components/features/share-header';
import { ShareInvoiceDetailContent } from './share-invoice-detail-content';
import { mockInvoices } from '@/lib/mock-data';

export default async function ShareInvoiceDetailPage({
  params,
}: {
  params: Promise<{ token: string; id: string }>;
}) {
  const { token, id } = await params;

  // Mock 데이터에서 견적서 조회
  const invoice = mockInvoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <ShareHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              견적서를 찾을 수 없습니다
            </h1>
            <p className="text-muted-foreground">
              요청하신 견적서가 존재하지 않거나 접근 권한이 없습니다.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 헤더 */}
      <ShareHeader />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8 sm:py-10 lg:py-12">
        <ShareInvoiceDetailContent
          invoice={invoice}
          token={token}
          invoiceId={id}
        />
      </main>
    </div>
  );
}
