/**
 * Notion API 타입 정의
 *
 * @notionhq/client 라이브러리의 타입을 재사용하고,
 * Invoice 및 InvoiceItem 데이터베이스의 Property 구조를 정의합니다.
 */

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

/**
 * Notion 페이지 객체 타입
 * 개별 페이지의 메타데이터와 Properties를 포함
 */
export type NotionPage = PageObjectResponse;

/**
 * Invoice 데이터베이스 Property 타입 정의
 *
 * Notion에서 설정된 필드명과 정확히 일치해야 합니다.
 * 예시: "Title", "Client Name", "Total Amount" 등
 *
 * @note Property 타입 설명:
 * - title: 페이지 제목 (ID 역할)
 * - rich_text: 서식 있는 텍스트
 * - email: 이메일 주소
 * - number: 숫자
 * - select: 선택 옵션 (단일)
 * - date: 날짜 또는 날짜 범위
 * - relation: 다른 데이터베이스 페이지 참조
 */
export interface NotionInvoiceProperties {
  'Invoice ID': {
    type: 'title';
  };
  'Title': {
    type: 'rich_text';
  };
  'Description': {
    type: 'rich_text';
  };
  'Client Name': {
    type: 'rich_text';
  };
  'Client Email': {
    type: 'rich_text';
  };
  'Status': {
    type: 'select'; // draft, sent, accepted, rejected
  };
  'Total Amount': {
    type: 'number';
  };
  'Created By': {
    type: 'rich_text';
  };
  'Created At': {
    type: 'date';
  };
  'Updated At': {
    type: 'date';
  };
  'Share Token': {
    type: 'rich_text';
  };
}

/**
 * InvoiceItem 데이터베이스 Property 타입 정의
 *
 * Notion Items 테이블의 필드 구조를 정의합니다.
 * 각 항목은 Invoice와 Relation으로 연결됩니다.
 */
export interface NotionInvoiceItemProperties {
  'Item ID': {
    type: 'title';
  };
  'Title': {
    type: 'rich_text';
  };
  'Category': {
    type: 'select';
  };
  'Description': {
    type: 'rich_text';
  };
  'Display Order': {
    type: 'number';
  };
  'Invoice': {
    type: 'relation'; // Invoice 데이터베이스 참조
  };
  'Quantity': {
    type: 'number';
  };
  'Unit': {
    type: 'rich_text';
  };
  'Unit Price': {
    type: 'number';
  };
  'Subtotal': {
    type: 'number';
  };
}

/**
 * Notion API 에러 타입
 * @notionhq/client가 발생시키는 에러의 구조
 */
export interface NotionApiError extends Error {
  status?: number;
  code?: string;
}
