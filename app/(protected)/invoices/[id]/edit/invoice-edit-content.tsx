'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { InvoiceForm, invoiceSchema, type InvoiceFormData } from '@/components/features/invoice-form';
import { ConfirmDialog } from '@/components/features/confirm-dialog';

/**
 * 견적서 편집 콘텐츠 컴포넌트 (관리자 모드)
 * F007 기능 구현 - 발급된 견적서를 수정하고 삭제할 수 있음
 * InvoiceForm 컴포넌트를 활용하여 견적서 수정 폼과 삭제 확인 다이얼로그 제공
 */

/**
 * Mock 데이터 (실제로는 API에서 조회)
 * TODO: 백엔드 API 연동 - GET /api/invoices/:id
 */
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

/** 견적서 편집 콘텐츠 컴포넌트 Props */
interface InvoiceEditContentProps {
  /** 편집할 견적서 ID */
  id: string;
}

/**
 * 견적서 편집 콘텐츠 컴포넌트
 * - 견적서 정보 수정
 * - 삭제 확인 다이얼로그
 * - 저장/취소/삭제 버튼
 */
export function InvoiceEditContent({ id }: InvoiceEditContentProps) {
  const router = useRouter();
  // 삭제 확인 다이얼로그 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // 삭제 중 상태 (로딩 표시)
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * React Hook Form 초기화
   * Mock 데이터로 폼 필드 채우기
   * TODO: 실제로는 API에서 조회한 데이터로 초기화
   */
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: mockInvoice,
  });

  /**
   * 견적서 업데이트 핸들러
   * TODO: 백엔드 API 연동
   * - PATCH /api/invoices/:id 호출
   * - 성공 시: 성공 토스트 + 견적서 목록으로 이동
   * - 실패 시: 에러 토스트 표시
   */
  const onSubmit = async (data: InvoiceFormData) => {
    try {
      // TODO: 백엔드 API 연동
      // const response = await fetch(`/api/invoices/${id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify(data),
      // });
      // const result = await response.json();

      // 업데이트 성공 토스트 (success 타입)
      toast.success('견적서가 업데이트되었습니다');
      // 500ms 후 견적서 목록으로 이동
      setTimeout(() => router.push('/invoices'), 500);
    } catch (error) {
      // 업데이트 실패 토스트 (error 타입)
      toast.error('견적서 업데이트 중 오류가 발생했습니다');
    }
  };

  /**
   * 취소 핸들러
   * 이전 페이지로 돌아가기
   */
  const onCancel = () => {
    router.back();
  };

  /**
   * 삭제 확인 핸들러
   * TODO: 백엔드 API 연동
   * - DELETE /api/invoices/:id 호출
   * - 성공 시: 성공 토스트 + 견적서 목록으로 이동
   * - 실패 시: 에러 토스트 표시
   */
  const onDeleteConfirm = async () => {
    try {
      setIsDeleting(true);

      // TODO: 백엔드 API 연동
      // const response = await fetch(`/api/invoices/${id}`, {
      //   method: 'DELETE',
      // });
      // const result = await response.json();

      // 삭제 성공 토스트 (success 타입)
      toast.success('견적서가 삭제되었습니다');
      setDeleteConfirmOpen(false);
      // 500ms 후 견적서 목록으로 이동
      setTimeout(() => router.push('/invoices'), 500);
    } catch (error) {
      // 삭제 실패 토스트 (error 타입)
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
