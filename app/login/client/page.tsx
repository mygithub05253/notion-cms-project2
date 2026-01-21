'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

/**
 * 클라이언트 로그인 페이지
 * 클라이언트가 이메일로 로그인하여 공유받은 견적서를 확인합니다
 */

// 클라이언트 로그인 폼 검증 스키마
const clientLoginSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력하세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
});

type ClientLoginFormData = z.infer<typeof clientLoginSchema>;

export default function ClientLoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, isLoading, currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미 로그인한 사용자 처리
  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'client') {
      // 클라이언트 사용자는 클라이언트 대시보드로 리디렉션
      router.push('/client-dashboard');
    } else if (isAuthenticated && currentUser?.role === 'admin') {
      // 관리자 사용자는 일반 대시보드로 리디렉션
      router.push('/dashboard');
    }
  }, [isAuthenticated, currentUser, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientLoginFormData>({
    resolver: zodResolver(clientLoginSchema),
  });

  const onSubmit = async (data: ClientLoginFormData) => {
    setIsSubmitting(true);
    try {
      // useAuthStore의 login 액션 호출
      await login(data.email, data.password);

      // 성공 토스트
      toast.success('클라이언트 로그인 성공했습니다!');

      // 클라이언트 대시보드로 리디렉션
      router.push('/client-dashboard');
    } catch (error) {
      // 에러 토스트
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중이면 아무것도 표시하지 않음
  if (isLoading) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          {/* 뒤로가기 버튼 */}
          <Link href="/login" className="inline-block">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              뒤로가기
            </Button>
          </Link>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-2 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold text-lg">
                  I
                </div>
              </div>
              <CardTitle className="text-2xl">클라이언트 로그인</CardTitle>
              <CardDescription>공유받은 견적서를 확인하세요</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* 이메일 필드 */}
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    placeholder="client@example.com"
                    type="email"
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* 비밀번호 필드 */}
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    {...register('password')}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.password && (
                    <p id="password-error" className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* 로그인 버튼 */}
                <Button
                  type="submit"
                  className="w-full gap-2 mt-6"
                  disabled={isSubmitting}
                >
                  <Users className="h-4 w-4" />
                  {isSubmitting ? '로그인 중...' : '로그인'}
                </Button>
              </form>

              {/* 안내 텍스트 */}
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs text-emerald-900 dark:text-emerald-300">
                  <strong>테스트 계정:</strong> client@example.com / password123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
