'use client';

import type { User } from '@/types';

/**
 * 로컬 스토리지 저장소 키
 */
const STORAGE_KEYS = {
  TOKEN: 'invoiceWebToken',
  USER: 'invoiceWebUser',
  CSRF_TOKEN: 'invoiceWebCSRFToken',
} as const;

/**
 * 로컬 스토리지에서 JWT 토큰을 조회합니다.
 * @returns 저장된 토큰 또는 null
 */
export const getToken = (): string | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    const token = window.localStorage.getItem(STORAGE_KEYS.TOKEN);
    return token;
  } catch (error) {
    console.error('토큰 조회 중 오류:', error);
    return null;
  }
};

/**
 * JWT 토큰을 로컬 스토리지에 저장합니다.
 * @param token - 저장할 JWT 토큰
 */
export const setToken = (token: string): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('토큰 저장 중 오류:', error);
  }
};

/**
 * 로컬 스토리지에서 저장된 사용자 정보를 조회합니다.
 * @returns 저장된 사용자 정보 또는 null
 */
export const getStoredUser = (): User | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    const userJson = window.localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) {
      return null;
    }
    const user = JSON.parse(userJson) as User;
    return user;
  } catch (error) {
    console.error('사용자 정보 조회 중 오류:', error);
    return null;
  }
};

/**
 * 사용자 정보를 로컬 스토리지에 저장합니다.
 * @param user - 저장할 사용자 정보
 */
export const setStoredUser = (user: User): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('사용자 정보 저장 중 오류:', error);
  }
};

/**
 * 로컬 스토리지에서 인증 데이터(토큰과 사용자 정보)를 모두 삭제합니다.
 */
export const clearAuthData = (): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('인증 데이터 삭제 중 오류:', error);
  }
};

/**
 * 로컬 스토리지에서 CSRF 토큰을 조회합니다.
 * @returns 저장된 CSRF 토큰 또는 null
 */
export const getCSRFToken = (): string | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    const token = window.localStorage.getItem(STORAGE_KEYS.CSRF_TOKEN);
    return token;
  } catch (error) {
    console.error('CSRF 토큰 조회 중 오류:', error);
    return null;
  }
};

/**
 * CSRF 토큰을 로컬 스토리지에 저장합니다.
 * @param token - 저장할 CSRF 토큰
 */
export const saveCSRFToken = (token: string): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.CSRF_TOKEN, token);
  } catch (error) {
    console.error('CSRF 토큰 저장 중 오류:', error);
  }
};

/**
 * 로컬 스토리지에서 CSRF 토큰을 삭제합니다.
 */
export const clearCSRFToken = (): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
  } catch (error) {
    console.error('CSRF 토큰 삭제 중 오류:', error);
  }
};
