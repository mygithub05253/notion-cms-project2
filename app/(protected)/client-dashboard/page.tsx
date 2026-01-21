'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/features/auth-guard';
import { useAuth } from '@/hooks/useAuth';
import { useInvoice } from '@/hooks/useInvoice';
import { InvoiceCard } from '@/components/features/invoice-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';

/**
 * 클라이언트 대시보드 페이지
 * 클라이언트가 공유받은 견적서 목록을 확인합니다
 */
export default function ClientDashboardPage() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const { invoices, isLoading, fetchInvoices } = useInvoice();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  // 페이지 진입 시 데이터 로드
  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      logout();
      toast.success('로그아웃되었습니다');
      router.push('/');
    } catch (error) {
      toast.error('로그아웃에 실패했습니다');
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return (
    <AuthGuard requiredRole="client">
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* 헤더 */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* 로고 */}
              <Link href="/client-dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold text-lg">
                  I
                </div>
                <span className="font-semibold hidden sm:inline">Invoice Web</span>
              </Link>

              {/* 사용자 정보 및 로그아웃 */}
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{currentUser?.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{currentUser?.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLogoutLoading}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">로그아웃</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* 페이지 제목 */}
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FileText className="h-8 w-8 text-emerald-600" />
                공유받은 견적서
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                관리자가 공유한 견적서를 확인하고 PDF로 다운로드합니다
              </p>
            </div>

            {/* 견적서 목록 */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-slate-200 dark:border-slate-800 animate-pulse">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">공유받은 견적서가 없습니다</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      관리자가 공유한 견적서를 기다리고 있습니다
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invoices.map((invoice) => (
                  <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="block">
                    <InvoiceCard invoice={invoice} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
