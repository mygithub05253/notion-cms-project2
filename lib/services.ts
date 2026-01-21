/**
 * 백엔드 서비스 레이어
 *
 * Notion 데이터베이스와의 상호작용을 담당합니다.
 * Notion API @notionhq/client를 사용하여 CRUD 작업을 수행합니다.
 */

import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types';
import { getNotionClient, getInvoicesDatabaseId, getItemsDatabaseId } from './notion-client';
import { parseNotionInvoice, parseNotionItem } from './notion-helpers';

/**
 * 모든 견적서 목록 조회
 * 생성 날짜 기준 최신순으로 정렬됩니다.
 *
 * @param filters - 필터 옵션 (상태, 클라이언트 이름)
 * @returns 견적서 배열
 * @throws {Error} Notion API 호출 실패 시
 */
export async function getInvoices(filters?: {
  status?: string;
  clientName?: string;
}): Promise<Invoice[]> {
  try {
    const client = getNotionClient();
    const databaseId = getInvoicesDatabaseId();

    // Notion 데이터베이스 쿼리 필터 구성
    const filterConditions: any[] = [];

    if (filters?.status) {
      filterConditions.push({
        property: 'Status',
        select: {
          equals: filters.status,
        },
      });
    }

    if (filters?.clientName) {
      filterConditions.push({
        property: 'Client Name',
        text: {
          contains: filters.clientName,
        },
      });
    }

    // 쿼리 파라미터 구성
    const queryPayload: any = {
      sorts: [
        {
          property: 'Created At',
          direction: 'descending',
        },
      ],
    };

    if (filterConditions.length > 0) {
      queryPayload.filter =
        filterConditions.length === 1
          ? filterConditions[0]
          : {
              and: filterConditions,
            };
    }

    // Notion REST API를 사용하여 데이터베이스 쿼리
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2024-06-15',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryPayload),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Notion API 오류: ${response.status} - ${error}`);
    }

    const data = await response.json();

    // 응답 파싱 및 변환
    const invoices = (data.results || []).map((page: any) =>
      parseNotionInvoice(page)
    );

    return invoices;
  } catch (error) {
    console.error('견적서 목록 조회 실패:', error);
    throw error;
  }
}

