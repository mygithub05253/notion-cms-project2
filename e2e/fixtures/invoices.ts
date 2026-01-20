/**
 * E2E 테스트용 견적서 Mock 데이터
 */

import { Invoice } from '@/types/index';

/**
 * 테스트용 견적서 데이터
 */
export const createMockInvoice = (overrides?: Partial<Invoice>): Invoice => ({
  id: 'test-invoice-001',
  title: 'E2E 테스트 견적서',
  clientName: '테스트 클라이언트',
  clientEmail: 'client@example.com',
  description: '이 견적서는 E2E 테스트를 위한 Mock 데이터입니다.',
  status: 'draft' as const,
  totalAmount: 100000,
  items: [
    {
      id: 'item-001',
      invoiceId: 'test-invoice-001',
      title: '테스트 서비스 A',
      description: '첫 번째 테스트 항목',
      quantity: 2,
      unit: '개',
      unitPrice: 30000,
      subtotal: 60000,
      displayOrder: 1,
    },
    {
      id: 'item-002',
      invoiceId: 'test-invoice-001',
      title: '테스트 서비스 B',
      description: '두 번째 테스트 항목',
      quantity: 1,
      unit: '개',
      unitPrice: 40000,
      subtotal: 40000,
      displayOrder: 2,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'user-001',
  ...overrides,
});

/**
 * 테스트용 공유 링크 토큰
 */
export const createMockShareToken = (): string => {
  return `share-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;
};
