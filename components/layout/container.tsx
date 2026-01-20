'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  /** 컨테이너 콘텐츠 */
  children: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 컨테이너 크기 (기본값: lg) */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * 컨테이너 컴포넌트
 * 모든 페이지의 콘텐츠 폭을 일관되게 제한합니다.
 * - sm: 최대 640px (작은 폼)
 * - md: 최대 896px (중간 콘텐츠)
 * - lg: 최대 1152px (기본값, 대부분의 페이지)
 * - xl: 최대 1344px (전체 데이터)
 * - full: 제한 없음 (특별한 경우)
 */
export function Container({ children, className, size = 'lg' }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',      // 640px
    md: 'max-w-3xl',      // 768px
    lg: 'max-w-4xl',      // 896px
    xl: 'max-w-5xl',      // 1024px
    full: '',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
