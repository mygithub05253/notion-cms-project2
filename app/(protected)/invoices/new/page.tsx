/**
 * 견적서 생성 페이지
 * F004, F010 기능 구현
 * 새로운 견적서를 작성하고 시스템에 저장합니다
 */

export default function NewInvoicePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground">새 견적서 생성</h1>
        <p className="text-sm text-muted-foreground">
          새로운 견적서를 작성합니다
        </p>
      </div>

      {/* 견적서 생성 폼 */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6">
          {/* TODO: 견적서 생성 폼 구현
            - 클라이언트 정보 입력
            - 항목 추가 (상품/서비스)
            - 금액 계산
            - 저장 및 공유 버튼
          */}
          <div className="text-center text-muted-foreground">
            견적서 생성 폼 개발 중...
          </div>
        </div>
      </div>

      {/* 저장/취소 버튼 (향후 구현) */}
      <div className="flex gap-3">
        {/* TODO: 저장, 임시저장, 취소 버튼 추가 */}
      </div>
    </div>
  );
}
