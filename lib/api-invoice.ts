/**
 * 견적서 API 모듈
 *
 * 견적서 조회, 생성, 수정, 삭제 등 CRUD 작업을 처리합니다.
 * 모든 요청은 Authorization 헤더를 자동으로 포함합니다.
 */

import type { Invoice, InvoiceItem } from '@/types';
import { apiFetch, apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-config';

/**
 * 견적서 생성/수정 요청 데이터 타입
 */
export interface CreateInvoiceRequest {
  /** 견적서 제목 */
  title: string;
  /** 견적서 설명 */
  description?: string;
  /** 클라이언트 이름 */
  clientName: string;
  /** 클라이언트 이메일 */
  clientEmail?: string;
  /** 견적서 항목 배열 (서버에서 id, invoiceId, displayOrder 자동 생성) */
  items: Omit<InvoiceItem, 'id' | 'invoiceId' | 'displayOrder'>[];
}

/**
 * 견적서 목록 조회 API 함수
 *
 * 현재 사용자가 생성한 모든 견적서를 조회합니다.
 * 페이지네이션, 필터링, 정렬 등을 지원합니다.
 *
 * @param page - 페이지 번호 (기본값: 1)
 * @param limit - 페이지당 항목 수 (기본값: 10)
 * @returns 견적서 배열
 * @throws {Error} 조회 실패 또는 인증 오류
 *
 * @example
 * const invoices = await getInvoicesApi(1, 20);
 */
export async function getInvoicesApi(page: number = 1, limit: number = 10): Promise<Invoice[]> {
  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const invoices = await apiGet<Invoice[]>(`/invoices?${query.toString()}`);
    return invoices;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('인증이 만료')) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      if (error.message.includes('네트워크')) {
        throw new Error('네트워크 연결을 확인해주세요.');
      }
    }
    throw error;
  }
}

/**
 * 특정 견적서 조회 API 함수
 *
 * 견적서 ID로 상세 정보를 조회합니다.
 *
 * @param invoiceId - 견적서 ID (UUID)
 * @returns 견적서 상세 정보
 * @throws {Error} 조회 실패, 인증 오류, 또는 권한 오류
 *
 * @example
 * const invoice = await getInvoiceApi('550e8400-e29b-41d4-a716-446655440000');
 */
export async function getInvoiceApi(invoiceId: string): Promise<Invoice> {
  try {
    const invoice = await apiGet<Invoice>(`/invoices/${invoiceId}`);
    return invoice;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('인증이 만료')) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      if (error.message.includes('404')) {
        throw new Error('견적서를 찾을 수 없습니다.');
      }
      if (error.message.includes('403')) {
        throw new Error('이 견적서에 접근할 권한이 없습니다.');
      }
    }
    throw error;
  }
}

/**
 * 견적서 생성 API 함수
 *
 * 새로운 견적서를 생성합니다.
 * 생성자는 자동으로 현재 로그인한 사용자로 설정됩니다.
 *
 * @param data - 견적서 생성 데이터
 * @returns 생성된 견적서 정보 (ID 포함)
 * @throws {Error} 생성 실패 또는 입력 검증 오류
 *
 * @example
 * const newInvoice = await createInvoiceApi({
 *   title: '웹사이트 개발 견적서',
 *   clientName: '홍길동',
 *   items: [...]
 * });
 */
export async function createInvoiceApi(data: CreateInvoiceRequest): Promise<Invoice> {
  try {
    const invoice = await apiPost<Invoice>('/invoices', data);
    return invoice;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('인증이 만료')) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      if (error.message.includes('400')) {
        throw new Error('입력하신 정보를 확인해주세요.');
      }
    }
    throw error;
  }
}

/**
 * 견적서 수정 API 함수
 *
 * 기존 견적서를 수정합니다.
 * 생성자만 수정 가능합니다 (백엔드에서 검증).
 *
 * @param invoiceId - 견적서 ID (UUID)
 * @param data - 수정할 견적서 데이터
 * @returns 수정된 견적서 정보
 * @throws {Error} 수정 실패, 인증 오류, 또는 권한 오류
 *
 * @example
 * const updated = await updateInvoiceApi(invoiceId, {
 *   title: '수정된 견적서',
 *   items: [...]
 * });
 */
export async function updateInvoiceApi(
  invoiceId: string,
  data: Partial<CreateInvoiceRequest>
): Promise<Invoice> {
  try {
    const invoice = await apiPut<Invoice>(`/invoices/${invoiceId}`, data);
    return invoice;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('인증이 만료')) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      if (error.message.includes('404')) {
        throw new Error('견적서를 찾을 수 없습니다.');
      }
      if (error.message.includes('403')) {
        throw new Error('이 견적서를 수정할 권한이 없습니다.');
      }
      if (error.message.includes('400')) {
        throw new Error('입력하신 정보를 확인해주세요.');
      }
    }
    throw error;
  }
}

/**
 * 견적서 삭제 API 함수
 *
 * 견적서를 삭제합니다.
 * 생성자만 삭제 가능합니다 (백엔드에서 검증).
 *
 * @param invoiceId - 견적서 ID (UUID)
 * @throws {Error} 삭제 실패, 인증 오류, 또는 권한 오류
 *
 * @example
 * await deleteInvoiceApi('550e8400-e29b-41d4-a716-446655440000');
 */
export async function deleteInvoiceApi(invoiceId: string): Promise<void> {
  try {
    await apiDelete<void>(`/invoices/${invoiceId}`);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('인증이 만료')) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      if (error.message.includes('404')) {
        throw new Error('견적서를 찾을 수 없습니다.');
      }
      if (error.message.includes('403')) {
        throw new Error('이 견적서를 삭제할 권한이 없습니다.');
      }
    }
    throw error;
  }
}

/**
 * 견적서 상태 변경 API 함수
 *
 * 견적서 상태를 변경합니다 (draft → sent → accepted/rejected).
 *
 * @param invoiceId - 견적서 ID (UUID)
 * @param status - 변경할 상태
 * @returns 상태가 변경된 견적서 정보
 * @throws {Error} 상태 변경 실패 또는 권한 오류
 *
 * @example
 * const updated = await updateInvoiceStatusApi(invoiceId, 'sent');
 */
export async function updateInvoiceStatusApi(
  invoiceId: string,
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
): Promise<Invoice> {
  try {
    const invoice = await apiPut<Invoice>(`/invoices/${invoiceId}/status`, { status });
    return invoice;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('인증이 만료')) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      if (error.message.includes('403')) {
        throw new Error('이 견적서를 수정할 권한이 없습니다.');
      }
    }
    throw error;
  }
}
