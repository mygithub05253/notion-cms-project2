'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Lock, Share2, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';

/**
 * 홈 페이지 (랜딩 페이지)
 * 클라이언트와 관리자를 위한 진입점
 * - 관리자: 로그인하여 견적서 관리
 * - 클라이언트: 공유 링크로 견적서 조회
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* 헤더 */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <Container className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
              I
            </div>
            <span>Invoice Web</span>
          </div>
        </Container>
      </header>

      {/* 메인 콘텐츠 */}
      <Container className="flex items-center justify-center min-h-[calc(100vh-64px)] py-16">
        <div className="w-full max-w-4xl">
          {/* 타이틀 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-50 dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
              디지털 견적서 관리
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              관리자와 클라이언트 간의 견적서 관리를 간편하게 해보세요
            </p>
          </div>

          {/* 카드 그리드 */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* 관리자 카드 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card via-card to-slate-50 dark:to-slate-900/50 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-transparent group-hover:from-blue-500/10 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl">관리자</CardTitle>
                <CardDescription className="text-base">
                  견적서를 생성하고 관리합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>새로운 견적서 작성</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>견적서 수정 및 삭제</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>공유 링크 생성</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>PDF 다운로드</span>
                  </li>
                </ul>
                <Link href="/auth/login" className="block">
                  <Button className="w-full mt-6 gap-2 group/btn">
                    로그인하기
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 클라이언트 카드 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card via-card to-slate-50 dark:to-slate-900/50 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-transparent group-hover:from-green-500/10 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Share2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl">클라이언트</CardTitle>
                <CardDescription className="text-base">
                  공유된 견적서를 조회합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                    <span>공유 링크로 접근</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                    <span>견적서 내용 조회</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                    <span>PDF 다운로드</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                    <span>인증 불필요</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-6 gap-2 group/btn"
                  disabled
                >
                  <FileText className="h-4 w-4" />
                  공유 링크를 통해 접근
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  관리자가 공유한 링크로 직접 접근하세요
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 안내 텍스트 */}
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 via-blue-50 to-purple-50 dark:from-blue-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">클라이언트는 어떻게 접근하나요?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    관리자가 견적서를 작성한 후, &quot;공유 링크 생성&quot;을 통해 만든 고유 URL을 클라이언트에게 공유하면, 클라이언트는 로그인 없이 해당 링크로 견적서를 확인할 수 있습니다.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    예: <code className="bg-black/10 dark:bg-white/10 px-2 py-1 rounded text-xs font-mono">https://example.com/share/abc123/invoices</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  );
}
