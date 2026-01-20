'use client';

import { create } from 'zustand';
import type { Invoice } from '@/types';

/**
 * 견적서 상태 관리 스토어 (Zustand)
 * 견적서 목록, 선택된 견적서, CRUD 기능을 관리합니다
 */
interface InvoiceStore {
  // 상태
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  fetchInvoices: () => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<void>;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  // 초기 상태
  invoices: [],
  selectedInvoice: null,
  isLoading: false,
  error: null,

  // 견적서 목록 조회
  fetchInvoices: async () => {
    set({ isLoading: true, error: null });
    try {
      // 동적 임포트로 순환 의존성 방지
      const { getInvoicesApi } = await import('@/lib/api-invoices');

      // 백엔드 API 호출
      const invoices = await getInvoicesApi();
      set({ invoices, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '견적서 조회 실패';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // 특정 견적서 조회
  fetchInvoiceById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // 동적 임포트로 순환 의존성 방지
      const { getInvoiceApi } = await import('@/lib/api-invoices');

      // 백엔드 API 호출
      const invoice = await getInvoiceApi(id);
      set({ selectedInvoice: invoice, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '견적서 조회 실패';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // 선택된 견적서 설정
  setSelectedInvoice: (invoice: Invoice | null) => {
    set({ selectedInvoice: invoice });
  },

  // 견적서 추가 (로컬 상태만 업데이트, 실제 저장은 페이지에서 처리)
  addInvoice: (invoice: Invoice) => {
    set((state) => ({
      invoices: [...state.invoices, invoice],
      selectedInvoice: invoice,
    }));
  },

  // 견적서 수정
  updateInvoice: async (id: string, updates: Partial<Invoice>) => {
    set({ isLoading: true, error: null });
    try {
      // 동적 임포트로 순환 의존성 방지
      const { updateInvoiceApi } = await import('@/lib/api-invoices');

      // 백엔드 API 호출
      const updatedInvoice = await updateInvoiceApi(id, updates as any);

      // 상태 업데이트
      set((state) => ({
        invoices: state.invoices.map((invoice) =>
          invoice.id === id ? updatedInvoice : invoice
        ),
        selectedInvoice:
          state.selectedInvoice?.id === id ? updatedInvoice : state.selectedInvoice,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '견적서 수정 실패';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // 견적서 삭제
  deleteInvoice: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // 동적 임포트로 순환 의존성 방지
      const { deleteInvoiceApi } = await import('@/lib/api-invoices');

      // 백엔드 API 호출
      await deleteInvoiceApi(id);

      // 상태 업데이트
      set((state) => ({
        invoices: state.invoices.filter((invoice) => invoice.id !== id),
        selectedInvoice:
          state.selectedInvoice?.id === id ? null : state.selectedInvoice,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '견적서 삭제 실패';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // 에러 메시지 설정
  setError: (error: string | null) => {
    set({ error });
  },

  // 에러 메시지 초기화
  clearError: () => {
    set({ error: null });
  },
}));
