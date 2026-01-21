'use client';

import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useFetchInvoices, useFetchInvoice, useFetchSharedInvoices } from './useFetchInvoices';
import type { Invoice, InvoiceItem } from '@/types';

/**
 * 견적서 관련 기능을 제공하는 커스텀 훅
 * useInvoiceStore와 useFetchInvoices를 래핑하여 편리한 API 제공
 *
 * @returns 견적서 상태 및 액션
 *
 * @example
 * const { invoices, fetchInvoices, addInvoice } = useInvoice();
 *
 * // 견적서 목록 조회
 * useEffect(() => {
 *   fetchInvoices();
 * }, []);
 *
 * // 새 견적서 추가
 * await addInvoice({
 *   title: '새 견적서',
 *   clientName: '고객명',
 *   items: []
 * });
 */
export function useInvoice() {
  const store = useInvoiceStore();
  const fetchHook = useFetchInvoices();

  return {
    // 상태
    invoices: fetchHook.invoices,
    selectedInvoice: store.selectedInvoice,
    isLoading: fetchHook.isLoading,
    isError: fetchHook.isError,
    error: fetchHook.error,

    // 액션 - fetch
    fetchInvoices: async () => {
      await store.fetchInvoices();
      await fetchHook.mutate();
    },

    // 액션 - store
    setSelectedInvoice: store.setSelectedInvoice,
    addInvoice: store.addInvoice,
    updateInvoice: store.updateInvoice,
    deleteInvoice: store.deleteInvoice,

    // 액션 - SWR
    mutate: fetchHook.mutate,
  };
}

/**
 * 특정 견적서 조회 훅
 *
 * @param invoiceId - 견적서 ID
 * @returns 견적서 데이터 및 로딩 상태
 *
 * @example
 * const { invoice, isLoading } = useInvoiceDetail('invoice-123');
 */
export function useInvoiceDetail(invoiceId: string | null) {
  const { invoice, isLoading, isError, error, mutate } = useFetchInvoice(invoiceId);

  return {
    invoice,
    isLoading,
    isError,
    error,
    mutate,
  };
}

/**
 * 공유된 견적서 목록 조회 훅 (클라이언트용)
 *
 * @param token - 공유 토큰
 * @returns 공유 견적서 목록 및 로딩 상태
 *
 * @example
 * const { invoices, isLoading } = useSharedInvoices(shareToken);
 */
export function useSharedInvoices(token: string | null) {
  const { invoices, isLoading, isError, error, mutate } = useFetchSharedInvoices(token);

  return {
    invoices,
    isLoading,
    isError,
    error,
    mutate,
  };
}
