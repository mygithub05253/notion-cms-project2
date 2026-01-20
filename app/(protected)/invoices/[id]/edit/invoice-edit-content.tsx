'use client';

import { useState, useEffect } from 'react';
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
  // 초기 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  // 삭제 확인 다이얼로그 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // 삭제 중 상태 (로딩 표시)
  const [isDeleting, setIsDeleting] = useState(false);
  // 업데이트 중 상태
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * React Hook Form 초기화
   * 빈 기본값으로 시작하고, API에서 데이터를 받으면 폼을 업데이트
   */
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      title: '',
      description: '',
      clientName: '',
      clientEmail: '',
      items: [
        {
          title: '',
          description: '',
          quantity: 1,
          unit: '개',
          unitPrice: 0,
          subtotal: 0,
        },
      ],
    },
  });

  /**
   * 견적서 데이터 로드
   * 컴포넌트 마운트 시 API에서 견적서 정보 조회
   */
  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setIsLoading(true);
        const { getInvoiceApi } = await import('@/lib/api-invoice');
        const invoice = await getInvoiceApi(id);

        // 폼에 데이터 채우기
        form.reset({
          title: invoice.title,
          description: invoice.description,
          clientName: invoice.clientName,
          clientEmail: invoice.clientEmail,
          items: invoice.items,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '견적서를 불러올 수 없습니다';
        toast.error(errorMessage);
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoice();
  }, [id, form, router]);

  /**
   * 견적서 업데이트 핸들러
   * updateInvoiceApi를 호출하여 서버에 변경사항 저장
   */
  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setIsUpdating(true);
      const { updateInvoiceApi } = await import('@/lib/api-invoice');
      const { useInvoiceStore } = await import('@/store/useInvoiceStore');

      // API 호출로 견적서 업데이트
      const updatedInvoice = await updateInvoiceApi(id, data);

      // Zustand store에 업데이트된 견적서 저장
      const store = useInvoiceStore();
      store.updateInvoice(id, updatedInvoice);

      // 업데이트 성공 토스트
      toast.success('견적서가 업데이트되었습니다');
      // 500ms 후 견적서 목록으로 이동
      setTimeout(() => router.push('/invoices'), 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '견적서 업데이트 중 오류가 발생했습니다';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
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
   * deleteInvoiceApi를 호출하여 견적서 삭제
   */
  const onDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const { deleteInvoiceApi } = await import('@/lib/api-invoice');
      const { useInvoiceStore } = await import('@/store/useInvoiceStore');

      // API 호출로 견적서 삭제
      await deleteInvoiceApi(id);

      // Zustand store에서 견적서 제거
      const store = useInvoiceStore();
      store.deleteInvoice(id);

      // 삭제 성공 토스트
      toast.success('견적서가 삭제되었습니다');
      setDeleteConfirmOpen(false);
      // 500ms 후 견적서 목록으로 이동
      setTimeout(() => router.push('/invoices'), 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '견적서 삭제 중 오류가 발생했습니다';
      toast.error(errorMessage);
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
