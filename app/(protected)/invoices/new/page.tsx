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
 */

export default function NewInvoicePage() {
  const router = useRouter();

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

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      // TODO: 백엔드 API 연동
      // const response = await fetch('/api/invoices', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
      // const result = await response.json();

      toast.success('견적서가 저장되었습니다');
      form.reset();
      setTimeout(() => router.push('/invoices'), 500);
    } catch (error) {
      toast.error('견적서 저장 중 오류가 발생했습니다');
    }
  };

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
