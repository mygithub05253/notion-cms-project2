import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  /** 자식 요소 */
  children: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 컨테이너 컴포넌트
 * 콘텐츠를 중앙 정렬하고 최대 너비를 제한합니다
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}
