'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { InvoiceForm, invoiceSchema, type InvoiceFormData } from '@/components/features/invoice-form';

/**
 * 견적서 생성 페이지
 * F004, F010 기능 구현
 * InvoiceForm 컴포넌트를 활용한 동적 항목 관리
 * 관리자가 새로운 견적서를 작성하고 저장할 수 있음
 */

export default function NewInvoicePage() {
  const router = useRouter();

  /**
   * React Hook Form 초기화
   * - 견적서 기본 정보: 제목, 설명, 클라이언트 정보
   * - 동적 항목 배열: 최소 1개 항목 필수
   * - Zod resolver로 전체 폼 유효성 검사
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
   * 견적서 저장 핸들러
   * TODO: 백엔드 API 연동
   * - POST /api/invoices 호출
   * - 성공 시: 성공 토스트 + 폼 초기화 + 견적서 목록으로 이동
   * - 실패 시: 에러 토스트 표시
   */
  const onSubmit = async (data: InvoiceFormData) => {
    try {
      // TODO: 백엔드 API 연동
      // const response = await fetch('/api/invoices', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
      // const result = await response.json();

      // 저장 성공 토스트 (success 타입)
      toast.success('견적서가 저장되었습니다');
      form.reset();
      // 500ms 후 견적서 목록 페이지로 이동
      setTimeout(() => router.push('/invoices'), 500);
    } catch (error) {
      // 저장 실패 토스트 (error 타입)
      toast.error('견적서 저장 중 오류가 발생했습니다');
    }
  };

  /**
   * 취소 핸들러
   * 이전 페이지로 돌아가기
   */
  const onCancel = () => {
    router.back();
  };

  return (
    <InvoiceForm
      title="새 견적서 생성"
      subtitle="견적서 기본 정보를 입력합니다"
      form={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitText="저장"
    />
  );
}
