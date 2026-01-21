'use client';

import { Invoice } from '@/types/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { memo, useMemo } from 'react';

/**
 * InvoiceCard 컴포넌트
 * 견적서 한 건을 카드 형식으로 표시
 * React.memo를 사용한 렌더링 최적화 적용
 */

interface InvoiceCardProps {
  /** 견적서 데이터 */
  invoice: Invoice;
  /** 카드 클릭 핸들러 */
  onClick?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

// 상태별 배지 색상 맵
const statusBadgeVariants = {
  draft: 'secondary',
  sent: 'default',
  accepted: 'default',
  rejected: 'destructive',
} as const;

// 상태 텍스트 맵
const statusTextMap = {
  draft: '임시저장',
  sent: '발송됨',
  accepted: '수락됨',
  rejected: '거절됨',
} as const;

function InvoiceCardImpl({
  invoice,
  onClick,
  className,
}: InvoiceCardProps) {
  // 금액 포맷팅 (원화) - useMemo로 캐싱
  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(invoice.totalAmount);
  }, [invoice.totalAmount]);

  // 날짜 포맷팅 - useMemo로 캐싱
  const formattedDate = useMemo(() => {
    return format(invoice.createdAt, 'yyyy년 MM월 dd일', {
      locale: ko,
    });
  }, [invoice.createdAt]);

  return (
    <Card
      onClick={onClick}
      className={cn(
        'overflow-hidden transition-all hover:shadow-md',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{invoice.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {invoice.clientName}
            </p>
          </div>
          <Badge
            variant={statusBadgeVariants[invoice.status]}
            className="shrink-0"
          >
            {statusTextMap[invoice.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* 설명 */}
        {invoice.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {invoice.description}
          </p>
        )}

        {/* 금액 및 날짜 */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">총액</p>
            <p className="text-xl font-bold">
              {formattedAmount}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">작성일자</p>
            <p className="text-sm font-medium">{formattedDate}</p>
          </div>
        </div>

        {/* 항목 개수 */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            항목 {invoice.items.length}개
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// React.memo로 래핑하여 props 변경 시에만 리렌더링
export const InvoiceCard = memo(InvoiceCardImpl);
