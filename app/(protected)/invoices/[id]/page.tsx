/**
 * 견적서 상세 페이지 (관리자 모드)
 * F003, F005, F006, F007 기능 구현
 * 발급된 견적서를 조회하고 수정, 삭제, 공유할 수 있습니다
 */

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">견적서 상세</h1>
        <p className="text-slate-500">견적서 ID: {params.id}</p>
      </div>

      {/* TODO: 견적서 상세 정보 및 수정 폼 구현 */}
      <div className="text-slate-500">
        견적서 상세 페이지 개발 중...
      </div>
    </div>
  );
}
