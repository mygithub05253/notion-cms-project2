/**
 * 견적서 목록 페이지 (관리자)
 * F002 기능 구현
 * 관리자가 발급한 모든 견적서를 조회할 수 있는 페이지
 */

export default function InvoicesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">견적서 목록</h1>
          <p className="text-sm text-muted-foreground">
            발급한 모든 견적서를 관리합니다
          </p>
        </div>
        {/* TODO: 새 견적서 생성 버튼 추가 */}
      </div>

      {/* 필터 및 검색 영역 (향후 구현) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* TODO: 검색창, 필터 드롭다운 등 추가 */}
      </div>

      {/* 견적서 목록 테이블 */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6 text-center text-muted-foreground">
          견적서 목록 테이블 개발 중...
        </div>
      </div>

      {/* 페이지네이션 (향후 구현) */}
      <div className="flex justify-center">
        {/* TODO: 페이지네이션 추가 */}
      </div>
    </div>
  );
}
