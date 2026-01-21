'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray, Controller, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container } from '@/components/layout/container';
import { cn } from '@/lib/utils';
import { useCallback, useMemo } from 'react';

/**
 * 견적서 폼 컴포넌트
 * 생성 및 수정 페이지에서 공통으로 사용
 */

// Zod 스키마 정의
export const invoiceSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100글자 이하여야 합니다'),
  description: z
    .string()
    .max(500, '설명은 500글자 이하여야 합니다')
    .optional()
    .or(z.literal('')),
  clientName: z
    .string()
    .min(1, '클라이언트명을 입력해주세요')
    .max(50, '클라이언트명은 50글자 이하여야 합니다'),
  clientEmail: z
    .string()
    .email('유효한 이메일을 입력해주세요')
    .optional()
    .or(z.literal('')),
  items: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, '항목명을 입력해주세요'),
        description: z
          .string()
          .min(1, '항목 설명을 입력해주세요'),
        quantity: z
          .number()
          .min(1, '수량은 1 이상이어야 합니다'),
        unit: z
          .string()
          .min(1, '단위를 입력해주세요'),
        unitPrice: z
          .number()
          .min(0, '단가는 0 이상이어야 합니다'),
        subtotal: z.number(),
      })
    )
    .min(1, '최소 1개 항목이 필요합니다'),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  /** 폼 제목 */
  title: string;
  /** 폼 부제목 */
  subtitle: string;
  /** React Hook Form 반환값 */
  form: UseFormReturn<InvoiceFormData>;
  /** 제출 버튼 클릭 핸들러 */
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  /** 취소 버튼 클릭 핸들러 */
  onCancel: () => void;
  /** 삭제 버튼 표시 여부 (편집 모드) */
  showDeleteButton?: boolean;
  /** 삭제 버튼 클릭 핸들러 (편집 모드) */
  onDelete?: () => void;
  /** 제출 버튼 텍스트 (기본값: "저장") */
  submitText?: string;
  /** 삭제 버튼 로딩 상태 */
  isDeleting?: boolean;
}

// 포맷팅 함수
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value);
};

