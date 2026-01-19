/**
 * Notion Invoice 상세 조회 API
 *
 * GET /api/notion/invoices/[id] - 특정 견적서 상세 조회 (항목 포함)
 */

import { NextRequest, NextResponse } from 'next/server';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { getNotionClient, getItemsDatabaseId } from '@/lib/notion-client';
import {
  notionPageToInvoice,
  notionPageToInvoiceItem,
  handleNotionError,
} from '@/lib/notion-helpers';
import { GetInvoiceResponse } from '@/types/api';

/**
 * GET /api/notion/invoices/[id]
 *
 * 특정 견적서의 상세 정보를 조회합니다.
 * 견적서의 모든 항목도 함께 조회되어 반환됩니다.
 *
 * @param request - NextRequest
 * @param params - { id: string } - 견적서 페이지 ID
 * @returns GetInvoiceResponse - 견적서 상세 정보 (항목 포함)
 *
 * @example
 * // 요청
 * GET /api/notion/invoices/abc123def456...
 *
 * // 성공 응답 (200)
 * {
 *   "success": true,
 *   "data": {
 *     "invoice": {
 *       "id": "abc123def456...",
 *       "title": "견적서 제목",
 *       "clientName": "클라이언트",
 *       "totalAmount": 1000000,
 *       "status": "draft",
 *       "items": [
 *         {
 *           "id": "item-id",
 *           "invoiceId": "abc123def456...",
 *           "title": "웹사이트 디자인",
 *           "quantity": 2,
 *           "unitPrice": 500000,
 *           "subtotal": 1000000,
 *           "displayOrder": 1
 *         }
 *       ],
 *       "createdAt": "2026-01-19T...",
 *       "updatedAt": "2026-01-19T..."
 *     }
 *   }
 * }
 *
 * @example
 * // 견적서 없음 (404)
 * {
 *   "success": false,
 *   "error": "요청한 데이터를 찾을 수 없습니다."
 * }
 *
 * @example
 * // 인증 실패 (500)
 * {
 *   "success": false,
 *   "error": "Notion API 인증에 실패했습니다. API 키를 확인하세요."
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetInvoiceResponse>> {
  try {
    const notion = getNotionClient();
    const { id } = await params;

    // 1. 견적서 페이지 조회
    const page = await notion.pages.retrieve({ page_id: id });

    // Properties 필드가 없으면 유효하지 않은 페이지
    if (!('properties' in page)) {
      return NextResponse.json(
        {
          success: false,
          error: '요청한 데이터를 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    // 2. Notion Page를 Invoice로 변환
    const invoice = notionPageToInvoice(page);

    // 3. Items 데이터베이스에서 해당 견적서의 항목 조회
    const itemsDatabaseId = getItemsDatabaseId();

    try {
      const itemsResponse = await (notion.databases as any).query({
        database_id: itemsDatabaseId,
        filter: {
          property: 'Invoice',
          relation: {
            contains: id,
          },
        },
        sorts: [
          {
            property: 'Display Order',
            direction: 'ascending',
          },
        ],
      });

      // 타입 가드: PageObjectResponse만 필터링
      const items = (itemsResponse.results as any[])
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map((page) => {
          try {
            return notionPageToInvoiceItem(page);
          } catch (error) {
            console.error('항목 변환 실패:', error);
            return null;
          }
        })
        .filter((item) => item !== null);

      // 4. Invoice에 항목 배열 할당
      invoice.items = items as any;
    } catch (itemsError) {
      // Items 데이터베이스 조회 실패 시 에러 로깅하지만 응답은 계속 진행
      // (견적서는 반환하되 항목 없음)
      console.warn('항목 조회 실패 (견적서는 반환됨):', itemsError);
    }

    return NextResponse.json({
      success: true,
      data: { invoice },
    });
  } catch (error) {
    console.error('견적서 상세 조회 실패:', error);

    // 페이지를 찾을 수 없는 경우
    const errorMessage = error instanceof Error ? error.message : '';
    if (errorMessage.includes('object_not_found') || errorMessage.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: '요청한 견적서를 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: handleNotionError(error),
      },
      { status: 500 }
    );
  }
}
