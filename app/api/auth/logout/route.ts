/**
 * POST /api/auth/logout
 * 로그아웃 API
 *
 * 응답 (성공 - 200):
 * {
 *   "success": true,
 *   "message": "로그아웃되었습니다."
 * }
 */

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { success: true, message: '로그아웃되었습니다.' },
    { status: 200 }
  );
}
