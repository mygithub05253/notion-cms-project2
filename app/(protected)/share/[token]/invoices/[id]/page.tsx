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
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* 페이지 헤더 및 액션 버튼 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">견적서 상세</h1>
          <p className="text-sm text-muted-foreground">
            공유된 견적서를 확인합니다
          </p>
        </div>
        {/* TODO: PDF 다운로드, 인쇄 버튼 추가 */}
      </div>

      {/* 보안 정보 */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100">
        이 페이지는 공유 링크로 접근한 페이지입니다. 로그인이 필요하지 않습니다.
      </div>

      {/* 견적서 상세 정보 */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6">
          <div className="space-y-6">
            {/* 발급사 정보 */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                발급사 정보
              </h2>
              {/* TODO: 발급사 상세 정보 표시 */}
              <div className="text-sm text-muted-foreground">
                발급사 정보 개발 중...
              </div>
            </div>

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

            {/* 메모/설명 */}
            <div className="border-t border-border pt-6">
              <h3 className="mb-2 font-semibold text-foreground">
                추가 정보
              </h3>
              {/* TODO: 메모, 약관 등 표시 */}
              <div className="text-sm text-muted-foreground">
                추가 정보 개발 중...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF 다운로드, 인쇄 버튼 */}
      <div className="flex gap-3">
        {/* TODO: PDF 다운로드, 인쇄 버튼 추가 */}
      </div>
    </div>
  );
}
