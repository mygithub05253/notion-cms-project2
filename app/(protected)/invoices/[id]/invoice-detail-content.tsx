'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner';
import { Copy, Share2, Pencil, Trash2, ArrowLeft } from 'lucide-react';

import { useInvoiceStore } from '@/store/useInvoiceStore';
import { mockUsers } from '@/lib/mock-data';
import { InvoiceStatus } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ItemsTable } from '@/components/features/items-table';
import { ConfirmDialog } from '@/components/features/confirm-dialog';
import { cn } from '@/lib/utils';

// 상태 배지 색상 및 라벨 매핑
const statusConfig: Record<
  InvoiceStatus,
  { color: string; label: string; description: string }
> = {
  draft: {
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
    label: '작성 중',
    description: '아직 발송되지 않은 상태입니다',
  },
  sent: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    label: '발송됨',
    description: '클라이언트에게 발송되었습니다',
  },
  accepted: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    label: '승인됨',
    description: '클라이언트가 승인했습니다',
  },
  rejected: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    label: '거절됨',
    description: '클라이언트가 거절했습니다',
  },
};

/** 공유 모달 상태 인터페이스 */
interface ShareModalState {
  /** 모달 열림/닫힘 상태 */
  open: boolean;
  /** 공유 토큰 (고유한 링크 생성용) */
  token: string;
  /** 만료 기한 표시 텍스트 */
  expiresAt: string;
}

/** 견적서 상세 콘텐츠 컴포넌트 Props */
interface InvoiceDetailContentProps {
  /** 조회할 견적서 ID */
  id: string;
}

/**
 * 견적서 상세 콘텐츠 컴포넌트
 * 관리자 모드: 발급한 견적서의 정보 조회, 수정, 공유, 삭제 기능 제공
 * F002, F006, F008 기능 구현
 */
