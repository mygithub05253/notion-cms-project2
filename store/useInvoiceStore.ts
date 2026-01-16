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
      // TODO: 백엔드 API 호출
      // const response = await fetch('/api/invoices');
      // const data = await response.json();
      // set({ invoices: data });

      set({ isLoading: false });
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
      // TODO: 백엔드 API 호출
      // const response = await fetch(`/api/invoices/${id}`);
      // const data = await response.json();
      // set({ selectedInvoice: data });

      set({ isLoading: false });
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

  // 견적서 추가
  addInvoice: (invoice: Invoice) => {
    set((state) => ({
      invoices: [...state.invoices, invoice],
    }));
  },

  // 견적서 수정
  updateInvoice: (id: string, updates: Partial<Invoice>) => {
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, ...updates } : invoice
      ),
      selectedInvoice:
        state.selectedInvoice?.id === id
          ? { ...state.selectedInvoice, ...updates }
          : state.selectedInvoice,
    }));
  },

  // 견적서 삭제
  deleteInvoice: (id: string) => {
    set((state) => ({
      invoices: state.invoices.filter((invoice) => invoice.id !== id),
      selectedInvoice:
        state.selectedInvoice?.id === id ? null : state.selectedInvoice,
    }));
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
