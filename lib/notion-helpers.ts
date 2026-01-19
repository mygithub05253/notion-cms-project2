/**
 * Notion 데이터 변환 유틸리티
 *
 * Notion API 응답을 애플리케이션의 타입으로 변환하고,
 * 에러 처리 및 데이터 검증을 담당합니다.
 */

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Invoice, InvoiceItem, InvoiceStatus } from '@/types';

/**
 * Notion Property에서 텍스트 값 추출
 *
 * title 또는 rich_text 타입의 Property에서 plain_text를 추출합니다.
 *
 * @param property - Notion property 객체
 * @returns 추출된 텍스트 또는 빈 문자열
 *
 * @example
 * const title = extractText(page.properties['Title']);
 * console.log(title); // "견적서 제목"
 */
export function extractText(property: any): string {
  if (!property) return '';

  // title 타입 처리
  if (property.type === 'title' && property.title && property.title.length > 0) {
    return property.title[0].plain_text || '';
  }

  // rich_text 타입 처리
  if (
    property.type === 'rich_text' &&
    property.rich_text &&
    property.rich_text.length > 0
  ) {
    return property.rich_text[0].plain_text || '';
  }

  return '';
}

/**
 * Notion Property에서 email 값 추출
 *
 * @param property - Notion property 객체
 * @returns 추출된 이메일 또는 빈 문자열
 *
 * @example
 * const email = extractEmail(page.properties['Client Email']);
 * console.log(email); // "client@example.com"
 */
export function extractEmail(property: any): string {
  if (!property || property.type !== 'email') return '';
  return property.email || '';
}

/**
 * Notion Property에서 숫자 값 추출
 *
 * @param property - Notion property 객체
 * @returns 추출된 숫자 또는 0
 *
 * @example
 * const quantity = extractNumber(page.properties['Quantity']);
 * console.log(quantity); // 10
 */
export function extractNumber(property: any): number {
  if (!property || property.type !== 'number') return 0;
  return typeof property.number === 'number' ? property.number : 0;
}

/**
 * Notion Property에서 Select(선택 옵션) 값 추출
 *
 * @param property - Notion property 객체
 * @returns 선택된 옵션 이름 또는 null
 *
 * @example
 * const status = extractSelect(page.properties['Status']);
 * console.log(status); // "draft"
 */
export function extractSelect(property: any): string | null {
  if (!property || property.type !== 'select') return null;
  return property.select?.name || null;
}

/**
 * Notion Property에서 날짜 값 추출
 *
 * @param property - Notion property 객체
 * @returns 추출된 날짜 (Date 객체) 또는 null
 *
 * @example
 * const createdAt = extractDate(page.properties['Created At']);
 * console.log(createdAt); // 2026-01-19T00:00:00.000Z
 */
export function extractDate(property: any): Date | null {
  if (!property || property.type !== 'date' || !property.date) return null;

  try {
    return new Date(property.date.start);
  } catch {
    return null;
  }
}

/**
 * Notion Property에서 Relation(관계) ID 배열 추출
 *
 * @param property - Notion property 객체
 * @returns 관계된 페이지 ID 배열
 *
 * @example
 * const invoiceIds = extractRelation(page.properties['Invoice']);
 * console.log(invoiceIds); // ["page-id-1", "page-id-2"]
 */
export function extractRelation(property: any): string[] {
  if (!property || property.type !== 'relation' || !property.relation) return [];

  return property.relation
    .map((rel: any) => rel.id)
    .filter((id: string) => Boolean(id));
}

/**
 * Notion Page를 Invoice 타입으로 변환
 *
 * Notion의 Invoice 데이터베이스 페이지를 애플리케이션의 Invoice 타입으로 변환합니다.
 * 변환 과정에서 필드명이 정확히 일치해야 합니다.
 *
 * @param page - Notion PageObjectResponse
 * @returns 변환된 Invoice 객체
 * @throws {Error} Invalid page object인 경우
 *
 * @note 항목(items)은 이 함수에서 채워지지 않으므로,
 *      별도 쿼리로 Items 데이터베이스에서 조회하여 할당해야 합니다.
 *
 * @example
 * const invoice = notionPageToInvoice(page);
 * // invoice.items는 빈 배열이므로 별도로 채워야 함
 */
