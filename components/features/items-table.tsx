'use client';

import { InvoiceItem } from '@/types/index';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ItemsTable 컴포넌트
 * 견적서 항목들을 테이블 형식으로 표시
 */

interface ItemsTableProps {
  /** 견적서 항목 배열 */
  items: InvoiceItem[];
  /** 액션 버튼 표시 여부 (편집 모드) */
  showActions?: boolean;
  /** 항목 수정 핸들러 */
  onEdit?: (id: string) => void;
  /** 항목 삭제 핸들러 */
  onDelete?: (id: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function ItemsTable({
  items,
  showActions = false,
  onEdit,
  onDelete,
  className,
}: ItemsTableProps) {
  // 총액 계산
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  // 금액 포맷팅 (원화)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={cn('w-full', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">제목</TableHead>
            <TableHead className="hidden sm:table-cell">설명</TableHead>
            <TableHead className="text-right w-[80px]">수량</TableHead>
            <TableHead className="text-right w-[80px]">단위</TableHead>
            <TableHead className="text-right w-[100px]">단가</TableHead>
            <TableHead className="text-right w-[120px]">소계</TableHead>
            {showActions && <TableHead className="text-right w-[100px]">액션</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              {/* 제목 */}
              <TableCell className="font-medium">{item.title}</TableCell>

              {/* 설명 */}
              <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                {item.description}
              </TableCell>

              {/* 수량 */}
              <TableCell className="text-right">{item.quantity}</TableCell>

              {/* 단위 */}
              <TableCell className="text-right">{item.unit}</TableCell>

              {/* 단가 */}
              <TableCell className="text-right text-sm">
                {formatCurrency(item.unitPrice)}
              </TableCell>

              {/* 소계 */}
              <TableCell className="text-right font-semibold">
                {formatCurrency(item.subtotal)}
              </TableCell>

              {/* 액션 버튼 */}
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item.id)}
                        title="수정"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                        title="삭제"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>

        {/* 총액 푸터 */}
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={showActions ? 6 : 5}
              className="text-right font-bold"
            >
              총액
            </TableCell>
            <TableCell className="text-right font-bold">
              {formatCurrency(totalAmount)}
            </TableCell>
            {showActions && <TableCell />}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
