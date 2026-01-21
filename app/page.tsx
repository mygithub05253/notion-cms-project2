'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import {
  FileText,
  Share2,
  Download,
  Lock,
  Users,
  ChevronRight,
  Zap,
} from 'lucide-react';

/**
 * 랜딩 페이지 (홈 페이지)
 * Invoice Web MVP의 소개 및 온보딩 페이지
 * 인증되지 않은 사용자를 위한 진입점
 */

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  // 이미 로그인한 사용자 처리
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'admin') {
        router.push('/dashboard');
      } else if (currentUser.role === 'client') {
        router.push('/client-dashboard');
      }
    }
  }, [isAuthenticated, currentUser, router]);

  // 로딩 중이면 아무것도 표시하지 않음
  if (isLoading) {
    return null;
  }

  // 로그인한 사용자는 렌더링하지 않음
  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg">
                I
              </div>
              <span className="text-xl font-bold">Invoice Web</span>
            </div>

            {/* 네비게이션 */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                기능
              </a>
              <a href="#benefits" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                장점
              </a>
            </nav>

            {/* 버튼 */}
            <Link href="/login">
              <Button size="sm">
                로그인
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 왼쪽: 텍스트 */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              견적서 관리를{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                쉽게
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              노션에서 관리하는 견적서를 클라이언트가 웹으로 확인하고 PDF로 다운로드할 수 있는
              디지털 플랫폼입니다.
            </p>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login" className="flex-1 sm:flex-none">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  시작하기
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                자세히 알아보기 →
              </button>
            </div>
          </div>

          {/* 오른쪽: 일러스트레이션 */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl blur-3xl" />
            <Card className="relative border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-4">
                  {/* 샘플 견적서 카드 */}
                  <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">견적서 #001</span>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">공유됨</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      웹 디자인 서비스
                    </p>
                    <p className="text-sm font-bold">₩500,000</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-slate-50 dark:from-emerald-900/20 dark:to-slate-900/20 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">견적서 #002</span>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">초안</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      모바일 앱 개발
                    </p>
                    <p className="text-sm font-bold">₩2,000,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-slate-200 dark:border-slate-800 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">핵심 기능</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              모든 견적서 관리 작업을 한 곳에서 처리하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 기능 카드 1 */}
            <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle>견적서 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  견적서를 작성하고, 수정하고, 관리합니다. 직관적인 폼과 자동 계산으로 시간을
                  절약하세요.
                </p>
              </CardContent>
            </Card>

            {/* 기능 카드 2 */}
            <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 mb-4">
                  <Share2 className="h-6 w-6" />
                </div>
                <CardTitle>공유 링크</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  한 번의 클릭으로 클라이언트에게 견적서를 공유합니다. 공유 링크로 쉽게 접근할 수
                  있습니다.
                </p>
              </CardContent>
            </Card>

            {/* 기능 카드 3 */}
            <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mb-4">
                  <Download className="h-6 w-6" />
                </div>
                <CardTitle>PDF 다운로드</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  견적서를 PDF로 다운로드하여 저장하고 인쇄합니다. 전문적인 포맷으로 제공됩니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="border-t border-slate-200 dark:border-slate-800 py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">왜 Invoice Web을 선택할까요?</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              더 빠르고, 더 쉽고, 더 전문적으로
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">빠른 시작</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  복잡한 설정 없이 바로 견적서를 작성할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">안전한 공유</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  고유한 토큰으로 안전하게 클라이언트에게 공유합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">클라이언트 친화적</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  클라이언트는 별도 회원가입 없이 공유 링크로 접근합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">전문적인 형식</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  모든 견적서는 전문적인 레이아웃으로 표시됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">지금 시작하세요</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            견적서 관리를 간단하게 만들어보세요. 관리자로 로그인하여 첫 견적서를 작성합니다.
          </p>

          <Link href="/login">
            <Button size="lg" className="gap-2">
              로그인하기
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-xs">
                I
              </div>
              <span className="text-sm font-medium">Invoice Web</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              © 2026 Invoice Web. 모든 권리 보유.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
