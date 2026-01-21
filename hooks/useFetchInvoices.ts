'use client';

import useSWR from 'swr';
import { Invoice } from '@/types/index';
import { useInvoiceStore } from '@/store/useInvoiceStore';

/**
 * SWR을 사용한 견적서 목록 조회 훅
 * 자동 캐싱, 재검증, 재시도 기능 제공
 * Zustand store와 함께 사용
 */
export function useFetchInvoices() {
  const { invoices, fetchInvoices, isLoading, error } = useInvoiceStore();

  const { data, error: swrError, isLoading: swrIsLoading, mutate } = useSWR<Invoice[]>(
    '/api/invoices',
    async () => {
      try {
        await fetchInvoices();
        return invoices;
      } catch (err) {
        throw err;
      }
    },
    {
      // 캐싱 설정
      revalidateOnFocus: true, // 포커스 시 재검증
      revalidateOnReconnect: true, // 재연결 시 재검증
      focusThrottleInterval: 5000, // 5초 이내 중복 요청 방지
      dedupingInterval: 2000, // 2초 내 중복 요청 병합

      // 재시도 설정
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,

      // 성능 설정
      keepPreviousData: true, // 새 데이터 로드 중 이전 데이터 유지
    }
  );

  return {
    invoices: invoices || [],
    isLoading: swrIsLoading || isLoading,
    isError: !!swrError || !!error,
    error: swrError || error,
    mutate, // 수동 재검증을 위한 함수
  };
}

/**
 * 특정 견적서 조회 훅
 */
export function useFetchInvoice(invoiceId: string | null) {
  const { invoices, fetchInvoices, isLoading, error } = useInvoiceStore();

  const { data, error: swrError, isLoading: swrIsLoading, mutate } = useSWR<Invoice | null>(
    invoiceId ? `/api/invoices/${invoiceId}` : null,
    async () => {
      try {
        if (!invoiceId) return null;
        await fetchInvoices();
        const invoice = invoices.find(inv => inv.id === invoiceId);
        if (!invoice) {
          throw new Error('견적서를 찾을 수 없습니다');
        }
        return invoice;
      } catch (err) {
        throw err;
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      focusThrottleInterval: 5000,
      dedupingInterval: 2000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      keepPreviousData: true,
    }
  );

  return {
    invoice: data || null,
    isLoading: swrIsLoading || isLoading,
    isError: !!swrError || !!error,
    error: swrError || error,
    mutate,
  };
}

/**
 * 공유 견적서 목록 조회 훅
 */
export function useFetchSharedInvoices(token: string | null) {
  const { invoices, fetchInvoices, isLoading, error } = useInvoiceStore();

  const { data, error: swrError, isLoading: swrIsLoading, mutate } = useSWR<Invoice[]>(
    token ? `/api/share/${token}` : null,
    async () => {
      try {
        if (!token) return [];
        await fetchInvoices();
        return invoices;
      } catch (err) {
        throw err;
      }
    },
    {
      revalidateOnFocus: false, // 공유 링크는 자주 변하지 않으므로 비활성화
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
      shouldRetryOnError: true,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      keepPreviousData: true,
    }
  );

  return {
    invoices: invoices || [],
    isLoading: swrIsLoading || isLoading,
    isError: !!swrError || !!error,
    error: swrError || error,
    mutate,
  };
}
