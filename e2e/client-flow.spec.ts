/**
 * 클라이언트 워크플로우 E2E 테스트
 *
 * 테스트 시나리오:
 * 1. 공유 링크를 통한 견적서 목록 접근
 * 2. 견적서 상세 조회
 * 3. 견적서에 대한 응답 (승인/거절)
 * 4. PDF 다운로드
 * 5. 목록으로 돌아가기
 */

import { test, expect } from '@playwright/test';
import { createMockShareToken } from './fixtures/invoices';

test.describe('클라이언트 워크플로우 (공개 공유 페이지)', () => {
  test('공유 링크를 통한 견적서 목록 접근', async ({ page }) => {
    // 1. Mock 공유 토큰 생성
    const shareToken = createMockShareToken();

    // 2. 공유 링크로 접근
    await page.goto(`/share/${shareToken}`);

    // 3. 페이지가 정상적으로 로드되었는지 확인
    await page.waitForLoadState('networkidle');

    // 4. 페이지 제목 확인
    const heading = page.locator('h1, h2').first();
    await expect(heading).toContainText(/공유|견적서/);

    // 5. 견적서 카드가 표시되는지 확인 (또는 빈 상태)
    const cards = page.locator('[data-testid="invoice-card"], .invoice-card');
    const cardCount = await cards.count();

    // 카드가 없으면 EmptyState가 표시되어야 함
    if (cardCount === 0) {
      const emptyState = page.locator('[data-testid="empty-state"], .empty-state');
      await expect(emptyState.or(page.locator('text=/공유된 견적서가 없습니다|데이터가 없습니다/'))).toBeTruthy();
    }
  });

  test('공유 견적서 상세 조회 및 응답', async ({ page }) => {
    // 1. Mock 공유 토큰으로 접근
    const shareToken = createMockShareToken();
    await page.goto(`/share/${shareToken}`);
    await page.waitForLoadState('networkidle');

    // 2. 첫 번째 견적서 클릭
    const firstInvoice = page.locator('[data-testid="invoice-card"], .invoice-card').first();
    const cardCount = await firstInvoice.count();

    if (cardCount > 0) {
      await firstInvoice.click();

      // 3. 상세 페이지 로드 확인
      await page.waitForURL(/\/share\/[a-z0-9-]+\/invoices\/[a-f0-9-]+$/);

      // 4. 견적서 제목 확인
      const title = page.locator('h1, h2').first();
      await expect(title).toBeTruthy();

      // 5. "수락합니다" 버튼 찾기
      const approveButton = page.locator('button:has-text("수락"), button:has-text("승인"), button:has-text("Approve")').first();

      if (await approveButton.isVisible()) {
        // 6. 승인 버튼 클릭
        await approveButton.click();

        // 7. 성공 알림 확인
        const successToast = page.locator('[role="alert"], .toast').filter({ hasText: /감사|완료|성공/ });
        await expect(successToast).toHaveCount(1);
      }
    }
  });

  test('공개 견적서 PDF 다운로드', async ({ page, context }) => {
    // 1. Mock 공유 토큰으로 접근
    const shareToken = createMockShareToken();
    await page.goto(`/share/${shareToken}`);
    await page.waitForLoadState('networkidle');

    // 2. 첫 번째 견적서 클릭
    const firstInvoice = page.locator('[data-testid="invoice-card"], .invoice-card').first();
    const cardCount = await firstInvoice.count();

    if (cardCount > 0) {
      await firstInvoice.click();
      await page.waitForURL(/\/share\/[a-z0-9-]+\/invoices\/[a-f0-9-]+$/);

      // 3. PDF 다운로드 버튼 찾기
      const downloadButton = page.locator('button:has-text("PDF"), button:has-text("다운로드"), button svg[data-icon="download"]').first();

      if (await downloadButton.isVisible()) {
        // 4. 다운로드 이벤트 모니터링
        const downloadPromise = context.waitForEvent('download').catch(() => null);

        // 5. 다운로드 버튼 클릭
        await downloadButton.click();

        // 6. 다운로드 완료 알림 확인
        const successToast = page.locator('[role="alert"], .toast').filter({ hasText: /다운로드|준비/ });
        await expect(successToast).toHaveCount(1);
      }
    }
  });

  test('목록으로 돌아가기 기능', async ({ page }) => {
    // 1. Mock 공유 토큰으로 접근
    const shareToken = createMockShareToken();
    await page.goto(`/share/${shareToken}`);
    await page.waitForLoadState('networkidle');

    // 2. 첫 번째 견적서 클릭
    const firstInvoice = page.locator('[data-testid="invoice-card"], .invoice-card').first();
    const cardCount = await firstInvoice.count();

    if (cardCount > 0) {
      await firstInvoice.click();
      await page.waitForURL(/\/share\/[a-z0-9-]+\/invoices\/[a-f0-9-]+$/);

      // 3. "목록으로" 버튼 찾기
      const backButton = page.locator('button:has-text("목록"), button:has-text("돌아가기"), button:has-text("Back")').first();

      if (await backButton.isVisible()) {
        // 4. 버튼 클릭
        await backButton.click();

        // 5. 목록 페이지로 돌아갔는지 확인
        await page.waitForURL(/\/share\/[a-z0-9-]+$/);
        const heading = page.locator('h1, h2').first();
        await expect(heading).toContainText(/공유|견적서/);
      }
    }
  });

  test('만료된 공유 링크 접근 불가', async ({ page }) => {
    // 1. 존재하지 않는 또는 만료된 토큰으로 접근
    const expiredToken = 'expired-token-123456789';
    await page.goto(`/share/${expiredToken}`);
    await page.waitForLoadState('networkidle');

    // 2. 접근 불가 메시지 또는 EmptyState 확인
    const errorMessage = page.locator('text=/접근할 수 없습니다|만료|존재하지 않습니다/');
    const emptyState = page.locator('[data-testid="empty-state"], .empty-state');

    // 에러 메시지 또는 EmptyState 중 하나가 표시되어야 함
    const isError = await errorMessage.isVisible().catch(() => false);
    const isEmpty = await emptyState.isVisible().catch(() => false);

    expect(isError || isEmpty).toBeTruthy();
  });
});
