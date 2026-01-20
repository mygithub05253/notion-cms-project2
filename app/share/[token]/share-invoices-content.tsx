'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Invoice } from '@/types/index';
import { InvoiceCard } from '@/components/features/invoice-card';
import { EmptyState } from '@/components/features/empty-state';
import { FileText } from 'lucide-react';

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
  invoices,
}: ShareInvoicesContentProps) {
  // 로딩 상태 (향후 API 호출 시 사용)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 토큰 검증 (향후 API 호출)
    // TODO: API 호출로 토큰 검증 및 공유 견적서 목록 가져오기
    setIsLoading(false);
  }, [token]);

  // 견적서 존재 여부 확인
  const hasInvoices = invoices && invoices.length > 0;

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

      {/* 데이터 없을 때: EmptyState */}
      {!hasInvoices ? (
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
