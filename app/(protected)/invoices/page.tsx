'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { FileText, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/layout/container';
import { InvoiceTable } from '@/components/features/invoice-table';
import { EmptyState } from '@/components/features/empty-state';

/**
 * 견적서 목록 페이지 (관리자)
 * F002 기능 구현
 * 관리자가 발급한 모든 견적서를 조회할 수 있는 페이지
 */

export default function InvoicesPage() {
  // Zustand store에서 상태 및 액션 가져오기
  const { invoices, isLoading, error, fetchInvoices, deleteInvoice } = useInvoiceStore();

  // 페이지 로드 시 견적서 목록 조회
  useEffect(() => {
    fetchInvoices().catch(() => {
      // 에러는 store의 error 상태에서 처리됨
    });
  }, [fetchInvoices]);

  /**
   * 새로고침 핸들러
   */
  const handleRefresh = async () => {
    try {
      await fetchInvoices();
      toast.success('목록이 새로고쳐졌습니다');
    } catch {
      toast.error('새로고침 실패: 다시 시도해주세요');
    }
  };

  /**
   * 견적서 편집 페이지로 이동
   */
  const handleEdit = (id: string) => {
    window.location.href = `/invoices/${id}`;
  };

  /**
   * 견적서 삭제 핸들러
   */
  const handleDelete = async (id: string) => {
    try {
      await deleteInvoice(id);
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
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            견적서 목록
          </h1>
          <p className="text-sm text-muted-foreground">
            발급한 모든 견적서를 관리합니다
          </p>
        </div>

        {/* 우측 액션 버튼 */}
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            title="목록 새로고침"
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

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4 text-sm text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
          <p className="font-semibold mb-1">오류 발생</p>
          <p>{error}</p>
        </div>
      )}

      {/* 견적서 목록 섹션 */}
      <div className="space-y-4">
        {/* 견적서 목록 테이블 또는 빈 상태 또는 로딩 상태 */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">견적서를 불러오는 중...</p>
                </div>
              </div>
            ) : invoices.length > 0 ? (
              <InvoiceTable
                invoices={invoices}
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
