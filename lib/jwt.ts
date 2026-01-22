/**
 * JWT 토큰 생성 및 검증 유틸리티
 * Notion Users 데이터베이스 인증에 사용
 */

import jwt from 'jsonwebtoken';
import { getAppConfig } from '@/lib/env';
import type { User } from '@/types';

/**
 * JWT 토큰 페이로드 인터페이스
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'client';
}

/**
 * JWT 토큰 생성 함수
 *
 * @param user - 토큰에 포함될 사용자 정보
 * @returns 서명된 JWT 토큰 (7일 유효)
 *
 * @example
 * const token = generateToken({ id: '123', email: 'user@example.com', role: 'client' });
 */
export function generateToken(user: User): string {
  const config = getAppConfig();

  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d',
  });
}

/**
 * JWT 토큰 검증 함수
 *
 * @param token - 검증할 JWT 토큰
 * @returns 토큰이 유효한 경우 페이로드, 유효하지 않은 경우 null
 *
 * @example
 * const payload = verifyToken(token);
 * if (payload) {
 *   console.log(payload.userId, payload.role);
 * }
 */
export function verifyToken(token: string): JWTPayload | null {
  const config = getAppConfig();

  try {
    return jwt.verify(token, config.jwtSecret) as JWTPayload;
  } catch (error) {
    // 토큰 검증 실패 (만료, 서명 오류 등)
    return null;
  }
}
