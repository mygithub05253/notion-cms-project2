/**
 * API 응답 타입 정의
 *
 * 모든 API 엔드포인트에서 일관된 응답 포맷을 사용하기 위한 타입을 정의합니다.
 * TypeScript discriminated union을 사용하여 타입 안전성을 확보합니다.
 */

import { Invoice, InvoiceItem } from './index';

/**
 * API 성공 응답 타입
 *
 * @template T - 응답 데이터 타입
 *
 * @example
 * const response: ApiSuccessResponse<Invoice> = {
 *   success: true,
 *   data: { id: '...', title: '...' },
 *   message: '성공했습니다.'
 * }
 */
export interface ApiSuccessResponse<T> {
  /** 성공 여부 */
  success: true;
  /** 응답 데이터 */
  data: T;
  /** 선택적 메시지 */
  message?: string;
}

/**
 * API 에러 응답 타입
 *
 * @example
 * const response: ApiErrorResponse = {
 *   success: false,
 *   error: 'Invalid request'
 * }
 */
export interface ApiErrorResponse {
  /** 성공 여부 */
  success: false;
  /** 에러 메시지 */
  error: string;
  /** 추가 디버깅 정보 (선택적) */
  details?: unknown;
}

/**
 * API 응답 통합 타입
 *
 * TypeScript discriminated union으로 success 필드로 타입 추론 가능
 *
 * @template T - 성공 응답의 데이터 타입
 *
 * @example
 * // 타입 가드를 사용한 안전한 처리
 * const response = await fetch('/api/invoices');
 * const data: ApiResponse<Invoice[]> = await response.json();
 *
 * if (data.success) {
 *   // data.data는 Invoice[] 타입으로 추론됨
 *   console.log(data.data);
 * } else {
 *   // data.error는 string 타입으로 추론됨
 *   console.error(data.error);
 * }
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * 견적서 목록 조회 응답
 *
 * GET /api/notion/invoices
 */
export type GetInvoicesResponse = ApiResponse<{
  invoices: Invoice[];
  total: number;
}>;

/**
 * 견적서 상세 조회 응답
 *
 * GET /api/notion/invoices/[id]
 */
export type GetInvoiceResponse = ApiResponse<{
  invoice: Invoice;
}>;

/**
 * 견적서 생성/수정 요청 바디
 *
 * POST /api/notion/invoices (생성)
 * PATCH /api/notion/invoices/[id] (수정) - 구현 추후
 */
export interface InvoiceFormData {
  /** 견적서 제목 */
  title: string;
  /** 견적서 설명 (선택적) */
  description?: string;
  /** 클라이언트 이름 */
  clientName: string;
  /** 클라이언트 이메일 (선택적) */
  clientEmail?: string;
  /** 견적서 항목 배열 */
  items: Omit<InvoiceItem, 'id' | 'invoiceId'>[];
}

/**
 * 견적서 생성 응답
 *
 * POST /api/notion/invoices - 구현 추후
 */
export type CreateInvoiceResponse = ApiResponse<{
  invoice: Invoice;
}>;

/**
 * 견적서 수정 응답
 *
 * PATCH /api/notion/invoices/[id] - 구현 추후
 */
export type UpdateInvoiceResponse = ApiResponse<{
  invoice: Invoice;
}>;

/**
 * 견적서 삭제 응답
 *
 * DELETE /api/notion/invoices/[id] - 구현 추후
 */
export type DeleteInvoiceResponse = ApiResponse<{
  id: string;
  message: string;
}>;

/**
 * 견적서 항목 생성 요청
 *
 * 별도 엔드포인트: POST /api/notion/invoices/[id]/items - 구현 추후
 */
export interface CreateInvoiceItemFormData {
  /** 항목 제목 */
  title: string;
  /** 카테고리 (선택적) */
  category?: string;
  /** 항목 설명 */
  description: string;
  /** 수량 */
  quantity: number;
  /** 단위 */
  unit: string;
  /** 단가 */
  unitPrice: number;
  /** 표시 순서 */
  displayOrder: number;
}
