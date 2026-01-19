import * as React from 'react';

/**
 * 사용 가능한 Lucide 아이콘 이름 타입
 */
export type IconName =
  | 'Home'
  | 'BarChart3'
  | 'FileText'
  | 'Share2'
  | 'LogOut'
  | 'Plus'
  | 'Pencil'
  | 'Trash2';

/**
 * Lucide 아이콘 컴포넌트 타입
 */
export type LucideIcon = React.ComponentType<{ className?: string }>;

/**
 * 네비게이션 메뉴 아이템 타입
 */
export interface NavItem {
  /** 메뉴 제목 */
  title: string;
  /** 라우트 경로 */
  href: string;
  /** 아이콘 컴포넌트명 (lucide-react) - IconName으로 제한 */
  icon?: IconName;
  /** 자식 메뉴 아이템 */
  items?: NavItem[];
  /** 활성 상태 */
  active?: boolean;
}

/**
 * 사용자 정보 타입
 * PRD: User 데이터 모델
 */
export interface User {
  /** 사용자 ID (UUID) */
  id: string;
  /** 이메일 주소 */
  email: string;
  /** 사용자명 */
  name: string;
  /** 프로필 이미지 URL */
  image?: string;
  /** 사용자 역할 */
  role: 'admin' | 'client';
  /** 계정 생성 날짜 */
  createdAt: Date;
  /** 계정 수정 날짜 */
  updatedAt: Date;
}

/**
 * 견적서 상태 타입
 */
export type InvoiceStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

/**
 * 견적서 항목 타입
 * PRD: InvoiceItem 데이터 모델
 * Notion Items 데이터베이스와 매핑
 */
export interface InvoiceItem {
  /** 항목 ID (UUID) */
  id: string;
  /** 소속 견적서 ID */
  invoiceId: string;
  /** 항목 제목 (Notion Title 필드) */
  title: string;
  /** 카테고리 (Notion Category 필드) */
  category?: string;
  /** 항목 설명 (상품/서비스명) */
  description: string;
  /** 수량 */
  quantity: number;
  /** 단위 (예: 개, 시간, 일 - Notion Unit 필드) */
  unit: string;
  /** 단가 */
  unitPrice: number;
  /** 소계 (수량 × 단가) */
  subtotal: number;
  /** 표시 순서 */
  displayOrder: number;
}

/**
 * 견적서 타입
 * PRD: Invoice 데이터 모델
 */
export interface Invoice {
  /** 견적서 ID (UUID) */
  id: string;
  /** 견적서 제목 */
  title: string;
  /** 견적서 설명 */
  description?: string;
  /** 발급한 관리자 ID */
  createdBy: string;
  /** 클라이언트 이름 */
  clientName: string;
  /** 클라이언트 이메일 */
  clientEmail?: string;
  /** 견적서 상태 */
  status: InvoiceStatus;
  /** 총액 */
  totalAmount: number;
  /** 견적서 항목 배열 */
  items: InvoiceItem[];
  /** 생성 날짜 */
  createdAt: Date;
  /** 수정 날짜 */
  updatedAt: Date;
}

/**
 * 공유 링크 타입
 * PRD: InvoiceShare 데이터 모델
 */
export interface InvoiceShare {
  /** 공유 링크 ID (UUID) */
  id: string;
  /** 공유되는 견적서 ID */
  invoiceId: string;
  /** 공유 토큰 (고유) */
  token: string;
  /** 만료 날짜 (nullable) */
  expiresAt?: Date;
  /** 생성 날짜 */
  createdAt: Date;
}

/**
 * 애플리케이션 설정 타입
 */
export interface AppConfig {
  /** 앱 이름 */
  appName: string;
  /** 앱 설명 */
  appDescription: string;
  /** 기본 URL */
  baseUrl: string;
}

/**
 * UI 상태 타입
 */
export interface UIState {
  /** 사이드바 열림/닫힘 상태 */
  sidebarOpen: boolean;
  /** 모바일 메뉴 열림/닫힘 상태 */
  mobileMenuOpen: boolean;
}

/**
 * 인증 상태 타입
 */
export interface AuthState {
  /** 현재 로그인한 사용자 */
  currentUser: User | null;
  /** 인증 여부 */
  isAuthenticated: boolean;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

/**
 * 견적서 상태 타입
 */
export interface InvoiceState {
  /** 견적서 목록 */
  invoices: Invoice[];
  /** 선택된 견적서 */
  selectedInvoice: Invoice | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}
