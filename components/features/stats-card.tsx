'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from '@/types/index';
import { cn } from '@/lib/utils';

/**
 * StatsCard 컴포넌트
 * 통계 정보를 카드 형식으로 표시
 * 아이콘 + 라벨 + 숫자로 구성
 */

interface StatsCardProps {
  /** Lucide 아이콘 컴포넌트 */
  icon: LucideIcon;
  /** 통계 라벨 */
  label: string;
  /** 표시할 숫자 */
  value: number;
  /** 아이콘 색상 클래스 (opacity 포함) */
  iconColor?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  iconColor = 'text-blue-600 opacity-70',
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {/* 아이콘 */}
        <Icon className={cn('h-8 w-8', iconColor)} />
      </CardHeader>
      <CardContent>
        {/* 숫자 */}
        <div
          className="text-3xl font-bold"
          aria-label={`${label} ${value}개`}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
