/**
 * API 에러 타입 정의
 * 다양한 에러 상황을 타입 안전하게 처리
 */

/**
 * API 에러 코드
 */
export enum ApiErrorCode {
  // 요청 에러
  INVALID_INPUT = 'INVALID_INPUT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // 인증 에러
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // 리소스 에러
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  CONFLICT = 'CONFLICT',

  // Notion API 에러
  NOTION_API_ERROR = 'NOTION_API_ERROR',
  NOTION_RATE_LIMIT = 'NOTION_RATE_LIMIT',
  NOTION_TIMEOUT = 'NOTION_TIMEOUT',
  NOTION_CONNECTION_ERROR = 'NOTION_CONNECTION_ERROR',

  // 서버 에러
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // 네트워크 에러
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',

  // 기타 에러
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    public message: string,
    public statusCode?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Notion API 에러
 */
export class NotionApiError extends ApiError {
  constructor(
    message: string,
    statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(ApiErrorCode.NOTION_API_ERROR, message, statusCode, details);
    this.name = 'NotionApiError';
  }
}

/**
 * 네트워크 타임아웃 에러
 */
export class TimeoutError extends ApiError {
  constructor(message: string = '요청이 시간 초과되었습니다') {
    super(ApiErrorCode.TIMEOUT, message);
    this.name = 'TimeoutError';
  }
}

/**
 * 네트워크 연결 에러
 */
export class NetworkError extends ApiError {
  constructor(message: string = '네트워크 연결이 실패했습니다') {
    super(ApiErrorCode.NETWORK_ERROR, message);
    this.name = 'NetworkError';
  }
}

/**
 * 검증 에러
 */
export class ValidationError extends ApiError {
  constructor(
    message: string,
    details?: Record<string, unknown>
  ) {
    super(ApiErrorCode.VALIDATION_ERROR, message, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * 에러 메시지 매핑
 * 에러 코드를 사용자 친화적인 메시지로 변환
 */
export const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  [ApiErrorCode.INVALID_INPUT]: '입력값이 올바르지 않습니다',
  [ApiErrorCode.VALIDATION_ERROR]: '데이터 검증에 실패했습니다',
  [ApiErrorCode.UNAUTHORIZED]: '인증이 필요합니다',
  [ApiErrorCode.FORBIDDEN]: '접근 권한이 없습니다',
  [ApiErrorCode.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다',
  [ApiErrorCode.RESOURCE_NOT_FOUND]: '리소스를 찾을 수 없습니다',
  [ApiErrorCode.CONFLICT]: '요청이 충돌합니다',
  [ApiErrorCode.NOTION_API_ERROR]: 'Notion API 에러가 발생했습니다',
  [ApiErrorCode.NOTION_RATE_LIMIT]: '요청 제한을 초과했습니다. 잠시 후 다시 시도하세요',
  [ApiErrorCode.NOTION_TIMEOUT]: 'Notion 요청이 시간 초과되었습니다',
  [ApiErrorCode.NOTION_CONNECTION_ERROR]: 'Notion 연결에 실패했습니다',
  [ApiErrorCode.INTERNAL_ERROR]: '서버 오류가 발생했습니다',
  [ApiErrorCode.SERVICE_UNAVAILABLE]: '서비스를 이용할 수 없습니다. 잠시 후 다시 시도하세요',
  [ApiErrorCode.NETWORK_ERROR]: '인터넷 연결을 확인하세요',
  [ApiErrorCode.TIMEOUT]: '요청이 너무 오래 걸립니다. 다시 시도하세요',
  [ApiErrorCode.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다',
};

/**
 * 에러로부터 사용자 친화적 메시지 추출
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return ERROR_MESSAGES[error.code] || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return ERROR_MESSAGES[ApiErrorCode.UNKNOWN_ERROR];
}
