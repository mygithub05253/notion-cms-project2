'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

/**
 * ConfirmDialog 컴포넌트
 * shadcn/ui AlertDialog 기반 확인 다이얼로그
 */

interface ConfirmDialogProps {
  /** 다이얼로그 열림/닫힘 상태 */
  open: boolean;
  /** 제목 */
  title: string;
  /** 설명 */
  description: string;
  /** 확인 버튼 클릭 핸들러 */
  onConfirm: () => void;
  /** 취소 버튼 클릭 핸들러 */
  onCancel: () => void;
  /** 확인 버튼 텍스트 (기본값: "확인") */
  confirmText?: string;
  /** 취소 버튼 텍스트 (기본값: "취소") */
  cancelText?: string;
  /** 위험한 작업 여부 (기본값: false) */
  isDangerous?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  isDangerous = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(newOpen) => {
      // 닫힐 때만 취소 핸들러 호출
      if (!newOpen) {
        onCancel();
      }
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              isDangerous && 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
