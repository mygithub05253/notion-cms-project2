/**
 * 공개 견적서 목록 페이지 (클라이언트)
 * F002, F008 기능 구현
 * 공유 토큰으로 접근하는 클라이언트가 견적서 목록을 확인합니다
 */

export default function ShareInvoicesPage({ params }: { params: { token: string } }) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground">공유 견적서 목록</h1>
        <p className="text-sm text-muted-foreground">
          공유된 견적서를 확인합니다
        </p>
      </div>

      {/* 보안 정보 (토큰 기반 접근) */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100">
        이 페이지는 공유 링크로 접근한 페이지입니다.
      </div>

      {/* 견적서 목록 테이블 */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6 text-center text-muted-foreground">
          공개 견적서 목록 테이블 개발 중...
        </div>
      </div>

      {/* 페이지네이션 (향후 구현) */}
      <div className="flex justify-center">
        {/* TODO: 페이지네이션 추가 */}
      </div>
    </div>
  );
}
