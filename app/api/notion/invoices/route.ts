/**
 * Notion Invoices API
 *
 * GET /api/notion/invoices - 모든 견적서 목록 조회
 * POST /api/notion/invoices - 견적서 생성
 */

import { NextRequest, NextResponse } from 'next/server';
import { getInvoices, createInvoice } from '@/lib/services';
import type { GetInvoicesResponse, CreateInvoiceResponse } from '@/types/api';
import type { InvoiceStatus } from '@/types';

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
 * GET /api/notion/invoices?status=draft
 * GET /api/notion/invoices?clientName=홍길동
 *
 * // 성공 응답 (200)
 * {
 *   "success": true,
 *   "data": {
 *     "invoices": [...],
 *     "total": 10
 *   }
 * }
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetInvoicesResponse>> {
  try {
    // URL에서 필터 파라미터 추출
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as InvoiceStatus | null;
    const clientName = searchParams.get('clientName');

    // 필터 옵션 구성
    const filters: { status?: InvoiceStatus; clientName?: string } = {};
    if (status) filters.status = status;
    if (clientName) filters.clientName = clientName;

    // 서비스 레이어 호출
    const invoices = await getInvoices(
      Object.keys(filters).length > 0 ? filters : undefined
    );

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
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notion/invoices
 *
 * 새 견적서를 생성합니다.
 *
 * @param request - NextRequest (CreateInvoiceRequest body)
 * @returns CreateInvoiceResponse - 생성된 견적서
 *
 * @example
 * // 요청
 * POST /api/notion/invoices
 * {
 *   "title": "웹사이트 개발 견적서",
 *   "description": "2026년 1분기 프로젝트",
 *   "clientName": "ABC 회사",
 *   "clientEmail": "contact@abc.com",
 *   "items": [
 *     {
 *       "title": "디자인",
 *       "description": "웹사이트 UI/UX 디자인",
 *       "quantity": 1,
 *       "unit": "식",
 *       "unitPrice": 5000000,
 *       "displayOrder": 1
 *     }
 *   ]
 * }
 *
 * // 성공 응답 (201)
 * {
 *   "success": true,
 *   "data": { "invoice": {...} }
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateInvoiceResponse>> {
  try {
    // 요청 본문 파싱
    const body = await request.json();

    // 필수 필드 검증
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: '견적서 제목은 필수입니다.',
        },
        { status: 400 }
      );
    }

    if (!body.clientName || typeof body.clientName !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: '클라이언트 이름은 필수입니다.',
        },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '최소 1개 이상의 항목이 필요합니다.',
        },
        { status: 400 }
      );
    }

    // 항목 필드 검증
    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      if (!item.title || !item.description) {
        return NextResponse.json(
          {
            success: false,
            error: `항목 ${i + 1}: 제목과 설명은 필수입니다.`,
          },
          { status: 400 }
        );
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: `항목 ${i + 1}: 수량은 0보다 커야 합니다.`,
          },
          { status: 400 }
        );
      }
      if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
        return NextResponse.json(
          {
            success: false,
            error: `항목 ${i + 1}: 단가는 0 이상이어야 합니다.`,
          },
          { status: 400 }
        );
      }
    }

    // TODO: 인증된 사용자 ID 가져오기 (현재는 임시 값)
    const createdBy = 'admin';

    // 서비스 레이어 호출
    const invoice = await createInvoice(body, createdBy);

    return NextResponse.json(
      {
        success: true,
        data: { invoice },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('견적서 생성 실패:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
