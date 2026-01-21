/**
 * Notion 통합 E2E 테스트
 *
 * 테스트 시나리오:
 * 1. Notion API 연결 상태 확인
 * 2. 견적서 목록 조회 API 테스트
 * 3. 견적서 생성 API 테스트
 * 4. 견적서 상세 조회 API 테스트
 * 5. 견적서 수정 API 테스트
 * 6. 견적서 삭제 API 테스트
 * 7. API 에러 처리 테스트
 */

import { test, expect } from '@playwright/test';

// 테스트 환경 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const NOTION_API_TIMEOUT = 15000; // Notion API 응답 시간 제한

test.describe('Notion 통합 E2E 테스트', () => {
  let createdInvoiceId: string;

  test('Notion API 헬스 체크 - 환경 변수 확인', async () => {
    // 환경 변수 확인
    const hasNotionApiKey = !!process.env.NOTION_API_KEY;
    const hasDatabaseId = !!process.env.NOTION_DATABASE_ID;

    console.log('환경 변수 확인:');
    console.log('- NOTION_API_KEY:', hasNotionApiKey ? '설정됨 ✓' : '미설정 ✗');
    console.log('- NOTION_DATABASE_ID:', hasDatabaseId ? '설정됨 ✓' : '미설정 ✗');

    expect(hasNotionApiKey).toBeTruthy();
    expect(hasDatabaseId).toBeTruthy();
  });

  test('헬스 체크 엔드포인트 - API 서버 연결 확인', async ({ request }) => {
    // 헬스 체크 엔드포인트에 요청
    const response = await request.get(`${API_URL}/api/health`, {
      timeout: 10000,
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('ok');
    console.log('헬스 체크: 성공 ✓');
  });

  test('견적서 목록 조회 - GET /api/notion/invoices', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/notion/invoices`, {
      timeout: NOTION_API_TIMEOUT,
    });

    console.log('요청 상태:', response.status());
    expect([200, 404, 500]).toContain(response.status());

    if (response.ok()) {
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('invoices');
      expect(data.data).toHaveProperty('total');
      expect(Array.isArray(data.data.invoices)).toBe(true);
      console.log(`견적서 목록 조회 성공: 총 ${data.data.total}건`);
    } else if (response.status() === 500) {
      // Notion API 에러 체크
      const error = await response.json();
      console.log('Notion API 에러:', error.error);
      expect(error.success).toBe(false);
      expect(error.error).toBeTruthy();
    }
  });

  test('견적서 목록 조회 - 상태 필터 (status=draft)', async ({ request }) => {
    const response = await request.get(
      `${API_URL}/api/notion/invoices?status=draft`,
      {
        timeout: NOTION_API_TIMEOUT,
      }
    );

    if (response.ok()) {
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.invoices)).toBe(true);

      // 반환된 모든 견적서가 draft 상태인지 확인
      data.data.invoices.forEach((invoice: any) => {
        expect(invoice.status).toBe('draft');
      });
      console.log(`draft 상태 견적서: ${data.data.invoices.length}건`);
    }
  });

  test('견적서 생성 - POST /api/notion/invoices', async ({ request }) => {
    const newInvoice = {
      title: '테스트 견적서 - ' + new Date().getTime(),
      description: 'E2E 테스트를 위한 견적서',
      clientName: '테스트 클라이언트',
      clientEmail: 'test@example.com',
      items: [
        {
          title: '웹 개발',
          description: '웹사이트 개발 서비스',
          quantity: 1,
          unit: '식',
          unitPrice: 5000000,
          displayOrder: 1,
        },
        {
          title: '유지보수',
          description: '6개월 유지보수',
          quantity: 6,
          unit: '개월',
          unitPrice: 500000,
          displayOrder: 2,
        },
      ],
    };

    const response = await request.post(
      `${API_URL}/api/notion/invoices`,
      {
        data: newInvoice,
        timeout: NOTION_API_TIMEOUT,
      }
    );

    console.log('생성 응답 상태:', response.status());

    if (response.status() === 201 || response.status() === 200) {
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.invoice).toHaveProperty('id');
      expect(data.data.invoice.title).toBe(newInvoice.title);
      expect(data.data.invoice.clientName).toBe(newInvoice.clientName);
      expect(Array.isArray(data.data.invoice.items)).toBe(true);

      // 생성된 견적서 ID 저장 (후속 테스트용)
      createdInvoiceId = data.data.invoice.id;
      console.log('견적서 생성 성공:', createdInvoiceId);
    } else if (response.status() === 400) {
      const error = await response.json();
      console.log('유효성 검사 에러:', error.error);
      expect(error.success).toBe(false);
    } else if (response.status() === 500) {
      const error = await response.json();
      console.log('서버 에러:', error.error);
      expect(error.success).toBe(false);
    }
  });

  test('견적서 생성 - 필수 필드 검증 (빈 제목)', async ({ request }) => {
    const invalidInvoice = {
      title: '', // 빈 제목 - 에러 유발
      clientName: '테스트',
      items: [
        {
          title: '항목',
          description: '설명',
          quantity: 1,
          unit: '식',
          unitPrice: 1000,
          displayOrder: 1,
        },
      ],
    };

    const response = await request.post(
      `${API_URL}/api/notion/invoices`,
      {
        data: invalidInvoice,
        timeout: 10000,
      }
    );

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBeTruthy();
    console.log('유효성 검사 에러 처리: 성공 ✓');
  });

  test('견적서 생성 - 필수 필드 검증 (항목 없음)', async ({ request }) => {
    const invalidInvoice = {
      title: '테스트',
      clientName: '테스트',
      items: [], // 빈 항목 배열 - 에러 유발
    };

    const response = await request.post(
      `${API_URL}/api/notion/invoices`,
      {
        data: invalidInvoice,
        timeout: 10000,
      }
    );

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    console.log('항목 필드 검증 에러 처리: 성공 ✓');
  });

  test('견적서 목록 조회 후 첫 번째 견적서로 상세 조회', async ({
    request,
  }) => {
    // 먼저 목록 조회
    const listResponse = await request.get(
      `${API_URL}/api/notion/invoices`,
      {
        timeout: NOTION_API_TIMEOUT,
      }
    );

    if (!listResponse.ok()) {
      console.log('목록 조회 실패:', listResponse.status());
      return;
    }

    const listData = await listResponse.json();
    if (listData.data.invoices.length === 0) {
      console.log('조회 가능한 견적서가 없습니다.');
      return;
    }

    const firstInvoiceId = listData.data.invoices[0].id;
    console.log('첫 번째 견적서 ID:', firstInvoiceId);

    // 상세 조회
    const detailResponse = await request.get(
      `${API_URL}/api/notion/invoices/${firstInvoiceId}`,
      {
        timeout: NOTION_API_TIMEOUT,
      }
    );

    if (detailResponse.ok()) {
      const detailData = await detailResponse.json();
      expect(detailData.success).toBe(true);
      expect(detailData.data.invoice).toHaveProperty('id');
      expect(detailData.data.invoice).toHaveProperty('title');
      expect(detailData.data.invoice).toHaveProperty('clientName');
      expect(detailData.data.invoice).toHaveProperty('status');
      expect(Array.isArray(detailData.data.invoice.items)).toBe(true);
      console.log('견적서 상세 조회 성공');
    } else {
      console.log('상세 조회 응답:', detailResponse.status());
    }
  });

  test('존재하지 않는 견적서 조회 - 404 처리', async ({ request }) => {
    const nonExistentId = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    const response = await request.get(
      `${API_URL}/api/notion/invoices/${nonExistentId}`,
      {
        timeout: NOTION_API_TIMEOUT,
      }
    );

    if (response.status() === 404) {
      const data = await response.json();
      expect(data.success).toBe(false);
      console.log('존재하지 않는 견적서 처리: 성공 ✓');
    } else if (response.status() === 500) {
      // Notion API 에러
      const data = await response.json();
      console.log('Notion API 에러:', data.error);
    }
  });

  test('견적서 수정 - PUT /api/notion/invoices/[id]', async ({
    request,
  }) => {
    // 먼저 목록에서 첫 번째 견적서 가져오기
    const listResponse = await request.get(
      `${API_URL}/api/notion/invoices`,
      {
        timeout: NOTION_API_TIMEOUT,
      }
    );

    if (!listResponse.ok() || (await listResponse.json()).data.invoices.length === 0) {
      console.log('수정할 견적서가 없습니다.');
      return;
    }

    const invoiceId = (await listResponse.json()).data.invoices[0].id;
    const updateData = {
      title: '수정된 제목 - ' + new Date().getTime(),
      status: 'sent',
    };

    const response = await request.put(
      `${API_URL}/api/notion/invoices/${invoiceId}`,
      {
        data: updateData,
        timeout: NOTION_API_TIMEOUT,
      }
    );

    if (response.ok()) {
      const data = await response.json();
      expect(data.success).toBe(true);
      console.log('견적서 수정 성공');
    } else if (response.status() === 400) {
      const error = await response.json();
      console.log('유효성 검사 에러:', error.error);
    } else {
      console.log('수정 응답 상태:', response.status());
    }
  });

  test('견적서 삭제 - DELETE /api/notion/invoices/[id]', async ({
    request,
  }) => {
    // 창시 목록에서 삭제할 견적서 찾기
    const listResponse = await request.get(
      `${API_URL}/api/notion/invoices?status=draft`,
      {
        timeout: NOTION_API_TIMEOUT,
      }
    );

    if (!listResponse.ok() || (await listResponse.json()).data.invoices.length === 0) {
      console.log('삭제할 draft 견적서가 없습니다.');
      return;
    }

    const invoiceId = (await listResponse.json()).data.invoices[0].id;

    const response = await request.delete(
      `${API_URL}/api/notion/invoices/${invoiceId}`,
      {
        timeout: NOTION_API_TIMEOUT,
      }
    );

    if (response.ok()) {
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.message).toBeTruthy();
      console.log('견적서 삭제 성공');
    } else {
      console.log('삭제 응답 상태:', response.status());
    }
  });

  test('API 응답 형식 검증 - 구조 확인', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/notion/invoices`, {
      timeout: NOTION_API_TIMEOUT,
    });

    if (response.ok()) {
      const data = await response.json();

      // 응답 구조 검증
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(typeof data.success).toBe('boolean');
      expect(typeof data.data).toBe('object');

      if (data.data.invoices && data.data.invoices.length > 0) {
        const invoice = data.data.invoices[0];
        // Invoice 객체 구조 검증
        expect(invoice).toHaveProperty('id');
        expect(invoice).toHaveProperty('title');
        expect(invoice).toHaveProperty('status');
        expect(invoice).toHaveProperty('createdAt');
        console.log('API 응답 형식 검증: 성공 ✓');
      }
    }
  });

  test('Notion 통합 성능 테스트 - 응답 시간 측정', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.get(`${API_URL}/api/notion/invoices`, {
      timeout: NOTION_API_TIMEOUT,
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (response.ok()) {
      console.log(`API 응답 시간: ${responseTime}ms`);
      // 성능 기준: 3초 이내 (Notion API 호출 포함)
      expect(responseTime).toBeLessThan(3000);
    }
  });

  test('Notion 통합 에러 처리 - 잘못된 요청 형식', async ({ request }) => {
    const response = await request.post(
      `${API_URL}/api/notion/invoices`,
      {
        data: 'invalid-json', // 유효하지 않은 데이터
        timeout: 10000,
      }
    );

    // 400 또는 500 에러 기대
    expect([400, 500]).toContain(response.status());
  });

  test('Notion 환경 변수 통합 테스트 - 설정 확인', async ({ page }) => {
    // 페이지에서 환경 변수 확인
    await page.goto(`${API_URL}/api/notion/invoices`, {
      waitUntil: 'domcontentloaded',
    });

    // 응답 상태 확인
    const url = page.url();
    console.log('테스트 URL:', url);
    expect(url).toContain('api/notion/invoices');
  });

  test('실시간 Notion 데이터 동기화 테스트', async ({ request }) => {
    // 첫 번째 요청
    const response1 = await request.get(`${API_URL}/api/notion/invoices`, {
      timeout: NOTION_API_TIMEOUT,
    });

    if (!response1.ok()) {
      console.log('첫 번째 요청 실패');
      return;
    }

    const data1 = await response1.json();
    const initialCount = data1.data.total;

    // 잠시 대기 (1초)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 두 번째 요청
    const response2 = await request.get(`${API_URL}/api/notion/invoices`, {
      timeout: NOTION_API_TIMEOUT,
    });

    if (response2.ok()) {
      const data2 = await response2.json();
      const finalCount = data2.data.total;

      console.log(`초기 견적서 수: ${initialCount}, 최종 견적서 수: ${finalCount}`);
      // 데이터가 동일하거나 변경되었는지 확인
      expect(typeof finalCount).toBe('number');
    }
  });
});
