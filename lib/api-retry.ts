/**
 * API 호출 재시도 로직
 * exponential backoff를 사용한 안정적인 재시도 메커니즘
 */

import {
  ApiError,
  TimeoutError,
  NetworkError,
  ApiErrorCode,
  NotionApiError,
} from './api-errors';

/**
 * 재시도 설정
 */
export interface RetryConfig {
  /** 최대 재시도 횟수 */
  maxRetries?: number;
  /** 초기 재시도 간격 (ms) */
  initialDelay?: number;
  /** 최대 재시도 간격 (ms) */
  maxDelay?: number;
  /** 지수 (exponential backoff) */
  backoffMultiplier?: number;
  /** 타임아웃 (ms) */
  timeout?: number;
}

/**
 * 기본 재시도 설정
 */
const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000, // 1초
  maxDelay: 10000, // 10초
  backoffMultiplier: 2,
  timeout: 10000, // 10초
};

/**
 * Exponential backoff를 사용한 재시도 간격 계산
 *
 * @example
 * // 1차 재시도: 1000ms
 * // 2차 재시도: 2000ms
 * // 3차 재시도: 4000ms
 */
function calculateDelay(
  attempt: number,
  config: Required<RetryConfig>
): number {
  const delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  return Math.min(delay, config.maxDelay);
}

/**
 * 재시도 가능한 에러인지 확인
 *
 * 일부 에러는 재시도해도 실패하므로 (예: 4xx 에러)
 * 재시도 가능한 경우만 true를 반환합니다.
 */
function isRetryable(error: unknown): boolean {
  // 네트워크 에러는 재시도 가능
  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return true;
  }

  // API 에러인 경우 상태 코드 확인
  if (error instanceof ApiError) {
    const statusCode = error.statusCode;
    if (!statusCode) return true;

    // 5xx 에러는 재시도 가능
    if (statusCode >= 500) return true;

    // 429 (Too Many Requests)는 재시도 가능
    if (statusCode === 429) return true;

    // 408 (Request Timeout)은 재시도 가능
    if (statusCode === 408) return true;

    // 그 외 4xx 에러는 재시도 불가
    return false;
  }

  return true;
}

/**
 * 재시도 로직이 포함된 API 호출 함수
 *
 * @template T - API 응답 타입
 * @param fn - 실행할 비동기 함수
 * @param config - 재시도 설정
 * @returns API 응답
 *
 * @example
 * const data = await withRetry(
 *   () => fetch('/api/invoices'),
 *   { maxRetries: 3 }
 * );
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config?: RetryConfig
): Promise<T> {
  const mergedConfig: Required<RetryConfig> = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= mergedConfig.maxRetries + 1; attempt++) {
    try {
      // 타임아웃 처리
      return await Promise.race([
        fn(),
        new Promise<T>((_, reject) =>
          setTimeout(
            () => reject(new TimeoutError()),
            mergedConfig.timeout
          )
        ),
      ]);
    } catch (error) {
      lastError = error;

      // 마지막 시도인 경우 에러 발생
      if (attempt > mergedConfig.maxRetries) {
        throw error;
      }

      // 재시도 불가능한 에러인 경우 즉시 실패
      if (!isRetryable(error)) {
        throw error;
      }

      // 재시도 간격 계산 및 대기
      const delay = calculateDelay(attempt, mergedConfig);
      console.warn(
        `API 호출 실패 (${attempt}/${mergedConfig.maxRetries}): ${delay}ms 후 재시도...`,
        error
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Notion API 호출을 위한 특화된 재시도 함수
 *
 * Notion API의 특성(rate limiting, timeout)을 고려한 설정
 */
export async function withNotionRetry<T>(
  fn: () => Promise<T>,
  config?: RetryConfig
): Promise<T> {
  return withRetry(fn, {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    timeout: 15000, // Notion API는 좀 더 긴 타임아웃
    ...config,
  });
}

/**
 * 빠른 재시도를 위한 함수 (3회, 짧은 간격)
 *
 * 로컬 API 등 빠르게 응답해야 하는 경우 사용
 */
export async function withFastRetry<T>(
  fn: () => Promise<T>,
  config?: RetryConfig
): Promise<T> {
  return withRetry(fn, {
    maxRetries: 2,
    initialDelay: 200,
    maxDelay: 1000,
    backoffMultiplier: 2,
    timeout: 5000,
    ...config,
  });
}