export function notionPageToInvoice(page: PageObjectResponse): Invoice {
  if (!('properties' in page)) {
    throw new Error('Invalid Notion page object: missing properties');
  }

  const props = page.properties;
  const status = extractSelect(props['Status']) as InvoiceStatus | null;

  return {
    id: page.id,
    title: extractText(props['Title']),
    description: extractText(props['Description']) || undefined,
    createdBy: extractText(props['Created By']),
    clientName: extractText(props['Client Name']),
    clientEmail: extractEmail(props['Client Email']) || undefined,
    status: status || 'draft',
    totalAmount: extractNumber(props['Total Amount']),
    items: [], // 별도 쿼리로 채워야 함
    createdAt: extractDate(props['Created At']) || new Date(),
    updatedAt: extractDate(props['Updated At']) || new Date(),
  };
}

/**
 * Notion Page를 InvoiceItem 타입으로 변환
 *
 * Notion의 Items 데이터베이스 페이지를 애플리케이션의 InvoiceItem 타입으로 변환합니다.
 *
 * @param page - Notion PageObjectResponse
 * @returns 변환된 InvoiceItem 객체
 * @throws {Error} Invalid page object인 경우
 *
 * @example
 * const item = notionPageToInvoiceItem(page);
 * console.log(item); // { id, title, quantity, unitPrice, ... }
 */
export function notionPageToInvoiceItem(page: PageObjectResponse): InvoiceItem {
  if (!('properties' in page)) {
    throw new Error('Invalid Notion page object: missing properties');
  }

  const props = page.properties;
  const invoiceRelations = extractRelation(props['Invoice']);

  return {
    id: page.id,
    invoiceId: invoiceRelations[0] || '', // 첫 번째 관계 ID 사용
    title: extractText(props['Title']),
    category: extractSelect(props['Category']) || undefined,
    description: extractText(props['Description']),
    quantity: extractNumber(props['Quantity']),
    unit: extractText(props['Unit']),
    unitPrice: extractNumber(props['Unit Price']),
    subtotal: extractNumber(props['Subtotal']),
    displayOrder: extractNumber(props['Display Order']),
  };
}

/**
 * Notion API 에러를 처리하고 사용자 친화적 메시지 반환
 *
 * 기술적인 에러 정보를 일반 사용자가 이해할 수 있는 메시지로 변환합니다.
 * 서버 로그에는 상세 에러를 기록하고, 클라이언트에는 일반화된 메시지를 전달합니다.
 *
 * @param error - 발생한 에러
 * @returns 사용자 친화적 에러 메시지
 *
 * @example
 * try {
 *   await getNotionClient().databases.query({...});
 * } catch (error) {
 *   const message = handleNotionError(error);
 *   console.error('클라이언트에게 보낼 메시지:', message);
 * }
 */
export function handleNotionError(error: unknown): string {
  // Error 객체가 아닌 경우
  if (!(error instanceof Error)) {
    console.error('알 수 없는 에러:', error);
    return '알 수 없는 오류가 발생했습니다.';
  }

  const errorMessage = error.message;
  console.error('Notion API 에러:', errorMessage);

  // 인증 실패
  if (errorMessage.includes('unauthorized') || errorMessage.includes('API token')) {
    return 'Notion API 인증에 실패했습니다. API 키를 확인하세요.';
  }

  // 데이터 없음
  if (
    errorMessage.includes('object_not_found') ||
    errorMessage.includes('not found')
  ) {
    return '요청한 데이터를 찾을 수 없습니다.';
  }

  // 요청 제한
  if (
    errorMessage.includes('rate_limited') ||
    errorMessage.includes('too_many_requests')
  ) {
    return 'API 요청 제한을 초과했습니다. 잠시 후 다시 시도하세요.';
  }

  // 권한 부족
  if (errorMessage.includes('restricted_resource')) {
    return 'Notion 데이터베이스에 접근 권한이 없습니다.';
  }

  // 네트워크 에러
  if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('network')) {
    return 'Notion 서버에 연결할 수 없습니다. 네트워크를 확인해주세요.';
  }

  // 기본 메시지
  return 'Notion 서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
}
