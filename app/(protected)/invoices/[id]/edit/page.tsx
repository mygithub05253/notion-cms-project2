import { Suspense } from 'react';
import { InvoiceEditContent } from './invoice-edit-content';

/**
 * 견적서 편집 페이지 (관리자 모드)
 * F007 기능 구현
 * 발급된 견적서를 수정할 수 있습니다
 */

export default async function InvoiceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">로딩 중...</div>}>
      <InvoiceEditContent id={id} />
    </Suspense>
  );
}
