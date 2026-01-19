/**
 * Notion Invoices API
 *
 * GET /api/notion/invoices - 모든 견적서 목록 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { getNotionClient, getInvoicesDatabaseId } from '@/lib/notion-client';
import {
  notionPageToInvoice,
  handleNotionError,
} from '@/lib/notion-helpers';
import { GetInvoicesResponse } from '@/types/api';

/**
 * GET /api/notion/invoices
 *
 * 모든 견적서 목록을 조회합니다.
 * 생성 날짜 기준 최신순으로 정렬됩니다.
 *
 * @param request - NextRequest
 * @returns GetInvoicesResponse - 견적서 목록 및 총 개수
 *
 * @example
 * // 요청
 * GET /api/notion/invoices
 *
 * // 성공 응답 (200)
 * {
 *   "success": true,
 *   "data": {
 *     "invoices": [
 *       {
 *         "id": "...",
 *         "title": "견적서 제목",
 *         "clientName": "클라이언트",
 *         "totalAmount": 1000000,
 *         "status": "draft",
 *         "items": [],
 *         "createdAt": "2026-01-19T...",
 *         "updatedAt": "2026-01-19T..."
 *       }
 *     ],
 *     "total": 1
 *   }
 * }
 *
 * @example
 * // 실패 응답 (500)
 * {
 *   "success": false,
 *   "error": "Notion API 인증에 실패했습니다. API 키를 확인하세요."
 * }
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetInvoicesResponse>> {
  try {
    const notion = getNotionClient();
    const databaseId = getInvoicesDatabaseId();

    // Notion 데이터베이스 쿼리
    // Created At 기준 최신순 정렬
    const response = await (notion.databases as any).query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Created At',
          direction: 'descending',
        },
      ],
    });

    // 타입 가드: PageObjectResponse만 필터링 (partial page 제외)
    const invoices = (response.results as any[])
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map((page) => {
        try {
          return notionPageToInvoice(page);
        } catch (error) {
          console.error('견적서 변환 실패:', error);
          return null;
        }
      })
      .filter((invoice) => invoice !== null) as ReturnType<typeof notionPageToInvoice>[];

    return NextResponse.json({
      success: true,
      data: {
        invoices,
        total: invoices.length,
      },
    });
  } catch (error) {
    console.error('견적서 목록 조회 실패:', error);

    return NextResponse.json(
      {
        success: false,
        error: handleNotionError(error),
      },
      { status: 500 }
    );
  }
}
