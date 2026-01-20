'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Invoice } from '@/types/index';
import { InvoiceCard } from '@/components/features/invoice-card';
import { EmptyState } from '@/components/features/empty-state';
import { FileText, AlertCircle } from 'lucide-react';

/**
 * 공유 견적서 목록 콘텐츠 컴포넌트
 * 클라이언트 모드: 토큰 기반 공개 페이지에서 공유받은 견적서 목록 표시
 * F009 기능 구현 - 공유받은 견적서 카드 그리드 표시
 * - 견적서 카드 그리드 표시 (반응형)
 * - 통계 정보 표시 (총 건수, 상태 분포)
 * - 비어있을 때 EmptyState 표시
 */

/** 공유 견적서 목록 콘텐츠 Props */
interface ShareInvoicesContentProps {
  /** 공유 토큰 (URL에서 추출) */
  token: string;
  /** 공유된 견적서 목록 배열 */
  invoices: Invoice[];
}

/**
 * 공유 견적서 목록 렌더링
 * 반응형 그리드로 견적서 카드 표시, 호버 시 상세 페이지로 이동
 */
export function ShareInvoicesContent({
  token,
  invoices: initialInvoices,
}: ShareInvoicesContentProps) {
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  // 토큰 유효 여부
  const [isValidToken, setIsValidToken] = useState(true);
  // 공유 견적서 목록
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  // 에러 메시지
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateAndFetchInvoices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 토큰 검증
        const { validateShareTokenApi } = await import('@/lib/api-share');
        const isValid = await validateShareTokenApi(token);

        if (!isValid) {
          setIsValidToken(false);
          setError('유효하지 않거나 만료된 공유 링크입니다.');
          setIsLoading(false);
          return;
        }

        // 공유 견적서 목록 조회
        const { getSharedInvoicesApi } = await import('@/lib/api-share');
        const fetchedInvoices = await getSharedInvoicesApi(token);
        setInvoices(fetchedInvoices);
        setIsValidToken(true);
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '공유 견적서 조회 실패';
        setError(errorMessage);
        setIsValidToken(false);
        setIsLoading(false);
      }
    };

    validateAndFetchInvoices();
  }, [token]);

  // 견적서 존재 여부 확인
  const hasInvoices = invoices && invoices.length > 0;

  // 토큰이 유효하지 않은 경우
  if (!isValidToken) {
    return (
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            공유된 견적서
          </h1>
          <p className="text-sm text-muted-foreground">
            공유받으신 견적서 목록입니다
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center py-12">
          <EmptyState
            icon={AlertCircle}
            title="접근할 수 없습니다"
            description={error || '유효하지 않거나 만료된 공유 링크입니다'}
          />
        </div>

        <div className="pt-8 border-t text-center text-xs text-muted-foreground">
          <p>Invoice Web - 디지털 견적서 관리 플랫폼</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* 페이지 헤더 섹션 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          공유된 견적서
        </h1>
        <p className="text-sm text-muted-foreground">
          공유받으신 견적서 목록입니다
        </p>
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">공유 견적서를 불러오는 중입니다...</p>
          </div>
        </div>
      ) : !hasInvoices ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <EmptyState
            icon={FileText}
            title="공유된 견적서가 없습니다"
            description="발급자로부터 받은 견적서가 없습니다"
          />
        </div>
      ) : (
        <>
          {/* 견적서 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/share/${token}/invoices/${invoice.id}`}
              >
                <InvoiceCard
                  invoice={invoice}
                  className="h-full transition-all hover:shadow-lg"
                />
              </Link>
            ))}
          </div>

          {/* 통계 정보 (선택) */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">총 견적서</p>
              <p className="text-lg font-semibold">{invoices.length}건</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">상태 분포</p>
              <p className="text-sm text-muted-foreground">
                {invoices.filter((inv) => inv.status === 'sent').length}개 발송 |{' '}
                {invoices.filter((inv) => inv.status === 'accepted').length}개 수락 |{' '}
                {invoices.filter((inv) => inv.status === 'rejected').length}개 거절
              </p>
            </div>
          </div>
        </>
      )}

      {/* 바닥글 */}
      <div className="pt-8 border-t text-center text-xs text-muted-foreground">
        <p>Invoice Web - 디지털 견적서 관리 플랫폼</p>
      </div>
    </div>
  );
}
