/**
 * 백엔드 서비스 레이어
 *
 * Notion 데이터베이스와의 상호작용을 담당합니다.
 * 현재는 스텁 구현 상태이며, Task 016+ 에서 완성될 예정입니다.
 */

import type { Invoice, InvoiceItem } from '@/types';

/**
 * 모든 견적서 목록 조회
 * @param filters - 필터 옵션
 * @returns 견적서 배열
 */
export async function getInvoices(filters?: {
  status?: string;
  clientName?: string;
}): Promise<Invoice[]> {
  // TODO: Notion 데이터베이스에서 견적서 목록 조회
  throw new Error('getInvoices - Not Implemented');
}

/**
 * 특정 견적서 상세 조회
 * @param id - 견적서 ID
 * @returns 견적서 상세 정보
 */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  // TODO: Notion 데이터베이스에서 특정 견적서 조회
  throw new Error('getInvoiceById - Not Implemented');
}

/**
 * 새 견적서 생성
 * @param data - 견적서 데이터
 * @param createdBy - 작성자 ID
 * @returns 생성된 견적서
 */
export async function createInvoice(
  data: {
    title: string;
    description?: string;
    clientName: string;
    clientEmail?: string;
    items: Omit<InvoiceItem, 'id' | 'invoiceId' | 'displayOrder'>[];
  },
  createdBy: string
): Promise<Invoice> {
  // TODO: Notion 데이터베이스에 새 견적서 생성
  throw new Error('createInvoice - Not Implemented');
}

/**
 * 견적서 수정
 * @param id - 견적서 ID
 * @param data - 수정할 데이터
 * @returns 수정된 견적서
 */
export async function updateInvoice(
  id: string,
  data: Partial<Invoice>
): Promise<Invoice> {
  // TODO: Notion 데이터베이스의 견적서 수정
  throw new Error('updateInvoice - Not Implemented');
}

/**
 * 견적서 삭제
 * @param id - 견적서 ID
 */
export async function deleteInvoice(id: string): Promise<void> {
  // TODO: Notion 데이터베이스에서 견적서 삭제(아카이브)
  throw new Error('deleteInvoice - Not Implemented');
}
