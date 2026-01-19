/**
 * 대시보드 페이지 (관리자)
 * F002, F004, F006 기능 구현
 * 관리자가 모든 견적서를 확인하고 생성/삭제할 수 있는 페이지
 */

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground">대시보드</h1>
        <p className="text-sm text-muted-foreground">
          견적서를 한눈에 관리합니다
        </p>
      </div>

      {/* 통계 카드 영역 (향후 구현) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TODO: 통계 카드 구현 (총 견적서 수, 대기중, 승인됨, 거절됨) */}
      </div>

      {/* 견적서 목록 영역 */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            최근 견적서
          </h2>
          {/* TODO: 새 견적서 생성 버튼 추가 */}
        </div>

        {/* 견적서 목록 테이블 (향후 구현) */}
        <div className="rounded-lg border border-border bg-card">
          <div className="p-6 text-center text-muted-foreground">
            견적서 목록 개발 중...
          </div>
        </div>
      </div>
    </div>
  );
}
