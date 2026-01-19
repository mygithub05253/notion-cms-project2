import { Suspense } from 'react';
import { InvoiceDetailContent } from './invoice-detail-content';

/**
 * 견적서 상세 조회 페이지 (관리자 모드)
 * F003, F005, F006 기능 구현
 * 발급된 견적서의 상세 정보를 조회하고 수정/공유/삭제할 수 있습니다
 */

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">로딩 중...</div>}>
      <InvoiceDetailContent id={id} />
    </Suspense>
  );
}
