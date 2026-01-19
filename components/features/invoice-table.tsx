'use client';

import { Invoice } from '@/types/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * InvoiceTable 컴포넌트
 * 견적서 목록을 테이블 형식으로 표시
 */

interface InvoiceTableProps {
  /** 견적서 배열 */
  invoices: Invoice[];
  /** 수정 핸들러 */
  onEdit?: (id: string) => void;
  /** 삭제 핸들러 */
  onDelete?: (id: string) => void;
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

export function InvoiceTable({
  invoices,
  onEdit,
  onDelete,
  className,
}: InvoiceTableProps) {
  // 금액 포맷팅 (원화)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd', { locale: ko });
  };

  return (
    <div className={cn('w-full', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="min-w-[200px]">제목</TableHead>
            <TableHead className="hidden md:table-cell min-w-[150px]">
              클라이언트
            </TableHead>
            <TableHead className="hidden lg:table-cell w-[100px]">상태</TableHead>
            <TableHead className="text-right w-[120px]">금액</TableHead>
            <TableHead className="hidden sm:table-cell w-[100px]">작성일자</TableHead>
            <TableHead className="text-right w-[100px]">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              {/* ID */}
              <TableCell className="font-mono text-xs text-muted-foreground">
                {invoice.id.slice(0, 8)}
              </TableCell>

              {/* 제목 */}
              <TableCell className="font-medium truncate">
                {invoice.title}
              </TableCell>

              {/* 클라이언트 */}
              <TableCell className="hidden md:table-cell text-sm">
                {invoice.clientName}
              </TableCell>

              {/* 상태 */}
              <TableCell className="hidden lg:table-cell">
                <Badge variant={statusBadgeVariants[invoice.status]}>
                  {statusTextMap[invoice.status]}
                </Badge>
              </TableCell>

              {/* 금액 */}
              <TableCell className="text-right font-semibold">
                {formatCurrency(invoice.totalAmount)}
              </TableCell>

              {/* 작성일자 */}
              <TableCell className="hidden sm:table-cell text-sm">
                {formatDate(invoice.createdAt)}
              </TableCell>

              {/* 액션 */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(invoice.id)}
                      title="수정"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(invoice.id)}
                      title="삭제"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
