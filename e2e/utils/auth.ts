/**
 * 테스트용 인증 유틸리티
 *
 * Mock 인증 정보를 사용하여 테스트에서 로그인 상태를 설정합니다.
 */

import { Page } from '@playwright/test';

/**
 * Mock 사용자 정보
 */
export const mockUser = {
  email: 'admin@example.com',
  password: 'password123',
  name: '관리자',
  id: 'user-001',
};

/**
 * 테스트용 Mock 토큰
 */
export const generateMockToken = (): string => {
  return `mock-token-${Date.now()}`;
};

/**
 * localStorage에 인증 정보 설정 (Mock)
 *
 * @param page Playwright Page 객체
 * @param token 인증 토큰
 */
export async function setupMockAuth(page: Page, token: string = generateMockToken()): Promise<void> {
  await page.evaluate(({ token: authToken, user }) => {
    localStorage.setItem('auth-token', authToken);
    localStorage.setItem('auth-user', JSON.stringify(user));
  }, { token, user: mockUser });
}

/**
 * localStorage에서 인증 정보 제거
 *
 * @param page Playwright Page 객체
 */
export async function clearMockAuth(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  });
}

/**
 * 페이지가 인증된 상태인지 확인
 *
 * @param page Playwright Page 객체
 * @returns 인증 여부
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const token = await page.evaluate(() => localStorage.getItem('auth-token'));
  return !!token;
}
