/**
 * Notion API 클라이언트 초기화
 *
 * @notionhq/client를 싱글톤 패턴으로 관리합니다.
 * 서버 사이드(Server Component, API Route)에서만 사용 가능합니다.
 */

import { Client } from '@notionhq/client';
import { getNotionConfig } from './env';

/**
 * Notion API 클라이언트 싱글톤 인스턴스
 * 최초 1회만 초기화되고, 이후 재사용됩니다.
 *
 * @private
 */
let notionClientInstance: Client | null = null;

/**
 * Notion API 클라이언트 인스턴스 가져오기
 *
 * 싱글톤 패턴으로 구현되어 있으므로,
 * 여러 번 호출해도 동일한 인스턴스를 반환합니다.
 *
 * @returns {Client} Notion API 클라이언트 인스턴스
 * @throws {Error} 환경 변수가 설정되지 않은 경우
 *
 * @example
 * // API 라우트에서 사용
 * const client = getNotionClient();
 * const response = await client.databases.query({
 *   database_id: 'your-database-id',
 * });
 *
 * @example
 * // 여러 번 호출해도 동일한 인스턴스 반환
 * const client1 = getNotionClient();
 * const client2 = getNotionClient();
 * console.log(client1 === client2); // true
 */
export function getNotionClient(): Client {
  if (!notionClientInstance) {
    const { apiKey } = getNotionConfig();

    notionClientInstance = new Client({
      auth: apiKey,
    });
  }

  return notionClientInstance;
}

/**
 * Notion Invoices 데이터베이스 ID 가져오기
 *
 * @returns {string} Invoices 데이터베이스 ID
 * @throws {Error} NOTION_DATABASE_ID 환경 변수가 설정되지 않은 경우
 *
 * @example
 * const databaseId = getInvoicesDatabaseId();
 * const response = await getNotionClient().databases.query({
 *   database_id: databaseId,
 * });
 */
export function getInvoicesDatabaseId(): string {
  const { databaseId } = getNotionConfig();
  return databaseId;
}

/**
 * Notion Items 데이터베이스 ID 가져오기
 *
 * @returns {string} Items 데이터베이스 ID
 * @throws {Error} NOTION_ITEMS_DATABASE_ID 환경 변수가 설정되지 않은 경우
 *
 * @example
 * const itemsDatabaseId = getItemsDatabaseId();
 * const response = await getNotionClient().databases.query({
 *   database_id: itemsDatabaseId,
 *   filter: {
 *     property: 'Invoice',
 *     relation: {
 *       contains: invoiceId,
 *     },
 *   },
 * });
 */
export function getItemsDatabaseId(): string {
  const { itemsDatabaseId } = getNotionConfig();
  return itemsDatabaseId;
}

/**
 * Notion 클라이언트 인스턴스 초기화
 * (테스트 목적으로만 사용)
 *
 * @private
 * @internal
 */
export function resetNotionClient(): void {
  notionClientInstance = null;
}