/**
 * 특정 견적서 상세 조회
 * 관련 항목(Items)도 함께 조회됩니다.
 *
 * @param id - 견적서 ID (예: INV-2026-001)
 * @returns 견적서 상세 정보, 없으면 null
 * @throws {Error} Notion API 호출 실패 시
 */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const databaseId = getInvoicesDatabaseId();

    // ID로 견적서 조회 (REST API 사용)
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2024-06-15',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'ID',
            text: {
              equals: id,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Notion API 오류: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const invoicePage = data.results[0];
    const invoice = parseNotionInvoice(invoicePage);

    // 항목 조회 (REST API 사용)
    const itemsDatabaseId = getItemsDatabaseId();
    const itemsResponse = await fetch(
      `https://api.notion.com/v1/databases/${itemsDatabaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2024-06-15',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'Invoices',
            relation: {
              contains: invoicePage.id,
            },
          },
          sorts: [
            {
              property: 'Display Order',
              direction: 'ascending',
            },
          ],
        }),
      }
    );

    if (!itemsResponse.ok) {
      const error = await itemsResponse.text();
      throw new Error(`Notion API 오류: ${itemsResponse.status} - ${error}`);
    }

    const itemsData = await itemsResponse.json();
    invoice.items = (itemsData.results || []).map((page: any) =>
      parseNotionItem(page, invoice.id)
    );

    return invoice;
  } catch (error) {
    console.error(`견적서 상세 조회 실패 (ID: ${id}):`, error);
    throw error;
  }
}

/**
 * 새 견적서 생성
 * 견적서와 함께 항목(Items)도 생성됩니다.
 *
 * @param data - 견적서 데이터
 * @param createdBy - 작성자 ID
 * @returns 생성된 견적서 (ID 포함)
 * @throws {Error} Notion API 호출 실패 시
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
  try {
    const client = getNotionClient();
    const databaseId = getInvoicesDatabaseId();

    // 총액 계산
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    // 새 견적서 ID 생성 (INV-YYYY-XXX 형식)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    const invoiceId = `INV-${year}-${timestamp}`;

    // 견적서 생성
    // 선택적 필드를 조건부로 포함하기 위해 properties 객체 구성
    const properties: any = {
      ID: {
        title: [{ text: { content: invoiceId } }],
      },
      Title: {
        rich_text: [{ text: { content: data.title } }],
      },
      'Client Name': {
        rich_text: [{ text: { content: data.clientName } }],
      },
      'Created By': {
        rich_text: [{ text: { content: createdBy } }],
      },
      'Created At': {
        date: {
          start: now.toISOString().split('T')[0],
        },
      },
      Status: {
        select: {
          name: 'draft',
        },
      },
      'Total Amount': {
        number: totalAmount,
      },
      Currency: {
        select: {
          name: '₩',
        },
      },
    };

    // 선택적 필드 추가
    if (data.clientEmail) {
      properties['Client Email'] = {
        email: data.clientEmail,
      };
    }

    if (data.description) {
      properties.Description = {
        rich_text: [{ text: { content: data.description } }],
      };
    }

    const invoiceResponse = await client.pages.create({
      parent: { database_id: databaseId },
      properties,
    });

    const pageId = invoiceResponse.id;

    // 항목 생성
    const itemsDatabaseId = getItemsDatabaseId();
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const subtotal = item.quantity * item.unitPrice;

      await client.pages.create({
        parent: { database_id: itemsDatabaseId },
        properties: {
          'Item ID': {
            title: [{ text: { content: `${invoiceId}-${i + 1}` } }],
          },
          Title: {
            rich_text: [{ text: { content: item.description } }],
          },
          Description: {
            rich_text: [{ text: { content: item.description } }],
          },
          Quantity: {
            number: item.quantity,
          },
          'Unit Price': {
            number: item.unitPrice,
          },
          Subtotal: {
            number: subtotal,
          },
          Unit: {
            select: {
              name: item.unit || '식',
            },
          },
          'Display Order': {
            number: i + 1,
          },
          Invoices: {
            relation: [{ id: pageId }],
          },
        },
      });
    }

    // 생성된 견적서 반환
    return {
      id: invoiceId,
      title: data.title,
      description: data.description || '',
      createdBy,
      clientName: data.clientName,
      clientEmail: data.clientEmail || '',
      status: 'draft' as InvoiceStatus,
      totalAmount,
      createdAt: now,
      updatedAt: now,
      items: data.items.map((item, i) => ({
        id: `${invoiceId}-${i + 1}`,
        invoiceId,
        title: item.title,
        category: item.category,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
        displayOrder: i + 1,
      })),
    };
  } catch (error) {
    console.error('견적서 생성 실패:', error);
    throw error;
  }
}

/**
 * 견적서 수정
 * 항목은 별도로 수정해야 합니다.
 *
 * @param id - 견적서 ID
 * @param data - 수정할 데이터
 * @returns 수정된 견적서
 * @throws {Error} Notion API 호출 실패 시
 */
export async function updateInvoice(
  id: string,
  data: Partial<Invoice>
): Promise<Invoice> {
  try {
    const client = getNotionClient();
    const databaseId = getInvoicesDatabaseId();

    // ID로 견적서 페이지 찾기 (REST API 사용)
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2024-06-15',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'ID',
            text: {
              equals: id,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Notion API 오류: ${response.status} - ${error}`);
    }

    const queryData = await response.json();

    if (!queryData.results || queryData.results.length === 0) {
      throw new Error(`견적서를 찾을 수 없습니다: ${id}`);
    }

    const pageId = queryData.results[0].id;

    // 수정할 속성 구성
    const updateProperties: any = {};

    if (data.title) {
      updateProperties.Title = {
        rich_text: [{ text: { content: data.title } }],
      };
    }

    if (data.clientName) {
      updateProperties['Client Name'] = {
        rich_text: [{ text: { content: data.clientName } }],
      };
    }

    if (data.clientEmail !== undefined) {
      updateProperties['Client Email'] = {
        email: data.clientEmail || null,
      };
    }

    if (data.description !== undefined) {
      updateProperties.Description = data.description
        ? {
            rich_text: [{ text: { content: data.description } }],
          }
        : {
            rich_text: [],
          };
    }

    if (data.status) {
      updateProperties.Status = {
        select: {
          name: data.status,
        },
      };
    }

    if (data.totalAmount !== undefined) {
      updateProperties['Total Amount'] = {
        number: data.totalAmount,
      };
    }

    updateProperties['Updated At'] = {
      date: {
        start: new Date().toISOString().split('T')[0],
      },
    };

    // 페이지 업데이트
    await client.pages.update({
      page_id: pageId,
      properties: updateProperties,
    });

    // 수정된 견적서 반환
    return getInvoiceById(id) as Promise<Invoice>;
  } catch (error) {
    console.error(`견적서 수정 실패 (ID: ${id}):`, error);
    throw error;
  }
}

/**
 * 견적서 삭제 (Soft Delete - 아카이브)
 * 실제 삭제 대신 페이지를 아카이브 처리합니다.
 *
 * @param id - 견적서 ID
 * @throws {Error} Notion API 호출 실패 시
 */
export async function deleteInvoice(id: string): Promise<void> {
  try {
    const client = getNotionClient();
    const databaseId = getInvoicesDatabaseId();

    // ID로 견적서 페이지 찾기 (REST API 사용)
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2024-06-15',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'ID',
            text: {
              equals: id,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Notion API 오류: ${response.status} - ${error}`);
    }

    const queryData = await response.json();

    if (!queryData.results || queryData.results.length === 0) {
      throw new Error(`견적서를 찾을 수 없습니다: ${id}`);
    }

    const pageId = queryData.results[0].id;

    // 페이지 아카이브 (Soft Delete)
    await client.pages.update({
      page_id: pageId,
      archived: true,
    });
  } catch (error) {
    console.error(`견적서 삭제 실패 (ID: ${id}):`, error);
    throw error;
  }
}
