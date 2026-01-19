'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Download,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import { Invoice, InvoiceStatus } from '@/types/index';
import { mockUsers } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ItemsTable } from '@/components/features/items-table';
import { cn } from '@/lib/utils';

/**
 * 공개 견적서 상세 콘텐츠 컴포넌트
 * 클라이언트가 공유받은 견적서의 읽기 전용 상세 페이지
 * 응답 버튼, PDF 다운로드, 목록으로 돌아가기 기능 제공
 */

interface ShareInvoiceDetailContentProps {
  /** 견적서 데이터 */
  invoice: Invoice;
  /** 공유 토큰 */
  token: string;
}

// 상태 배지 색상 및 라벨 매핑
const statusConfig: Record<
  InvoiceStatus,
  { color: string; label: string }
> = {
  draft: {
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
    label: '작성 중',
  },
  sent: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    label: '발송됨',
  },
  accepted: {
    color:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    label: '승인됨',
  },
  rejected: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    label: '거절됨',
  },
};

/**
 * 공개 견적서 상세 페이지 렌더링
 * 클라이언트가 승인/거절 응답 가능
 * F010 기능 구현
 */
export function ShareInvoiceDetailContent({
  invoice,
  token,
}: ShareInvoiceDetailContentProps) {
  const router = useRouter();
  // 승인 버튼 로딩 상태
  const [isApproving, setIsApproving] = useState(false);
  // 거절 버튼 로딩 상태
  const [isRejecting, setIsRejecting] = useState(false);

  /**
   * Mock 데이터에서 발급자 정보 조회
   * TODO: 백엔드 API 연동 - GET /api/users/:id
   */
  const admin = mockUsers.find((user) => user.id === invoice.createdBy);

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
    return format(date, 'yyyy-MM-dd HH:mm', { locale: ko });
  };

  const formatRelativeDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  };

  // 승인 핸들러
  const handleApprove = async () => {
    try {
      setIsApproving(true);
      // TODO: 백엔드 API 연동 - 승인 상태 저장
      // const response = await fetch(`/api/invoices/${invoice.id}/approve`, {
      //   method: 'POST',
      // });

      toast.success('감사합니다. 곧 연락드리겠습니다');
      setIsApproving(false);
    } catch (error) {
      toast.error('승인 처리 중 오류가 발생했습니다');
      setIsApproving(false);
    }
  };

  // 거절 핸들러
  const handleReject = async () => {
    try {
      setIsRejecting(true);
      // TODO: 백엔드 API 연동 - 거절 상태 저장
      // const response = await fetch(`/api/invoices/${invoice.id}/reject`, {
      //   method: 'POST',
      // });

      toast.info('의견을 받았습니다');
      setIsRejecting(false);
    } catch (error) {
      toast.error('거절 처리 중 오류가 발생했습니다');
      setIsRejecting(false);
    }
  };

  // PDF 다운로드 핸들러
  const handleDownloadPDF = () => {
    // TODO: 백엔드 API 연동 - PDF 생성 및 다운로드
    const toastId = toast.loading('PDF 다운로드 준비 중...');
    setTimeout(() => {
      toast.dismiss(toastId);
      toast.success('다운로드가 시작되었습니다');
    }, 1500);
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    router.push(`/share/${token}`);
  };

  const status = statusConfig[invoice.status];

  return (
    <div className="space-y-6">
      {/* 상단 정보 섹션 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* 왼쪽: 제목 및 상태 */}
            <div className="flex-1 space-y-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {invoice.title}
              </h1>
              <div className="flex flex-col gap-2">
                <Badge
                  className={cn(
                    'w-fit h-fit px-3 py-1.5 text-sm font-medium',
                    status.color
                  )}
                >
                  {status.label}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  발급자: {admin?.name || '-'}
                </p>
                <p className="text-sm text-muted-foreground">
                  발급일: {formatRelativeDate(invoice.createdAt)}
                </p>
              </div>
            </div>

            {/* 오른쪽: 총액 정보 (선택) */}
            <div className="flex flex-col items-start sm:items-end gap-2">
              <p className="text-xs text-muted-foreground">총액</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {formatCurrency(invoice.totalAmount)}
              </p>
            </div>
          </div>
        </CardHeader>
        <Separator />
      </Card>

      {/* 상세 정보 섹션 */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 왼쪽: 발급 정보 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">발급 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">발급자</span>
                  <span className="font-medium">{admin?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">발급일</span>
                  <span className="font-medium">
                    {formatDate(invoice.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">발급자 이메일</span>
                  <span className="font-medium">{admin?.email || '-'}</span>
                </div>
              </div>
            </div>

            {/* 오른쪽: 클라이언트 정보 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">클라이언트 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">클라이언트명</span>
                  <span className="font-medium">{invoice.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이메일</span>
                  <span className="font-medium">
                    {invoice.clientEmail || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상태</span>
                  <span className="font-medium">{status.label}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 항목 목록 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>견적서 항목</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemsTable items={invoice.items} showActions={false} />
        </CardContent>
      </Card>

      {/* 메모 섹션 */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">발급자 메모</CardTitle>
        </CardHeader>
        <CardContent>
          {invoice.description ? (
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {invoice.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">메모가 없습니다</p>
          )}
        </CardContent>
      </Card>

      {/* 응답 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            이 견적서에 대한 의견을 알려주세요
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            선택하신 의견은 발급자에게 전달됩니다 (Phase 3에서 구현)
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* 승인 버튼 */}
            <Button
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <CheckCircle className="h-5 w-5" />
              <span>이 견적서를 수락합니다</span>
            </Button>

            {/* 거절 버튼 */}
            <Button
              onClick={handleReject}
              disabled={isApproving || isRejecting}
              variant="destructive"
              className="flex items-center gap-2"
              size="lg"
            >
              <XCircle className="h-5 w-5" />
              <span>이 견적서를 거절합니다</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 액션 버튼 섹션 */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        {/* 왼쪽: PDF 다운로드 */}
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          className="flex items-center gap-2"
          size="lg"
        >
          <Download className="h-5 w-5" />
          <span>PDF 다운로드</span>
        </Button>

        {/* 오른쪽: 목록으로 돌아가기 */}
        <Button
          onClick={handleBackToList}
          variant="outline"
          className="flex items-center gap-2"
          size="lg"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>목록으로</span>
        </Button>
      </div>
    </div>
  );
}
