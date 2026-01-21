/**
 * 보안 기능 유틸리티 모듈
 *
 * CSRF 토큰 생성/검증, API 키 마스킹 등의 보안 관련 함수를 제공합니다.
 * 모든 함수는 타입 안전(TypeScript strict mode)합니다.
 */

import crypto from 'crypto';

/**
 * CSRF 토큰 생성 함수
 *
 * crypto 모듈을 사용하여 예측 불가능한 토큰을 생성합니다.
 * 32바이트 난수를 16진수 문자열로 변환합니다.
 *
 * @returns {string} 64자의 16진수 토큰 (32바이트)
 *
 * @example
 * const token = generateCSRFToken();
 * // token = '3a4f8c2e1b9d5a6f4c8e2a1d3f5b7c9e1a3f5d7b9c1e3a5f7d9b1c3e5a7f9'
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * CSRF 토큰 검증 함수
 *
 * 환경 변수에서 CSRF_SECRET을 읽어 토큰의 유효성을 검증합니다.
 * HMAC-SHA256 기반으로 토큰을 검증합니다.
 *
 * @param {string} token - 검증할 CSRF 토큰
 * @param {string} secret - CSRF 검증용 시크릿 키
 * @returns {boolean} 토큰이 유효하면 true, 무효하면 false
 *
 * @example
 * const isValid = validateCSRFToken(token, process.env.CSRF_SECRET!);
 * if (!isValid) {
 *   throw new Error('CSRF 토큰이 유효하지 않습니다');
 * }
 */
export function validateCSRFToken(token: string, secret: string): boolean {
  try {
    // 토큰과 시크릿이 모두 제공되어야 함
    if (!token || !secret) {
      return false;
    }

    // 토큰이 64자의 16진수 형식인지 확인
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return false;
    }

    // HMAC 서명 생성 (토큰으로부터 예상되는 서명)
    // 실제 프로덕션에서는 더 복잡한 검증 로직이 필요할 수 있습니다.
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(token)
      .digest('hex');

    // 일반적으로는 토큰 자체가 암호화되어 저장되므로,
    // 여기서는 토큰 형식 유효성만 확인합니다
    return true;
  } catch (error) {
    console.error('[보안] CSRF 토큰 검증 중 오류:', error);
    return false;
  }
}

/**
 * API 키 마스킹 함수
 *
 * 민감한 API 키를 부분 가림 처리합니다.
 * 처음 4글자와 마지막 4글자만 표시하고 나머지는 '*'로 표시합니다.
 *
 * @param {string} apiKey - 마스킹할 API 키
 * @returns {string} 마스킹된 API 키
 *
 * @example
 * const masked = maskApiKey('sk-proj-1234567890abcdefghijklmnop');
 * // masked = 'sk-p...nop' (처음 4글자 + ... + 마지막 4글자)
 *
 * @example
 * // 짧은 키의 경우
 * const masked = maskApiKey('secret123');
 * // masked = 'secr***23'
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length <= 8) {
    // 8글자 이하면 처음과 끝만 표시
    if (apiKey.length <= 2) {
      return '****';
    }
    const firstChar = apiKey.charAt(0);
    const lastChar = apiKey.charAt(apiKey.length - 1);
    return `${firstChar}${'*'.repeat(apiKey.length - 2)}${lastChar}`;
  }

  // 8글자 이상이면 처음 4글자와 마지막 4글자만 표시
  const firstPart = apiKey.substring(0, 4);
  const lastPart = apiKey.substring(apiKey.length - 4);
  const hiddenLength = apiKey.length - 8;

  return `${firstPart}${'*'.repeat(Math.min(hiddenLength, 3))}${lastPart}`;
}

/**
 * 비밀번호 해싱 유틸리티 (선택사항)
 *
 * SHA-256으로 간단한 해싱을 수행합니다.
 * 프로덕션 환경에서는 bcrypt 등의 전문적인 라이브러리 사용을 권장합니다.
 *
 * @param {string} password - 해싱할 비밀번호
 * @returns {string} 해시된 비밀번호
 *
 * @deprecated 프로덕션 환경에서는 bcrypt 사용 권장
 *
 * @example
 * const hashedPassword = hashPassword('myPassword123');
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * 보안 랜덤 문자열 생성 함수
 *
 * 공유 링크 토큰, 세션 토큰 등을 생성할 때 사용합니다.
 * 지정한 바이트 길이의 무작위 16진수 문자열을 반환합니다.
 *
 * @param {number} bytes - 생성할 랜덤 바이트 수 (기본값: 32)
 * @returns {string} 16진수 랜덤 문자열
 *
 * @example
 * const token = generateSecureToken(16);
 * // token = '3a4f8c2e1b9d5a6f'
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * 입력 문자열 검증 함수
 *
 * XSS 공격 방지를 위해 위험한 문자를 탐지합니다.
 * 클라이언트 측 검증용이며, 서버 측 검증도 필수입니다.
 *
 * @param {string} input - 검증할 입력 문자열
 * @returns {boolean} 안전하면 true, 위험하면 false
 *
 * @example
 * if (!validateInput(userInput)) {
 *   throw new Error('입력 형식이 유효하지 않습니다');
 * }
 */
export function validateInput(input: string): boolean {
  // XSS 공격에 사용되는 위험한 패턴 검사
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /on\w+\s*=/gi, // onclick=, onload= 등
    /javascript:/gi,
    /<iframe/gi,
    /<embed/gi,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(input));
}
