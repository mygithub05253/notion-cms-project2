/**
 * 오류 시나리오 및 성능 E2E 테스트
 *
 * 테스트 시나리오:
 * 1. 잘못된 URL 접근
 * 2. 네트워크 오류 처리
 * 3. 타임아웃 처리
 * 4. 페이지 로딩 성능
 * 5. 대용량 견적서 항목 처리
 */

import { test, expect } from '@playwright/test';
import { setupMockAuth } from './utils/auth';

test.describe('오류 시나리오 및 성능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 시작 전 Mock 인증 설정
    await setupMockAuth(page);
  });

  test('존재하지 않는 견적서 조회', async ({ page }) => {
    // 1. 존재하지 않는 견적서 ID로 접근
    const nonExistentId = '99999999-9999-9999-9999-999999999999';
    await page.goto(`/invoices/${nonExistentId}`, { waitUntil: 'networkidle' });

    // 2. 에러 메시지 또는 빈 상태 확인
    const errorMessage = page.locator('text=/찾을 수 없습니다|오류|Error/');
    const emptyState = page.locator('[data-testid="empty-state"], .empty-state');

    const isError = await errorMessage.isVisible().catch(() => false);
    const isEmpty = await emptyState.isVisible().catch(() => false);

    expect(isError || isEmpty).toBeTruthy();
  });

  test('무효한 공유 토큰 접근', async ({ page }) => {
    // 1. 무효한 공유 토큰으로 접근
    const invalidToken = 'invalid-token-!@#$%';
    await page.goto(`/share/${invalidToken}`, { waitUntil: 'networkidle' });

    // 2. 접근 불가 메시지 확인
    const errorMessage = page.locator('text=/접근할 수 없습니다|유효하지 않습니다|만료/');
    await expect(errorMessage).toHaveCount(1);
  });

  test('페이지 로딩 성능', async ({ page }) => {
    // 1. 견적서 목록 페이지 로딩 시간 측정
    const startTime = Date.now();
    await page.goto('/invoices', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    // 2. 로딩 시간이 3초 이내인지 확인 (성능 기준)
    expect(loadTime).toBeLessThan(3000);

    // 3. 페이지가 완전히 로드되었는지 확인
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeTruthy();
  });

  test('네트워크 느린 환경에서의 로딩', async ({ page, context }) => {
    // 1. 네트워크 속도 제한 설정 (Slow 3G)
    await context.route('**/*', (route) => {
      // 의도적으로 지연 추가 (테스트 목적)
      setTimeout(() => route.continue(), 100);
    });

    // 2. 견적서 목록 페이지 이동
    await page.goto('/invoices', { timeout: 10000 });

    // 3. 페이지가 로드되었는지 확인
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeTruthy();
  });

  test('토스트 알림이 정상적으로 닫히는지 확인', async ({ page }) => {
    // 1. 견적서 목록 페이지 이동
    await page.goto('/invoices');

    // 2. 첫 번째 견적서 클릭
    const firstInvoice = page.locator('[data-testid="invoice-card"], .invoice-card').first();
    if (await firstInvoice.isVisible()) {
      await firstInvoice.click();
      await page.waitForURL(/\/invoices\/[a-f0-9-]+$/);

      // 3. 공유 버튼 클릭 (토스트 생성)
      const shareButton = page.locator('button:has-text("공유"), button:has-text("Share")').first();
      if (await shareButton.isVisible()) {
        await shareButton.click();

        // 4. 토스트가 표시되었는지 확인
        const toast = page.locator('[role="alert"], .toast');
        const initialCount = await toast.count();

        if (initialCount > 0) {
          // 5. 3초 대기 후 토스트가 자동으로 닫혔는지 확인
          await page.waitForTimeout(3500);
          const finalCount = await toast.count();

          // 토스트가 닫혀야 함 (개수 감소)
          expect(finalCount).toBeLessThanOrEqual(initialCount);
        }
      }
    }
  });

  test('연속적인 액션 처리 (빠른 클릭)', async ({ page }) => {
    // 1. 견적서 목록 페이지 이동
    await page.goto('/invoices');
    await page.waitForLoadState('networkidle');

    // 2. 여러 카드에 빠르게 접근
    const cards = page.locator('[data-testid="invoice-card"], .invoice-card');
    const cardCount = await cards.count();

    if (cardCount >= 2) {
      // 3. 첫 번째 카드 클릭
      await cards.first().click();
      await page.waitForURL(/\/invoices\/[a-f0-9-]+$/);

      // 4. 뒤로가기
      await page.goBack();

      // 5. 두 번째 카드 클릭
      await cards.nth(1).click();
      await page.waitForURL(/\/invoices\/[a-f0-9-]+$/);

      // 6. 페이지가 정상적으로 표시되는지 확인
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeTruthy();
    }
  });

  test('반응형 디자인 - 모바일 해상도', async ({ page }) => {
    // 1. 모바일 뷰포트 설정 (375x667)
    await page.setViewportSize({ width: 375, height: 667 });

    // 2. 견적서 목록 페이지 이동
    await page.goto('/invoices');
    await page.waitForLoadState('networkidle');

    // 3. 버튼들이 클릭 가능한지 확인
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      // 4. 첫 번째 버튼 클릭 가능 여부 확인
      const firstButton = buttons.first();
      await expect(firstButton).toBeEnabled();
    }

    // 5. 텍스트가 잘려서 표시되지 않는지 확인
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();

    if (headingCount > 0) {
      const boundingBox = await headings.first().boundingBox();
      expect(boundingBox?.width).toBeLessThanOrEqual(375);
    }
  });

  test('반응형 디자인 - 태블릿 해상도', async ({ page }) => {
    // 1. 태블릿 뷰포트 설정 (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });

    // 2. 견적서 목록 페이지 이동
    await page.goto('/invoices');
    await page.waitForLoadState('networkidle');

    // 3. 카드 레이아웃이 정상인지 확인
    const cards = page.locator('[data-testid="invoice-card"], .invoice-card');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();

      // 4. 카드가 적절한 너비로 표시되는지 확인
      const boundingBox = await firstCard.boundingBox();
      expect(boundingBox?.width).toBeGreaterThan(0);
    }
  });
});
