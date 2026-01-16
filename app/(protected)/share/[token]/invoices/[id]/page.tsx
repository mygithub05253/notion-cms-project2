/**
 * 견적서 상세 페이지 (클라이언트 공개 모드)
 * F003, F009 기능 구현
 * 클라이언트가 견적서 내용을 확인하고 PDF로 다운로드합니다
 */

export default function ShareInvoiceDetailPage({
  params,
}: {
  params: { token: string; id: string };
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">견적서 상세</h1>
        <p className="text-slate-500">공유된 견적서를 확인합니다</p>
      </div>

      {/* TODO: 공개 견적서 상세 정보 및 PDF 다운로드 구현 */}
      <div className="text-slate-500">
        공개 견적서 상세 페이지 개발 중... (Token: {params.token}, ID: {params.id})
      </div>
    </div>
  );
}