export function InvoiceForm({
  title,
  subtitle,
  form,
  onSubmit,
  onCancel,
  showDeleteButton = false,
  onDelete,
  submitText = '저장',
  isDeleting = false,
}: InvoiceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // 모든 항목 감시 (금액 계산용)
  const items = watch('items');

  // 총액 계산 - useMemo로 캐싱
  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
  }, [items]);

  // 항목 추가 콜백 - useCallback으로 안정화
  const handleAddItem = useCallback(() => {
    append({
      title: '',
      description: '',
      quantity: 1,
      unit: '개',
      unitPrice: 0,
      subtotal: 0,
    });
  }, [append]);

  // 항목 제거 콜백 - useCallback으로 안정화
  const handleRemoveItem = useCallback((index: number) => {
    remove(index);
  }, [remove]);

  return (
    <Container className="flex flex-1 flex-col gap-8 py-8">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">{title}</h1>
        <p className="text-base text-muted-foreground">{subtitle}</p>
      </div>

      {/* 견적서 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 섹션 1: 기본 정보 */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-card via-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* 제목 필드 */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">
                제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="예: 2025년 1월 A 프로젝트"
                {...register('title')}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
                className={errors.title ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.title && (
                <p id="title-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* 설명 필드 */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">
                설명 <span className="text-muted-foreground">(선택)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="견적서 관련 추가 설명을 입력하세요"
                {...register('description')}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
                className={errors.description ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.description && (
                <p id="description-error" className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* 클라이언트 정보 - 그리드 2열 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 클라이언트명 */}
              <div className="space-y-2">
                <Label htmlFor="clientName" className="font-medium">
                  클라이언트명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clientName"
                  type="text"
                  placeholder="예: 홍길동"
                  {...register('clientName')}
                  aria-invalid={!!errors.clientName}
                  aria-describedby={errors.clientName ? 'clientName-error' : undefined}
                  className={errors.clientName ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.clientName && (
                  <p id="clientName-error" className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {errors.clientName.message}
                  </p>
                )}
              </div>

              {/* 클라이언트 이메일 */}
              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="font-medium">
                  클라이언트 이메일 <span className="text-muted-foreground">(선택)</span>
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="예: client@company.com"
                  {...register('clientEmail')}
                  aria-invalid={!!errors.clientEmail}
                  aria-describedby={errors.clientEmail ? 'clientEmail-error' : undefined}
                  className={errors.clientEmail ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.clientEmail && (
                  <p id="clientEmail-error" className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {errors.clientEmail.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 섹션 2: 견적서 항목 */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-card via-card to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-border/50">
            <CardTitle className="text-lg font-semibold">견적서 항목</CardTitle>
            <Button
              type="button"
              onClick={handleAddItem}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              항목 추가
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {fields.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                항목을 추가해주세요
              </p>
            )}

            {fields.map((field, index) => {
              const itemQuantity = watch(`items.${index}.quantity`);
              const itemPrice = watch(`items.${index}.unitPrice`);
              const itemSubtotal = itemQuantity * itemPrice;

              return (
                <div
                  key={field.id}
                  className="relative rounded-lg border border-border/60 bg-gradient-to-br from-muted/40 via-card to-muted/20 p-6 sm:p-8 space-y-6 hover:border-border/100 transition-colors duration-200"
                >
                  {/* 항목 번호 및 삭제 버튼 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`항목 ${index + 1} 삭제`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* 항목 필드들 - 반응형 그리드 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {/* 제목 */}
                    <div className="md:col-span-1 lg:col-span-2 space-y-2">
                      <Label
                        htmlFor={`items.${index}.title`}
                        className="text-xs font-medium"
                      >
                        항목명
                      </Label>
                      <Input
                        id={`items.${index}.title`}
                        type="text"
                        placeholder="예: 웹사이트 개발"
                        {...register(`items.${index}.title`)}
                        aria-invalid={!!errors.items?.[index]?.title}
                        aria-describedby={
                          errors.items?.[index]?.title
                            ? `items.${index}.title-error`
                            : undefined
                        }
                        className={
                          errors.items?.[index]?.title
                            ? 'border-red-500 focus:ring-red-500 text-sm'
                            : 'text-sm'
                        }
                      />
                      {errors.items?.[index]?.title && (
                        <p
                          id={`items.${index}.title-error`}
                          className="text-xs text-red-500"
                        >
                          {errors.items[index]?.title?.message}
                        </p>
                      )}
                    </div>

                    {/* 설명 */}
                    <div className="md:col-span-2 lg:col-span-2 space-y-2">
                      <Label
                        htmlFor={`items.${index}.description`}
                        className="text-xs font-medium"
                      >
                        설명
                      </Label>
                      <Input
                        id={`items.${index}.description`}
                        type="text"
                        placeholder="예: 반응형 웹사이트 개발 (5페이지)"
                        {...register(`items.${index}.description`)}
                        aria-invalid={!!errors.items?.[index]?.description}
                        aria-describedby={
                          errors.items?.[index]?.description
                            ? `items.${index}.description-error`
                            : undefined
                        }
                        className={
                          errors.items?.[index]?.description
                            ? 'border-red-500 focus:ring-red-500 text-sm'
                            : 'text-sm'
                        }
                      />
                      {errors.items?.[index]?.description && (
                        <p
                          id={`items.${index}.description-error`}
                          className="text-xs text-red-500"
                        >
                          {errors.items[index]?.description?.message}
                        </p>
                      )}
                    </div>

                    {/* 수량 */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`items.${index}.quantity`}
                        className="text-xs font-medium"
                      >
                        수량
                      </Label>
                      <Controller
                        control={control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`items.${index}.quantity`}
                            type="number"
                            min="1"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            aria-invalid={!!errors.items?.[index]?.quantity}
                            aria-describedby={
                              errors.items?.[index]?.quantity
                                ? `items.${index}.quantity-error`
                                : undefined
                            }
                            className={
                              errors.items?.[index]?.quantity
                                ? 'border-red-500 focus:ring-red-500 text-sm'
                                : 'text-sm'
                            }
                          />
                        )}
                      />
                      {errors.items?.[index]?.quantity && (
                        <p
                          id={`items.${index}.quantity-error`}
                          className="text-xs text-red-500"
                        >
                          {errors.items[index]?.quantity?.message}
                        </p>
                      )}
                    </div>

                    {/* 단위 */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`items.${index}.unit`}
                        className="text-xs font-medium"
                      >
                        단위
                      </Label>
                      <Input
                        id={`items.${index}.unit`}
                        type="text"
                        placeholder="개"
                        {...register(`items.${index}.unit`)}
                        aria-invalid={!!errors.items?.[index]?.unit}
                        aria-describedby={
                          errors.items?.[index]?.unit
                            ? `items.${index}.unit-error`
                            : undefined
                        }
                        className={
                          errors.items?.[index]?.unit
                            ? 'border-red-500 focus:ring-red-500 text-sm'
                            : 'text-sm'
                        }
                      />
                      {errors.items?.[index]?.unit && (
                        <p
                          id={`items.${index}.unit-error`}
                          className="text-xs text-red-500"
                        >
                          {errors.items[index]?.unit?.message}
                        </p>
                      )}
                    </div>

                    {/* 단가 */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`items.${index}.unitPrice`}
                        className="text-xs font-medium"
                      >
                        단가
                      </Label>
                      <Controller
                        control={control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`items.${index}.unitPrice`}
                            type="number"
                            min="0"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            aria-invalid={!!errors.items?.[index]?.unitPrice}
                            aria-describedby={
                              errors.items?.[index]?.unitPrice
                                ? `items.${index}.unitPrice-error`
                                : undefined
                            }
                            className={
                              errors.items?.[index]?.unitPrice
                                ? 'border-red-500 focus:ring-red-500 text-sm'
                                : 'text-sm'
                            }
                          />
                        )}
                      />
                      {errors.items?.[index]?.unitPrice && (
                        <p
                          id={`items.${index}.unitPrice-error`}
                          className="text-xs text-red-500"
                        >
                          {errors.items[index]?.unitPrice?.message}
                        </p>
                      )}
                    </div>

                    {/* 소계 (읽기 전용) */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`items.${index}.subtotal`}
                        className="text-xs font-medium"
                      >
                        소계
                      </Label>
                      <div className="bg-muted rounded-md px-3 py-2 flex items-center justify-end text-sm font-medium text-foreground">
                        {formatCurrency(itemSubtotal)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {errors.items && typeof errors.items === 'object' && !Array.isArray(errors.items) && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {(errors.items as any).message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 섹션 3: 총액 */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-card to-primary/10">
          <CardContent className="pt-8">
            <div className="space-y-5">
              {/* 소계 */}
              <div className="flex justify-end items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">소계:</span>
                <span className="text-lg font-semibold text-foreground">
                  {formatCurrency(total)}
                </span>
              </div>

              {/* 세금 (현재는 0%) */}
              <div className="flex justify-end items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">세금:</span>
                <span className="text-lg font-semibold text-foreground">
                  {formatCurrency(0)}
                </span>
              </div>

              {/* 총액 */}
              <div className="border-t border-border pt-3 flex justify-end items-center gap-4">
                <span className="text-lg font-bold text-foreground">총액:</span>
                <span className="text-2xl font-bold text-foreground">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 섹션 4: 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          {/* 왼쪽: 삭제 버튼 (편집 모드에만 표시) */}
          {showDeleteButton && onDelete && (
            <Button
              type="button"
              onClick={onDelete}
              disabled={isDeleting || isSubmitting}
              aria-busy={isDeleting}
              variant="destructive"
              className="order-3 sm:order-1"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </Button>
          )}

          {/* 오른쪽: 취소, 저장 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2 sm:ml-auto w-full sm:w-auto">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="order-2 sm:order-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isDeleting}
              aria-busy={isSubmitting}
              className="order-1 sm:order-2"
            >
              {isSubmitting ? '저장 중...' : submitText}
            </Button>
          </div>
        </div>
      </form>
    </Container>
  );
}
