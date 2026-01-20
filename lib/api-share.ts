/**
 * 공유 링크 API 모듈
 *
 * 견적서를 공개적으로 공유할 수 있는 링크를 생성하고 관리합니다.
 * 인증된 사용자만 링크를 생성할 수 있으며, 누구나 공유 토큰으로 공개 견적서를 조회할 수 있습니다.
 */

import type { Invoice, InvoiceShare } from '@/types';
import { API_BASE_URL, createHeaders } from '@/lib/api-config';

/**
 * 공유 링크 생성 응답 타입
 */
export interface CreateShareResponse {
  shareLink: InvoiceShare;
  publicUrl: string;
}

/**
 * 공유 링크 생성 API 함수
 *
 * 견적서를 공개적으로 공유할 수 있는 링크를 생성합니다.
 * 인증된 사용자만 호출 가능합니다 (Authorization 헤더 필수).
 *
 * @param invoiceId - 견적서 ID (UUID)
 * @param expiresAt - 링크 만료 날짜 (선택사항)
 * @returns 생성된 공유 링크 정보와 공개 URL
 * @throws {Error} 링크 생성 실패 또는 인증 오류
 *
 * @example
 * const { shareLink, publicUrl } = await createShareLinkApi('550e8400-e29b-41d4-a716-446655440000');
 * console.log(publicUrl); // 클라이언트에게 공유할 URL
 */
export async function createShareLinkApi(
  invoiceId: string,
  expiresAt?: Date
): Promise<CreateShareResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/shares`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({
        invoiceId,
        expiresAt,
      }),
    });

    // 401 Unauthorized 처리
    if (response.status === 401) {
      const { clearAuthData } = await import('@/hooks/useLocalStorage');
      clearAuthData();
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || '공유 링크 생성 실패');
      }
      throw new Error(`요청 실패 (상태 코드: ${response.status})`);
    }

    const data = await response.json();
    return data as CreateShareResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('공유 링크 생성 중 오류가 발생했습니다.');
  }
}

/**
 * 공유 토큰 검증 API 함수
 *
 * 공유 토큰의 유효성을 검증합니다.
 * 인증 불필요 (공개 API).
 *
 * @param token - 공유 토큰
 * @returns 토큰 유효 여부
 * @throws {Error} 검증 실패
 *
 * @example
 * const isValid = await validateShareTokenApi(shareToken);
 */
export async function validateShareTokenApi(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/shares/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error('토큰 검증 중 오류:', error);
    return false;
  }
}

/**
 * 공유 견적서 목록 조회 API 함수
 *
 * 공유 토큰으로 공개 견적서 목록을 조회합니다.
 * 인증 불필요 (공개 API).
 *
 * @param token - 공유 토큰
 * @returns 공개 견적서 배열
 * @throws {Error} 조회 실패 또는 만료된 토큰
 *
 * @example
 * const invoices = await getSharedInvoicesApi(shareToken);
 */
export async function getSharedInvoicesApi(token: string): Promise<Invoice[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/shares/${token}/invoices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      throw new Error('공유 링크가 존재하지 않거나 만료되었습니다.');
    }

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || '공유 견적서 조회 실패');
      }
      throw new Error(`요청 실패 (상태 코드: ${response.status})`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.invoices || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('공유 견적서 조회 중 오류가 발생했습니다.');
  }
}

/**
 * 특정 공유 견적서 조회 API 함수
 *
 * 공유 토큰과 견적서 ID로 공개 견적서를 조회합니다.
 * 인증 불필요 (공개 API).
 *
 * @param token - 공유 토큰
 * @param invoiceId - 견적서 ID (UUID)
 * @returns 공개 견적서 정보
 * @throws {Error} 조회 실패, 만료된 토큰, 또는 존재하지 않는 견적서
 *
 * @example
 * const invoice = await getSharedInvoiceApi(shareToken, invoiceId);
 */
export async function getSharedInvoiceApi(token: string, invoiceId: string): Promise<Invoice> {
  try {
    const response = await fetch(`${API_BASE_URL}/shares/${token}/invoices/${invoiceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      throw new Error('공유 링크가 존재하지 않거나 견적서를 찾을 수 없습니다.');
    }

    if (response.status === 410) {
      throw new Error('공유 링크가 만료되었습니다.');
    }

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || '공유 견적서 조회 실패');
      }
      throw new Error(`요청 실패 (상태 코드: ${response.status})`);
    }

    const data = await response.json();
    return data as Invoice;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('공유 견적서 조회 중 오류가 발생했습니다.');
  }
}

/**
 * 공유 링크 삭제 API 함수
 *
 * 생성된 공유 링크를 삭제합니다.
 * 인증된 사용자만 호출 가능합니다 (Authorization 헤더 필수).
 *
 * @param shareId - 공유 링크 ID (UUID)
 * @throws {Error} 삭제 실패, 인증 오류, 또는 권한 오류
 *
 * @example
 * await deleteShareLinkApi(shareId);
 */
export async function deleteShareLinkApi(shareId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/shares/${shareId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    // 401 Unauthorized 처리
    if (response.status === 401) {
      const { clearAuthData } = await import('@/hooks/useLocalStorage');
      clearAuthData();
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }

    if (response.status === 404) {
      throw new Error('공유 링크를 찾을 수 없습니다.');
    }

    if (response.status === 403) {
      throw new Error('이 공유 링크를 삭제할 권한이 없습니다.');
    }

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || '공유 링크 삭제 실패');
      }
      throw new Error(`요청 실패 (상태 코드: ${response.status})`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('공유 링크 삭제 중 오류가 발생했습니다.');
  }
}

/**
 * 사용자의 공유 링크 목록 조회 API 함수
 *
 * 현재 사용자가 생성한 모든 공유 링크를 조회합니다.
 * 인증된 사용자만 호출 가능합니다 (Authorization 헤더 필수).
 *
 * @returns 공유 링크 배열
 * @throws {Error} 조회 실패 또는 인증 오류
 *
 * @example
 * const shares = await getMyShareLinksApi();
 */
export async function getMyShareLinksApi(): Promise<InvoiceShare[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/shares/my`, {
      method: 'GET',
      headers: createHeaders(),
    });

    // 401 Unauthorized 처리
    if (response.status === 401) {
      const { clearAuthData } = await import('@/hooks/useLocalStorage');
      clearAuthData();
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || '공유 링크 조회 실패');
      }
      throw new Error(`요청 실패 (상태 코드: ${response.status})`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.shares || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('공유 링크 조회 중 오류가 발생했습니다.');
  }
}