export function InvoiceDetailContent({ id }: InvoiceDetailContentProps) {
  const router = useRouter();
  const { selectedInvoice, isLoading, error, fetchInvoiceById, deleteInvoice } = useInvoiceStore();

  // 삭제 확인 다이얼로그 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // 공유 설정 모달 상태 (열림/닫힘, 토큰, 만료 기한)
  const [shareModalOpen, setShareModalOpen] = useState<ShareModalState>({
    open: false,
    token: `share-${Math.random().toString(36).substring(2, 11)}`,
    expiresAt: '무제한',
  });
  // 만료 기한 설정 (7, 14, 30, never)
  const [expirationDays, setExpirationDays] = useState('never');
  // 삭제 중 상태 (로딩 표시)
  const [isDeleting, setIsDeleting] = useState(false);

  // 페이지 로드 시 견적서 상세 조회
  useEffect(() => {
    fetchInvoiceById(id).catch(() => {
      // 에러는 store의 error 상태에서 처리됨
    });
  }, [id, fetchInvoiceById]);

  const invoice = selectedInvoice;
  const admin = mockUsers.find((user) => user.id === invoice?.createdBy);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">견적서를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 또는 데이터 없을 때
  if (!invoice || error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {error ? error : '견적서를 찾을 수 없습니다.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  // 공유 링크 복사
  const handleCopyShareLink = async () => {
    const shareUrl = `https://example.com/share/${shareModalOpen.token}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('링크가 복사되었습니다');
    } catch (error) {
      toast.error('링크 복사에 실패했습니다');
    }
  };

  // 공유 설정 완료
  const handleShareComplete = () => {
    toast.success('공유 설정이 완료되었습니다');
    setShareModalOpen({ ...shareModalOpen, open: false });
  };

  // 견적서 수정 페이지로 이동
  const handleEdit = () => {
    router.push(`/invoices/${id}/edit`);
  };

  // 견적서 삭제
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteInvoice(id);
      toast.success('견적서가 삭제되었습니다');
      setDeleteConfirmOpen(false);
      setTimeout(() => router.push('/invoices'), 500);
    } catch (error) {
      toast.error('견적서 삭제 중 오류가 발생했습니다');
    } finally {
      setIsDeleting(false);
    }
  };

  // 뒤로가기
  const handleBack = () => {
    router.back();
  };

  const status = statusConfig[invoice.status];

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>뒤로가기</span>
        </Button>
      </div>

      {/* 상단 정보 섹션 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* 왼쪽: 제목 및 클라이언트 정보 */}
            <div className="flex-1 space-y-2">
              <CardTitle className="text-3xl font-bold">{invoice.title}</CardTitle>
              <p className="text-lg text-muted-foreground">{invoice.clientName}</p>
              <p className="text-sm text-muted-foreground">
                생성일: {formatRelativeDate(invoice.createdAt)}
              </p>
            </div>

            {/* 오른쪽: 상태 배지 */}
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <Badge className={cn('h-fit px-3 py-1 text-sm', status.color)}>
                {status.label}
              </Badge>
              <p className="text-xs text-muted-foreground">{status.description}</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
      </Card>

      {/* 상세 정보 섹션 */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 왼쪽: 클라이언트 정보 */}
            <div className="space-y-4">
              <h3 className="font-semibold">클라이언트 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이름</span>
                  <span className="font-medium">{invoice.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이메일</span>
                  <span className="font-medium">{invoice.clientEmail || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">전화</span>
                  <span className="font-medium">-</span>
                </div>
              </div>
            </div>

            {/* 오른쪽: 발급 정보 */}
            <div className="space-y-4">
              <h3 className="font-semibold">발급 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">발급자</span>
                  <span className="font-medium">{admin?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">발급일</span>
                  <span className="font-medium">{formatDate(invoice.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">수정일</span>
                  <span className="font-medium">{formatDate(invoice.updatedAt)}</span>
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
      {invoice.description && (
        <Card>
          <CardHeader>
            <CardTitle>메모</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {invoice.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 메모가 없을 때 */}
      {!invoice.description && (
        <Card>
          <CardHeader>
            <CardTitle>메모</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">메모가 없습니다</p>
          </CardContent>
        </Card>
      )}

      {/* 액션 버튼 섹션 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        {/* 왼쪽: 삭제 버튼 */}
        <Button
          variant="destructive"
          onClick={() => setDeleteConfirmOpen(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>삭제</span>
        </Button>

        {/* 오른쪽: 주요 액션 버튼 */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>뒤로가기</span>
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setShareModalOpen({
                ...shareModalOpen,
                open: true,
                token: `share-${Math.random().toString(36).substring(2, 11)}`,
              })
            }
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            <span>공유</span>
          </Button>

          <Button
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            <span>수정</span>
          </Button>
        </div>
      </div>

      {/* 공유 링크 모달 */}
      <Dialog open={shareModalOpen.open} onOpenChange={(open) => {
        setShareModalOpen({ ...shareModalOpen, open });
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>견적서 공유</DialogTitle>
            <DialogDescription>
              이 공유 링크를 클라이언트와 공유하세요
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 공유 링크 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">공유 링크</label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`https://example.com/share/${shareModalOpen.token}`}
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyShareLink}
                  aria-label="링크 복사"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 만료 기한 설정 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">만료 기한</label>
              <Select value={expirationDays} onValueChange={(value) => {
                setExpirationDays(value);
                const expirationMap: Record<string, string> = {
                  '7': '7일 후 만료',
                  '14': '14일 후 만료',
                  '30': '30일 후 만료',
                  'never': '무제한',
                };
                setShareModalOpen({
                  ...shareModalOpen,
                  expiresAt: expirationMap[value],
                });
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">1주 (7일)</SelectItem>
                  <SelectItem value="14">2주 (14일)</SelectItem>
                  <SelectItem value="30">1개월 (30일)</SelectItem>
                  <SelectItem value="never">무제한</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 만료 시간 표시 */}
            {expirationDays !== 'never' && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="text-muted-foreground">{shareModalOpen.expiresAt}</p>
              </div>
            )}

            {/* 무제한 표시 */}
            {expirationDays === 'never' && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="text-muted-foreground">만료 기한 없이 항상 접근 가능합니다</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShareModalOpen({ ...shareModalOpen, open: false })}
            >
              닫기
            </Button>
            <Button onClick={handleShareComplete}>공유 설정 완료</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="견적서 삭제"
        description="정말로 이 견적서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
