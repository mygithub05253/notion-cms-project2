'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Users, Lock } from 'lucide-react';

/**
 * 로그인 분기 페이지
 * 관리자 로그인과 클라이언트 로그인 중 선택
 */
export default function LoginBranchPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // 이미 로그인한 사용자는 대시보드로 리디렉션
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-2xl">
                I
              </div>
            </div>
            <h1 className="text-3xl font-bold">Invoice Web</h1>
            <p className="text-slate-600 dark:text-slate-400">
              로그인 유형을 선택해주세요
            </p>
          </div>

          {/* 로그인 옵션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 관리자 로그인 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    <Lock className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl">관리자 로그인</CardTitle>
                  <CardDescription>
                    견적서를 발급하고 관리합니다
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    계정으로 로그인하여 견적서 작성, 수정, 삭제 및 공유 기능을 이용할 수 있습니다.
                  </p>
                  <Link href="/login/admin" className="block">
                    <Button className="w-full gap-2" size="lg">
                      <Lock className="h-4 w-4" />
                      관리자로 로그인
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 클라이언트 로그인 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl">클라이언트 로그인</CardTitle>
                  <CardDescription>
                    공유받은 견적서를 확인합니다
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    이메일로 로그인하여 관리자가 공유한 견적서를 확인하고 PDF로 다운로드할 수 있습니다.
                  </p>
                  <Link href="/login/client" className="block">
                    <Button className="w-full gap-2" size="lg" variant="outline">
                      <Users className="h-4 w-4" />
                      클라이언트로 로그인
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 하단 안내 */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              테스트 계정: admin@example.com / password123
            </p>
            <p className="text-xs text-muted-foreground">
              클라이언트: client@example.com / password123
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
