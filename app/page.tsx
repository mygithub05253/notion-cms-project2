'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

/**
 * 홈 페이지 (로그인 페이지)
 * 관리자 인증 (F001)
 */

const loginSchema = z.object({
  email: z.string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z.string()
    .min(1, '비밀번호를 입력해주세요')
    .min(6, '비밀번호는 최소 6글자 이상이어야 합니다'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Home() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // TODO: 백엔드 API 연동
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
      // const result = await response.json();

      toast.success('로그인 성공했습니다');
      // 폼 초기화
      reset();
      // 대시보드로 이동
      setTimeout(() => router.push('/dashboard'), 500);
    } catch (error) {
      toast.error('로그인 실패했습니다');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Invoice Web</CardTitle>
          <CardDescription className="text-base">
            관리자 로그인
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 이메일 입력 필드 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...register('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 비밀번호 입력 필드 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호 입력"
                {...register('password')}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={errors.password ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              className="w-full mt-6"
              size="lg"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? '로그인 중...' : '로그인하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
