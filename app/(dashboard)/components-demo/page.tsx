'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/features/empty-state';
import { ItemsTable } from '@/components/features/items-table';
import { InvoiceCard } from '@/components/features/invoice-card';
import { InvoiceTable } from '@/components/features/invoice-table';
import { ConfirmDialog } from '@/components/features/confirm-dialog';
import { mockInvoices } from '@/lib/mock-data';
import { FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * 컴포넌트 데모 페이지
 * Task 004에서 구현한 5가지 UI 컴포넌트를 시연
 */

export default function ComponentsDemo() {
  // 상태 관리
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(mockInvoices[0]);

  // 첫 번째 견적서 사용
  const firstInvoice = mockInvoices[0];
  const rejectedInvoice = mockInvoices[4];

  // 핸들러
  const handleEdit = (id: string) => {
    toast.success(`수정: ${id}`);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDialog(true);
    toast.info(`삭제 준비: ${id}`);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDialog(false);
    toast.success('삭제 완료');
  };

  const handleCardClick = () => {
    toast.info(`카드 클릭: ${firstInvoice.title}`);
  };

  return (
    <div className="space-y-8">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-3xl font-bold">UI 컴포넌트 라이브러리</h1>
        <p className="text-muted-foreground mt-2">
          Task 004에서 구현한 공통 UI 컴포넌트 데모
        </p>
      </div>

      {/* 1. EmptyState 컴포넌트 */}
      <Card>
        <CardHeader>
          <CardTitle>1. EmptyState 컴포넌트</CardTitle>
          <CardDescription>
            데이터가 없을 때 표시할 상태 화면 (아이콘, 제목, 설명, 선택적 액션 버튼)
          </CardDescription>
        </CardHeader>
        <CardContent className="border-t pt-6">
          <EmptyState
            icon={FileText}
            title="견적서가 없습니다"
            description="아직 작성한 견적서가 없습니다. 새로운 견적서를 작성해보세요."
            actionLabel="견적서 작성"
            onAction={() => toast.success('새 견적서 작성 시작')}
          />
        </CardContent>
      </Card>

      {/* 2. ItemsTable 컴포넌트 */}
      <Card>
        <CardHeader>
          <CardTitle>2. ItemsTable 컴포넌트</CardTitle>
          <CardDescription>
            견적서 항목을 테이블로 표시 (제목, 설명, 수량, 단위, 단가, 소계, 총액)
          </CardDescription>
        </CardHeader>
        <CardContent className="border-t pt-6">
          <div className="space-y-4">
            {/* 뷰 모드 */}
            <div>
              <h4 className="text-sm font-semibold mb-3">뷰 모드 (액션 버튼 없음)</h4>
              <ItemsTable items={firstInvoice.items} showActions={false} />
            </div>

            {/* 편집 모드 */}
            <div>
              <h4 className="text-sm font-semibold mb-3">편집 모드 (액션 버튼 표시)</h4>
              <ItemsTable
                items={firstInvoice.items}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. InvoiceCard 컴포넌트 */}
      <Card>
        <CardHeader>
          <CardTitle>3. InvoiceCard 컴포넌트</CardTitle>
          <CardDescription>
            견적서를 카드 형식으로 표시 (상태 배지, 금액, 작성일자, 항목 개수)
          </CardDescription>
        </CardHeader>
        <CardContent className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockInvoices.slice(0, 3).map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. InvoiceTable 컴포넌트 */}
      <Card>
        <CardHeader>
          <CardTitle>4. InvoiceTable 컴포넌트</CardTitle>
          <CardDescription>
            견적서 목록을 테이블로 표시 (ID, 제목, 클라이언트, 상태, 금액, 작성일자, 액션)
          </CardDescription>
        </CardHeader>
        <CardContent className="border-t pt-6">
          <InvoiceTable
            invoices={mockInvoices}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* 5. ConfirmDialog 컴포넌트 */}
      <Card>
        <CardHeader>
          <CardTitle>5. ConfirmDialog 컴포넌트</CardTitle>
          <CardDescription>
            shadcn/ui AlertDialog 기반 확인 다이얼로그 (제목, 설명, 확인/취소 버튼)
          </CardDescription>
        </CardHeader>
        <CardContent className="border-t pt-6">
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(true)}
            >
              확인 다이얼로그 열기
            </Button>
            <p className="text-sm text-muted-foreground">
              위 버튼을 클릭하면 삭제 확인 다이얼로그가 표시됩니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 상태별 배지 데모 */}
      <Card>
        <CardHeader>
          <CardTitle>상태별 InvoiceCard 예시</CardTitle>
          <CardDescription>
            모든 상태의 견적서를 카드로 표시
          </CardDescription>
        </CardHeader>
        <CardContent className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ConfirmDialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        title="견적서를 삭제하시겠습니까?"
        description="이 작업은 되돌릴 수 없습니다. 해당 견적서와 모든 항목이 영구 삭제됩니다."
        confirmText="삭제"
        cancelText="취소"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </div>
  );
}
