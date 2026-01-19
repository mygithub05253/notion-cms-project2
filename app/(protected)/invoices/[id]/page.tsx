/**
 * 견적서 상세 페이지 (관리자 모드)
 * F003, F005, F006, F007 기능 구현
 * 발급된 견적서를 조회하고 수정, 삭제, 공유할 수 있습니다
 */

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* 페이지 헤더 및 액션 버튼 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">견적서 상세</h1>
          <p className="text-sm text-muted-foreground">
            견적서 ID: {params.id}
          </p>
        </div>
        {/* TODO: 수정, 삭제, 공유, 상태변경 버튼 추가 */}
      </div>

      {/* 상태 태그 (향후 구현) */}
      <div className="flex gap-2">
        {/* TODO: 상태 배지 추가 (대기, 승인, 거절 등) */}
      </div>

      {/* 견적서 상세 정보 */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6">
          <div className="space-y-6">
            {/* 클라이언트 정보 */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                클라이언트 정보
              </h2>
              {/* TODO: 클라이언트 상세 정보 표시 */}
              <div className="text-sm text-muted-foreground">
                클라이언트 정보 개발 중...
              </div>
            </div>

            {/* 항목 목록 */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                항목
              </h2>
              {/* TODO: 항목 테이블 구현 */}
              <div className="text-sm text-muted-foreground">
                항목 목록 개발 중...
              </div>
            </div>

            {/* 금액 요약 */}
            <div className="border-t border-border pt-6">
              <div className="space-y-2">
                {/* TODO: 소계, 세금, 총액 등 표시 */}
                <div className="text-sm text-muted-foreground">
                  금액 요약 개발 중...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 활동 기록 (향후 구현) */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            활동 기록
          </h2>
          {/* TODO: 활동 타임라인 구현 */}
          <div className="text-sm text-muted-foreground">
            활동 기록 개발 중...
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        {/* TODO: 저장, 취소 버튼 추가 */}
      </div>
    </div>
  );
}
