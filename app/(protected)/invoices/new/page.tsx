'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { InvoiceForm, invoiceSchema, type InvoiceFormData } from '@/components/features/invoice-form';
import { useFetchInvoices } from '@/hooks/useFetchInvoices';

/**
 * 견적서 생성 페이지
 * F004, F010 기능 구현
 * InvoiceForm 컴포넌트를 활용한 동적 항목 관리
 * 관리자가 새로운 견적서를 작성하고 저장할 수 있음
 * SWR을 사용한 API 캐싱 적용
 */

export default function NewInvoicePage() {
  const router = useRouter();
  const { mutate } = useFetchInvoices(); // SWR 캐시 업데이트용

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
   * - 폼 데이터를 검증하여 API로 전송
   * - 성공 시: 성공 토스트 + Zustand store 업데이트 + 상세 페이지로 이동
   * - 실패 시: 에러 토스트 표시
   */
  const onSubmit = async (data: InvoiceFormData) => {
    try {
      // 동적 임포트로 순환 의존성 방지
      const { createInvoiceApi } = await import('@/lib/api-invoice');
      const { useInvoiceStore } = await import('@/store/useInvoiceStore');
      const store = useInvoiceStore();

      // 백엔드 API 호출
      const createdInvoice = await createInvoiceApi(data);

      // Zustand store에 새 견적서 추가
      store.addInvoice(createdInvoice);

      // SWR 캐시 업데이트
      await mutate();

      // 저장 성공 토스트
      toast.success('견적서가 생성되었습니다');

      // 생성된 견적서 상세 페이지로 이동
      setTimeout(() => router.push(`/invoices/${createdInvoice.id}`), 300);
    } catch (error) {
      // 에러 메시지 추출
      const errorMessage =
        error instanceof Error ? error.message : '견적서 생성 실패';

      // 저장 실패 토스트
      toast.error(`견적서 생성 중 오류: ${errorMessage}`);
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
