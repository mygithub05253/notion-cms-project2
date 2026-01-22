/**
 * GET /api/auth/me
 * 현재 인증된 사용자 정보 조회 API
 *
 * 요청 헤더:
 * Authorization: Bearer [JWT_TOKEN]
 *
 * 응답 (성공 - 200):
 * {
 *   "id": "abc123",
 *   "email": "admin@example.com",
 *   "name": "관리자",
 *   "role": "admin",
 *   "createdAt": "2024-01-01T00:00:00Z",
 *   "updatedAt": "2024-01-01T00:00:00Z"
 * }
 *
 * 응답 (실패 - 401):
 * {
 *   "success": false,
 *   "error": "인증 토큰이 필요합니다."
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { getUserById } from '@/lib/services/users';

export async function GET(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    // "Bearer " 부분을 제거하고 토큰만 추출
    const token = authHeader.substring(7);

    // 토큰 검증
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // 토큰에서 추출한 사용자 ID로 Notion에서 최신 정보 조회
    const user = await getUserById(payload.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    return NextResponse.json(
      { success: false, error: '사용자 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
