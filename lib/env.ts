/**
 * 환경 변수 검증 및 관리
 *
 * Notion API 연동에 필요한 환경 변수를 타입 안전하게 관리합니다.
 * Server Component 및 API 라우트에서만 사용해야 합니다.
 */

/**
 * Notion API 환경 변수 설정 타입
 */
export interface NotionConfig {
  /** Notion API 키 */
  apiKey: string;
  /** Notion Invoices 데이터베이스 ID */
  databaseId: string;
  /** Notion Items 데이터베이스 ID */
  itemsDatabaseId: string;
  /** Notion Shares 데이터베이스 ID (선택) */
  sharesDatabaseId?: string;
  /** Notion Users 데이터베이스 ID (선택) */
  usersDatabaseId?: string;
}

/**
 * 애플리케이션 환경 변수 설정 타입
 */
export interface AppConfig {
  /** 애플리케이션 URL */
  appUrl: string;
  /** API URL */
  apiUrl: string;
  /** JWT 비밀키 */
  jwtSecret: string;
}

/**
 * Notion API 환경 변수 검증 및 반환
 * 애플리케이션 시작 시 호출하여 필수 환경 변수 확인
 *
 * @throws {Error} 필수 환경 변수가 설정되지 않은 경우
 * @returns {NotionConfig} 검증된 환경 변수 객체
 *
 * @example
 * // Server Component 또는 API 라우트에서만 사용
 * const config = getNotionConfig();
 * console.log(config.databaseId); // Notion 데이터베이스 ID
 */
export function getNotionConfig(): NotionConfig {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;
  const itemsDatabaseId = process.env.NOTION_ITEMS_DATABASE_ID;
  const sharesDatabaseId = process.env.NOTION_SHARES_DATABASE_ID;
  const usersDatabaseId = process.env.NOTION_USERS_DATABASE_ID;

  // API 키 검증
  if (!apiKey) {
    throw new Error(
      'NOTION_API_KEY 환경 변수가 설정되지 않았습니다.\n' +
      '.env.local 파일을 확인하고 https://www.notion.so/my-integrations 에서 토큰을 발급해주세요.'
    );
  }

  // Invoices 데이터베이스 ID 검증
  if (!databaseId) {
    throw new Error(
      'NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다.\n' +
      'Invoices 데이터베이스의 URL에서 ID를 확인하여 .env.local에 추가해주세요.'
    );
  }

  // Items 데이터베이스 ID 검증
  if (!itemsDatabaseId) {
    throw new Error(
      'NOTION_ITEMS_DATABASE_ID 환경 변수가 설정되지 않았습니다.\n' +
      'Items 데이터베이스의 URL에서 ID를 확인하여 .env.local에 추가해주세요.'
    );
  }

  return {
    apiKey,
    databaseId,
    itemsDatabaseId,
    sharesDatabaseId: sharesDatabaseId || undefined,
    usersDatabaseId: usersDatabaseId || undefined,
  };
}

/**
 * 애플리케이션 환경 변수 반환
 *
 * @returns {AppConfig} 애플리케이션 설정 객체
 */
export function getAppConfig(): AppConfig {
  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  };
}

/**
 * Shares 데이터베이스 ID 반환
 *
 * @returns {string | undefined} Shares 데이터베이스 ID
 */
export function getSharesDatabaseId(): string | undefined {
  return process.env.NOTION_SHARES_DATABASE_ID || undefined;
}

/**
 * Users 데이터베이스 ID 반환
 *
 * @returns {string | undefined} Users 데이터베이스 ID
 */
export function getUsersDatabaseId(): string | undefined {
  return process.env.NOTION_USERS_DATABASE_ID || undefined;
}

/**
 * 환경 변수 유효성 검증 함수
 * 빌드 시점이나 애플리케이션 시작 시 호출하여 환경 설정 확인
 *
 * @throws {Error} 환경 변수가 유효하지 않은 경우
 *
 * @example
 * // app/layout.tsx 또는 middleware.ts에서 호출
 * validateNotionEnv();
 */
export function validateNotionEnv(): void {
  try {
    getNotionConfig();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`[Notion 환경 설정 오류] ${error.message}`);
    }
    throw error;
  }
}
