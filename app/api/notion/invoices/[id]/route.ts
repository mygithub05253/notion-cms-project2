/**
 * Notion Invoice 상세 API
 *
 * GET /api/notion/invoices/[id] - 특정 견적서 상세 조회 (항목 포함)
 * PUT /api/notion/invoices/[id] - 견적서 수정
 * DELETE /api/notion/invoices/[id] - 견적서 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById, updateInvoice, deleteInvoice } from '@/lib/services';
import type {
  GetInvoiceResponse,
  UpdateInvoiceResponse,
  DeleteInvoiceResponse,
} from '@/types/api';

/**
 * GET /api/notion/invoices/[id]
 *
 * 특정 견적서의 상세 정보를 조회합니다.
 * 견적서의 모든 항목도 함께 조회되어 반환됩니다.
 *
 * @param request - NextRequest
 * @param params - { id: string } - 견적서 페이지 ID
 * @returns GetInvoiceResponse - 견적서 상세 정보 (항목 포함)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetInvoiceResponse>> {
  try {
    const { id } = await params;

    // 서비스 레이어 호출
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          error: '요청한 견적서를 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { invoice },
    });
  } catch (error) {
    console.error('견적서 상세 조회 실패:', error);

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
 * PUT /api/notion/invoices/[id]
 *
 * 견적서를 수정합니다.
 *
 * @param request - NextRequest (UpdateInvoiceRequest body)
 * @param params - { id: string } - 견적서 페이지 ID
 * @returns UpdateInvoiceResponse - 수정된 견적서
 *
 * @example
 * // 요청
 * PUT /api/notion/invoices/abc123
 * {
 *   "title": "수정된 제목",
 *   "status": "sent",
 *   "items": [...]
 * }
 *
 * // 성공 응답 (200)
 * {
 *   "success": true,
 *   "data": { "invoice": {...} }
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UpdateInvoiceResponse>> {
  try {
    const { id } = await params;
    const body = await request.json();

    // 견적서 존재 여부 확인
    const existingInvoice = await getInvoiceById(id);
    if (!existingInvoice) {
      return NextResponse.json(
        {
          success: false,
          error: '수정할 견적서를 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    // 항목 데이터 검증 (있는 경우)
    if (body.items && Array.isArray(body.items)) {
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
    }

    // 상태 검증 (있는 경우)
    if (body.status) {
      const validStatuses = ['draft', 'sent', 'accepted', 'rejected'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            error: `잘못된 상태 값입니다. (draft, sent, accepted, rejected 중 선택)`,
          },
          { status: 400 }
        );
      }
    }

    // 서비스 레이어 호출
    const invoice = await updateInvoice(id, body);

    return NextResponse.json({
      success: true,
      data: { invoice },
    });
  } catch (error) {
    console.error('견적서 수정 실패:', error);

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
 * DELETE /api/notion/invoices/[id]
 *
 * 견적서를 삭제(아카이브)합니다.
 *
 * @param request - NextRequest
 * @param params - { id: string } - 견적서 페이지 ID
 * @returns DeleteInvoiceResponse - 삭제 결과
 *
 * @example
 * // 요청
 * DELETE /api/notion/invoices/abc123
 *
 * // 성공 응답 (200)
 * {
 *   "success": true,
 *   "data": {
 *     "id": "abc123",
 *     "message": "견적서가 삭제되었습니다."
 *   }
 * }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DeleteInvoiceResponse>> {
  try {
    const { id } = await params;

    // 견적서 존재 여부 확인
    const existingInvoice = await getInvoiceById(id);
    if (!existingInvoice) {
      return NextResponse.json(
        {
          success: false,
          error: '삭제할 견적서를 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    // 서비스 레이어 호출
    await deleteInvoice(id);

    return NextResponse.json({
      success: true,
      data: {
        id,
        message: '견적서가 삭제되었습니다.',
      },
    });
  } catch (error) {
    console.error('견적서 삭제 실패:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
