/**
 * Notion Users 서비스
 * Users 데이터베이스에서 사용자 정보를 조회하고 인증합니다
 */

import { getNotionConfig } from '@/lib/env';
import type { User } from '@/types';

/**
 * 사용자 인증 함수
 * 이메일과 비밀번호로 Notion Users 데이터베이스에서 사용자를 검색하고 인증합니다
 *
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호 (평문)
 * @returns 인증 성공 시 User 객체, 실패 시 null
 * @throws {Error} NOTION_USERS_DATABASE_ID가 설정되지 않은 경우
 *
 * @example
 * const user = await authenticateUser('admin@example.com', 'password123');
 * if (user) {
 *   console.log(`로그인 성공: ${user.name} (${user.role})`);
 * } else {
 *   console.log('인증 실패');
 * }
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const config = getNotionConfig();

  // Notion Users 데이터베이스 ID 확인
  if (!config.usersDatabaseId) {
    throw new Error('NOTION_USERS_DATABASE_ID가 설정되지 않았습니다.');
  }

  try {
    // Notion REST API를 사용하여 Users 데이터베이스 쿼리
    const response = await fetch(
      `https://api.notion.com/v1/databases/${config.usersDatabaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Notion-Version': '2024-06-15',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'Email',
            email: {
              equals: email,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Notion API 오류: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const userPage = data.results[0];
    const properties = userPage.properties;

    // Notion 속성에서 데이터 추출
    const storedPassword = properties.Password?.rich_text?.[0]?.plain_text;
    const role = properties.Role?.select?.name || 'client';
    const name = properties.Name?.title?.[0]?.plain_text;

    // 비밀번호 검증 (평문 비교 - MVP 단계)
    // TODO: 프로덕션에서는 bcrypt를 사용하여 해시된 비밀번호와 비교할 것
    if (storedPassword !== password) {
      return null;
    }

    // 사용자 정보 반환
    return {
      id: userPage.id,
      email,
      name: name || email,
      role: role as 'admin' | 'client',
      createdAt: new Date(userPage.created_time),
      updatedAt: new Date(userPage.last_edited_time),
    };
  } catch (error) {
    console.error('사용자 인증 중 오류:', error);
    throw error;
  }
}

/**
 * 사용자 ID로 사용자 정보 조회 함수
 *
 * @param userId - Notion 페이지 ID
 * @returns User 객체, 찾지 못한 경우 null
 *
 * @example
 * const user = await getUserById('abc123def456');
 */
export async function getUserById(userId: string): Promise<User | null> {
  const config = getNotionConfig();

  try {
    // Notion REST API를 사용하여 페이지 정보 조회
    const response = await fetch(`https://api.notion.com/v1/pages/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Notion-Version': '2024-06-15',
      },
    });

    if (!response.ok) {
      console.warn(`사용자 정보 조회 실패 (ID: ${userId}, 상태: ${response.status})`);
      return null;
    }

    const page = await response.json();
    const properties = page.properties;

    // 속성에서 데이터 추출
    const email = properties.Email?.email;
    const role = properties.Role?.select?.name || 'client';
    const name = properties.Name?.title?.[0]?.plain_text;

    // 이메일이 없으면 유효하지 않은 사용자
    if (!email) {
      return null;
    }

    return {
      id: page.id,
      email,
      name: name || email,
      role: role as 'admin' | 'client',
      createdAt: new Date(page.created_time),
      updatedAt: new Date(page.last_edited_time),
    };
  } catch (error) {
    // 페이지를 찾지 못했거나 기타 오류 발생
    console.error(`사용자 정보 조회 중 오류 (ID: ${userId}):`, error);
    return null;
  }
}
