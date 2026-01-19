'use client';

import { Button } from '@/components/ui/button';
import { LucideIcon } from '@/types/index';
import { cn } from '@/lib/utils';

/**
 * EmptyState 컴포넌트
 * 데이터가 없을 때 표시할 상태 화면
 */

interface EmptyStateProps {
  /** Lucide 아이콘 컴포넌트 */
  icon: LucideIcon;
  /** 제목 텍스트 */
  title: string;
  /** 설명 텍스트 */
  description: string;
  /** 액션 버튼 레이블 (선택사항) */
  actionLabel?: string;
  /** 액션 버튼 클릭 핸들러 (선택사항) */
  onAction?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {/* 아이콘 */}
      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-muted p-3">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* 제목 */}
      <h3 className="text-lg font-semibold">{title}</h3>

      {/* 설명 */}
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>

      {/* 액션 버튼 */}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
