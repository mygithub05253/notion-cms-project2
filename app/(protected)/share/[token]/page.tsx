/**
 * 공개 견적서 목록 페이지 (클라이언트)
 * F002, F008 기능 구현
 * 공유 토큰으로 접근하는 클라이언트가 견적서 목록을 확인합니다
 */

export default function ShareInvoicesPage({ params }: { params: { token: string } }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">공유 견적서 목록</h1>
        <p className="text-slate-500">공유된 견적서를 확인합니다</p>
      </div>

      {/* TODO: 공개 견적서 목록 구현 */}
      <div className="text-slate-500">
        공개 견적서 목록 개발 중... (Token: {params.token})
      </div>
    </div>
  );
}
