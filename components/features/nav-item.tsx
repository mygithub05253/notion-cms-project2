'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem as NavItemType, LucideIcon } from '@/types';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface NavItemProps extends NavItemType {
  /** 사이드바 축소 여부 */
  collapsed?: boolean;
}

/**
 * Lucide 아이콘 컴포넌트 가져오기
 * 타입 안전성을 위해 런타임 검증 포함
 */
function getIconComponent(iconName?: string): LucideIcon | null {
  if (!iconName) return null;

  const icon = Icons[iconName as keyof typeof Icons] as LucideIcon | undefined;

  if (!icon) {
    console.warn(`[NavItem] Icon "${iconName}" not found in lucide-react`);
    return null;
  }

  return icon;
}

/**
 * 네비게이션 아이템 컴포넌트
 * Sidebar에서 메뉴 아이템을 렌더링합니다
 */
export function NavItem({
  title,
  href,
  icon,
  collapsed = false,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const IconComponent = getIconComponent(icon);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        collapsed && 'justify-center'
      )}
      title={title}
    >
      {IconComponent && <IconComponent className="h-5 w-5 flex-shrink-0" />}
      {!collapsed && <span>{title}</span>}
    </Link>
  );
}
