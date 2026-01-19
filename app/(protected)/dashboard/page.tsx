'use client';

import Link from 'next/link';
import {
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockInvoices } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/features/stats-card';
import { InvoiceTable } from '@/components/features/invoice-table';
import { EmptyState } from '@/components/features/empty-state';

/**
 * 대시보드 페이지 (관리자)
 * F002, F004, F006 기능 구현
 * 관리자가 모든 견적서를 확인하고 생성/삭제할 수 있는 페이지
 */

export default function DashboardPage() {
  // 통계 계산
  const totalInvoices = mockInvoices.length;
  const draftCount = mockInvoices.filter((inv) => inv.status === 'draft')
    .length;
  const acceptedCount = mockInvoices.filter((inv) => inv.status === 'accepted')
    .length;
  const rejectedCount = mockInvoices.filter((inv) => inv.status === 'rejected')
    .length;

  // 최근 5개 견적서 (역순)
  const recentInvoices = mockInvoices.slice(-5).reverse();

  /**
   * 대시보드 새로고침 핸들러
   * TODO: 백엔드 API 연동 - 견적서 목록 갱신
   */
  const handleRefresh = () => {
    toast.success('대시보드가 새로고쳐졌습니다');
  };

  /**
   * 견적서 편집 페이지로 이동
   * TODO: 백엔드 API 연동 - 견적서 데이터 조회 후 편집 페이지로 이동
   */
  const handleEdit = (id: string) => {
    console.log(`견적서 ID: ${id.slice(0, 8)}을 편집합니다.`);
  };

  /**
   * 견적서 삭제 핸들러
   * TODO: 백엔드 API 연동 - 견적서 삭제
   */
  const handleDelete = (id: string) => {
    console.log(`견적서 ID: ${id.slice(0, 8)}을 삭제했습니다.`);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">대시보드</h1>
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

        {/* 견적서 목록 또는 빈 상태 */}
        <Card>
          <CardContent className="pt-6">
            {recentInvoices.length > 0 ? (
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
                  // TODO: 새 견적서 생성 페이지로 이동
                  window.location.href = '/invoices/new';
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
