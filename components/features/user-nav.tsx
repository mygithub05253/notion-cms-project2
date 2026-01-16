'use client';

import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface UserNavProps {
  /** 사용자명 */
  name?: string;
  /** 이메일 */
  email?: string;
  /** 프로필 이미지 URL */
  image?: string;
  /** 로그아웃 핸들러 */
  onLogout?: () => void;
  /** 프로필 페이지 링크 */
  profileHref?: string;
  /** 설정 페이지 링크 */
  settingsHref?: string;
}

/**
 * 사용자 네비게이션 드롭다운 컴포넌트
 * 프로필, 설정, 로그아웃 등의 옵션을 제공합니다
 */
export function UserNav({
  name = 'Guest User',
  email = 'user@example.com',
  image,
  onLogout,
  profileHref = '/profile',
  settingsHref = '/settings',
}: UserNavProps) {
  // 사용자명 첫 글자로 Avatar Fallback 생성
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden flex-col items-start text-left sm:flex">
            <span className="text-sm font-medium leading-none">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href={profileHref} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>프로필</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href={settingsHref} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>설정</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
