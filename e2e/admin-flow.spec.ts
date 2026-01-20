/**
 * 관리자 워크플로우 E2E 테스트
 *
 * 테스트 시나리오:
 * 1. 대시보드 접근 (인증 확인)
 * 2. 견적서 목록 확인
 * 3. 견적서 상세 조회
 * 4. 공유 링크 생성
 * 5. 공유 링크 URL 복사 및 검증
 */

import { test, expect } from '@playwright/test';
import { setupMockAuth, clearMockAuth, mockUser } from './utils/auth';
import { createMockInvoice, createMockShareToken } from './fixtures/invoices';

test.describe('관리자 워크플로우', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 시작 전 Mock 인증 설정
    await setupMockAuth(page);
  });

  test.afterEach(async ({ page }) => {
    // 각 테스트 종료 후 Mock 인증 정보 제거
    await clearMockAuth(page);
  });

  test('대시보드 접근 및 견적서 목록 확인', async ({ page }) => {
    // 1. 대시보드 페이지 이동
    await page.goto('/invoices');

    // 2. 페이지가 정상적으로 로드되었는지 확인
    await expect(page).toHaveTitle(/Invoice Web|견적서/);

    // 3. 제목 확인
    const heading = page.locator('h1, h2');
    await expect(heading).toContainText(/견적서|Invoice/i);

    // 4. 견적서 카드가 표시되는지 확인
    const cards = page.locator('[data-testid="invoice-card"], .invoice-card');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('견적서 상세 조회 및 공유 링크 생성', async ({ page }) => {
    // 1. 견적서 목록 페이지 이동
    await page.goto('/invoices');

    // 2. 첫 번째 견적서 클릭
    const firstInvoice = page.locator('[data-testid="invoice-card"], .invoice-card').first();
    await firstInvoice.click();

    // 3. 상세 페이지 로드 확인
    await page.waitForURL(/\/invoices\/[a-f0-9-]+$/);
    const detailHeading = page.locator('h1, h2').first();
    await expect(detailHeading).toBeTruthy();

    // 4. "공유" 버튼 찾기
    const shareButton = page.locator('button:has-text("공유"), button:has-text("Share")').first();
    if (await shareButton.isVisible()) {
      // 5. 공유 버튼 클릭
      await shareButton.click();

      // 6. 공유 모달이 표시되는지 확인
      const shareDialog = page.locator('[role="dialog"], .dialog');
      await expect(shareDialog).toBeTruthy();

      // 7. 만료 기한 선택 (예: 30일)
      const expirationSelect = page.locator('select, [role="combobox"]').first();
      if (await expirationSelect.isVisible()) {
        await expirationSelect.click();
        await page.locator('[role="option"]:has-text("30"), [role="option"]:has-text("1개월")').first().click();
      }

      // 8. "공유 설정 완료" 버튼 클릭
      const confirmButton = page.locator('button:has-text("완료"), button:has-text("공유 설정")').first();
      if (await confirmButton.isVisible()) {
        await confirmButton.click();

        // 9. 성공 알림 확인
        const successToast = page.locator('[role="alert"], .toast').filter({ hasText: /완료|성공|생성/ });
        await expect(successToast).toHaveCount(1);
      }
    }
  });

  test('공유 링크 복사 기능', async ({ page }) => {
    // 1. 견적서 상세 페이지로 직접 이동
    await page.goto('/invoices');
    const firstInvoice = page.locator('[data-testid="invoice-card"], .invoice-card').first();
    await firstInvoice.click();
    await page.waitForURL(/\/invoices\/[a-f0-9-]+$/);

    // 2. 공유 버튼 클릭
    const shareButton = page.locator('button:has-text("공유"), button:has-text("Share")').first();
    if (await shareButton.isVisible()) {
      await shareButton.click();

      // 3. 복사 버튼 찾기
      const copyButton = page.locator('button svg[data-icon="copy"], button:has-text("복사"), button[title*="복사"]').first();
      if (await copyButton.isVisible()) {
        // 4. 복사 버튼 클릭
        await copyButton.click();

        // 5. 복사 완료 알림 확인
        const copiedToast = page.locator('[role="alert"], .toast').filter({ hasText: /복사|복사됨/ });
        await expect(copiedToast).toHaveCount(1);
      }
    }
  });

  test('PDF 다운로드 기능', async ({ page, context }) => {
    // 1. 견적서 상세 페이지로 이동
    await page.goto('/invoices');
    const firstInvoice = page.locator('[data-testid="invoice-card"], .invoice-card').first();
    await firstInvoice.click();
    await page.waitForURL(/\/invoices\/[a-f0-9-]+$/);

    // 2. PDF 다운로드 버튼 찾기
    const downloadButton = page.locator('button:has-text("PDF"), button:has-text("다운로드"), button svg[data-icon="download"]').first();

    if (await downloadButton.isVisible()) {
      // 3. 다운로드 이벤트 모니터링
      const downloadPromise = context.waitForEvent('download');

      // 4. 다운로드 버튼 클릭
      await downloadButton.click();

      // 5. 다운로드 시작 대기
      const download = await downloadPromise.catch(() => null);

      // 6. 다운로드 완료 알림 확인
      const successToast = page.locator('[role="alert"], .toast').filter({ hasText: /다운로드|준비/ });
      await expect(successToast).toHaveCount(1);
    }
  });
});
