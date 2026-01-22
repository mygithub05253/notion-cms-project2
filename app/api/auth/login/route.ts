/**
 * POST /api/auth/login
 * 관리자 로그인 API
 *
 * 요청:
 * {
 *   "email": "admin@example.com",
 *   "password": "password123"
 * }
 *
 * 응답 (성공 - 200):
 * {
 *   "token": "eyJhbGc...",
 *   "user": {
 *     "id": "abc123",
 *     "email": "admin@example.com",
 *     "name": "관리자",
 *     "role": "admin",
 *     "createdAt": "2024-01-01T00:00:00Z",
 *     "updatedAt": "2024-01-01T00:00:00Z"
 *   }
 * }
 *
 * 응답 (실패 - 401):
 * {
 *   "success": false,
 *   "error": "이메일 또는 비밀번호가 올바르지 않습니다."
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/services/users';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 필수 필드 검증
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    // 사용자 인증
    const user = await authenticateUser(body.email, body.password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 관리자 역할 확인
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // JWT 토큰 생성
    const token = generateToken(user);

    return NextResponse.json({ token, user }, { status: 200 });
  } catch (error) {
    console.error('관리자 로그인 실패:', error);
    return NextResponse.json(
      { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
