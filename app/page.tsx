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

/**
 * 로그인 폼 유효성 검사 스키마
 * Zod로 정의된 로그인 입력 형식 검증 규칙
 */
const loginSchema = z.object({
  email: z.string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z.string()
    .min(1, '비밀번호를 입력해주세요')
    .min(6, '비밀번호는 최소 6글자 이상이어야 합니다'),
});

/** 로그인 폼 데이터 타입 */
type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 로그인 페이지 컴포넌트
 * 관리자 인증을 처리하는 페이지 (F001)
 * React Hook Form + Zod를 사용하여 폼 유효성 검사 및 제출 처리
 */
export default function Home() {
  const router = useRouter();

  /**
   * React Hook Form 초기화
   * - email, password 필드와 에러 상태 관리
   * - Zod resolver를 통한 자동 유효성 검사
   * - isSubmitting으로 제출 중 상태 표시
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * 폼 제출 핸들러
   * TODO: 백엔드 API 연동
   * - POST /api/auth/login 호출
   * - 성공 시: 토스트 + 폼 초기화 + 대시보드로 이동
   * - 실패 시: 에러 토스트 표시
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      // TODO: 백엔드 API 연동
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
      // const result = await response.json();

      // 로그인 성공 토스트 (success 타입)
      toast.success('로그인 성공했습니다');
      // 폼 필드 초기화
      reset();
      // 500ms 후 대시보드로 리다이렉트
      setTimeout(() => router.push('/dashboard'), 500);
    } catch (error) {
      // 로그인 실패 토스트 (error 타입)
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
            {/* 이메일 입력 필드 및 에러 표시 */}
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
                disabled={isSubmitting}
              />
              {/* 이메일 필드 에러 메시지 및 아이콘 */}
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 비밀번호 입력 필드 및 에러 표시 */}
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
                disabled={isSubmitting}
              />
              {/* 비밀번호 필드 에러 메시지 및 아이콘 */}
              {errors.password && (
                <p id="password-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 로그인 제출 버튼 */}
            {/* 제출 중에는 disabled 상태 + aria-busy 속성으로 로딩 상태 표시 */}
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
