'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import {
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useFetchInvoices } from '@/hooks/useFetchInvoices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/layout/container';
import { StatsCard } from '@/components/features/stats-card';
import { InvoiceTable } from '@/components/features/invoice-table';
import { EmptyState } from '@/components/features/empty-state';

/**
 * 대시보드 페이지 (관리자)
 * F002, F004, F006 기능 구현
 * 관리자가 모든 견적서를 확인하고 생성/삭제할 수 있는 페이지
 * SWR을 사용한 API 캐싱 적용
 */

export default function DashboardPage() {
  // SWR을 사용한 API 캐싱
  const { invoices, isLoading, isError, error, mutate } = useFetchInvoices();

  // Zustand store에서 deleteInvoice 액션만 가져오기
  const { deleteInvoice } = useInvoiceStore();

  // 데이터 에러 처리
  useEffect(() => {
    if (isError && error) {
      toast.error('견적서 조회 실패: ' + (error instanceof Error ? error.message : '다시 시도해주세요'));
    }
  }, [isError, error]);

  // 통계 계산
  const totalInvoices = invoices.length;
  const draftCount = invoices.filter((inv) => inv.status === 'draft').length;
  const acceptedCount = invoices.filter((inv) => inv.status === 'accepted')
    .length;
  const rejectedCount = invoices.filter((inv) => inv.status === 'rejected')
    .length;

  // 최근 5개 견적서 (역순)
  const recentInvoices = invoices.slice(-5).reverse();

  /**
   * 대시보드 새로고침 핸들러
   * SWR의 mutate를 사용하여 데이터 재검증
   */
  const handleRefresh = async () => {
    try {
      await mutate();
      toast.success('대시보드가 새로고쳐졌습니다');
    } catch {
      toast.error('새로고침 실패: 다시 시도해주세요');
    }
  };

  /**
   * 견적서 편집 페이지로 이동
   * React Router를 사용하여 상세 페이지로 이동
   */
  const handleEdit = (id: string) => {
    window.location.href = `/invoices/${id}`;
  };

  /**
   * 견적서 삭제 핸들러
   * Zustand store의 deleteInvoice 액션 호출 후 SWR 데이터 재검증
   */
  const handleDelete = async (id: string) => {
    try {
      await deleteInvoice(id);
      await mutate(); // SWR 캐시 업데이트
      toast.success('견적서가 삭제되었습니다');
    } catch {
      toast.error('삭제 실패: 다시 시도해주세요');
    }
  };

  return (
    <Container className="flex flex-1 flex-col gap-8 py-8">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">대시보드</h1>
          <p className="text-sm text-muted-foreground">
            견적서 발급 현황을 한눈에 확인합니다
          </p>
        </div>

        {/* 우측 액션 버튼 */}
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            title="대시보드 새로고침"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
          <Button size="sm" asChild>
            <Link href="/invoices/new">
              <Plus className="h-4 w-4 mr-2" />
              새 견적서 생성
            </Link>
          </Button>
        </div>
      </div>

      {/* 통계 카드 섹션 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 카드 1: 총 견적서 수 */}
        <StatsCard
          icon={FileText}
          label="총 견적서"
          value={totalInvoices}
          iconColor="text-blue-600 opacity-70 dark:text-blue-400"
        />

        {/* 카드 2: 발송 대기 */}
        <StatsCard
          icon={Send}
          label="발송 대기"
          value={draftCount}
          iconColor="text-orange-600 opacity-70 dark:text-orange-400"
        />

        {/* 카드 3: 승인됨 */}
        <StatsCard
          icon={CheckCircle}
          label="승인됨"
          value={acceptedCount}
          iconColor="text-green-600 opacity-70 dark:text-green-400"
        />

        {/* 카드 4: 거절됨 */}
        <StatsCard
          icon={XCircle}
          label="거절됨"
          value={rejectedCount}
          iconColor="text-red-600 opacity-70 dark:text-red-400"
        />
      </div>

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4 text-sm text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
          <p className="font-semibold mb-1">오류 발생</p>
          <p>{error}</p>
        </div>
      )}

      {/* 최근 견적서 섹션 */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              최근 발급한 견적서
            </h2>
            <p className="text-sm text-muted-foreground">
              최근 5개의 견적서
            </p>
          </div>
        </div>

        {/* 견적서 목록 또는 빈 상태 또는 로딩 상태 */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">견적서를 불러오는 중...</p>
                </div>
              </div>
            ) : recentInvoices.length > 0 ? (
              <InvoiceTable
                invoices={recentInvoices}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <EmptyState
                icon={FileText}
                title="발급한 견적서가 없습니다"
                description="새 견적서를 생성해보세요"
                actionLabel="새 견적서 생성"
                onAction={() => {
                  window.location.href = '/invoices/new';
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
