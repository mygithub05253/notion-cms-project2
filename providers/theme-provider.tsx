'use client';

import { ThemeProvider as NextThemesProvider, ThemeProviderProps as NextThemesProviderProps } from 'next-themes';
import { ReactNode } from 'react';

interface ThemeProviderProps extends Omit<NextThemesProviderProps, 'children'> {
  children: ReactNode;
}

/**
 * 테마 제공자 컴포넌트
 * next-themes를 사용하여 다크모드 기능 제공
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
