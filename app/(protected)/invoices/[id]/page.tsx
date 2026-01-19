'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { InvoiceForm, invoiceSchema, type InvoiceFormData } from '@/components/features/invoice-form';
import { ConfirmDialog } from '@/components/features/confirm-dialog';

/**
 * 견적서 상세 및 편집 페이지 (관리자 모드)
 * F003, F005, F006, F007 기능 구현
 * 발급된 견적서를 조회하고 수정, 삭제, 공유할 수 있습니다
 */

// Mock 데이터 (실제로는 API에서 조회)
const mockInvoice: InvoiceFormData = {
  title: '2025년 1월 A 프로젝트 견적서',
  description: '웹사이트 개발 프로젝트 견적서입니다',
  clientName: '홍길동',
  clientEmail: 'client@example.com',
  items: [
    {
      title: '웹사이트 개발',
      description: '반응형 웹사이트 개발 (5페이지)',
      quantity: 1,
      unit: '식',
      unitPrice: 5000000,
      subtotal: 5000000,
    },
    {
      title: '호스팅 설정',
      description: '클라우드 호스팅 설정 및 배포',
      quantity: 1,
      unit: '식',
      unitPrice: 500000,
      subtotal: 500000,
    },
  ],
};

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: mockInvoice,
  });

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      // TODO: 백엔드 API 연동
      // const response = await fetch(`/api/invoices/${params.id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify(data),
      // });
      // const result = await response.json();

      toast.success('견적서가 업데이트되었습니다');
      setTimeout(() => router.push('/invoices'), 500);
    } catch (error) {
      toast.error('견적서 업데이트 중 오류가 발생했습니다');
    }
  };

  const onCancel = () => {
    router.back();
  };

  const onDeleteConfirm = async () => {
    try {
      setIsDeleting(true);

      // TODO: 백엔드 API 연동
      // const response = await fetch(`/api/invoices/${params.id}`, {
      //   method: 'DELETE',
      // });
      // const result = await response.json();

      toast.success('견적서가 삭제되었습니다');
      setDeleteConfirmOpen(false);
      setTimeout(() => router.push('/invoices'), 500);
    } catch (error) {
      toast.error('견적서 삭제 중 오류가 발생했습니다');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <InvoiceForm
        title={`견적서 수정 - ${form.getValues('title')}`}
        subtitle="견적서 정보를 수정합니다"
        form={form}
        onSubmit={onSubmit}
        onCancel={onCancel}
        showDeleteButton={true}
        onDelete={() => setDeleteConfirmOpen(true)}
        submitText="저장"
        isDeleting={isDeleting}
      />

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="견적서 삭제"
        description="정말로 이 견적서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        isDangerous={true}
        onConfirm={onDeleteConfirm}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </>
  );
}
