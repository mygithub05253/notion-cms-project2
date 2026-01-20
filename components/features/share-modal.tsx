'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { InvoiceShare } from '@/types';

/** 공유 모달 Props */
interface ShareModalProps {
  /** 모달 열림/닫힘 상태 */
  open: boolean;
  /** 공유 링크 객체 (생성된 공유 정보) */
  shareLink?: InvoiceShare;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 공유 완료 핸들러 (만료 기한 선택 후 확인 버튼 클릭) */
  onComplete?: (expirationDays: string) => Promise<void>;
}

/**
 * 공유 URL 모달 컴포넌트
 *
 * 공유 링크 생성 후 공유 URL을 표시하고 클립보드에 복사할 수 있는 모달입니다.
 * - 공유 URL 표시 및 복사 기능
 * - 만료 기한 설정 옵션
 * - 토큰 만료 표시
 * - 접근성 지원 (aria-label, aria-describedby)
 *
 * @example
 * const [shareModalOpen, setShareModalOpen] = useState(false);
 * const [shareLink, setShareLink] = useState<InvoiceShare | undefined>();
 *
 * return (
 *   <ShareModal
 *     open={shareModalOpen}
 *     shareLink={shareLink}
 *     onClose={() => setShareModalOpen(false)}
 *     onComplete={async (days) => {
 *       await createShareLink(invoiceId);
 *       setShareModalOpen(false);
 *     }}
 *   />
 * );
 */
export function ShareModal({
  open,
  shareLink,
  isLoading = false,
  onClose,
  onComplete,
}: ShareModalProps) {
  // 만료 기한 설정 상태
  const [expirationDays, setExpirationDays] = useState('never');

  // 만료 기한 라벨 매핑
  const expirationMap: Record<string, string> = {
    '7': '7일 후 만료',
    '14': '14일 후 만료',
    '30': '30일 후 만료',
    'never': '무제한',
  };

  // 공유 URL 생성
  const shareUrl = shareLink
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://example.com'}/share/${shareLink.token}`
    : 'https://example.com/share';

  // URL 클립보드에 복사
  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('링크가 복사되었습니다');
    } catch (error) {
      toast.error('링크 복사에 실패했습니다');
    }
  };

  // 공유 완료 핸들러
  const handleShareComplete = async () => {
    try {
      if (onComplete) {
        await onComplete(expirationDays);
      }
      toast.success('공유 설정이 완료되었습니다');
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '공유 설정 중 오류가 발생했습니다'
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>견적서 공유</DialogTitle>
          <DialogDescription>이 공유 링크를 클라이언트와 공유하세요</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 공유 링크 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">공유 링크</label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="text-sm"
                aria-label="공유 링크 URL"
                aria-describedby="share-url-description"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyShareLink}
                aria-label="링크 복사"
                title="링크를 클립보드에 복사합니다"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p id="share-url-description" className="text-xs text-muted-foreground">
              이 링크를 클라이언트와 공유하면 인증 없이 견적서를 조회할 수 있습니다
            </p>
          </div>

          {/* 만료 기한 설정 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">만료 기한</label>
            <Select value={expirationDays} onValueChange={setExpirationDays}>
              <SelectTrigger aria-label="만료 기한 선택">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">1주 (7일)</SelectItem>
                <SelectItem value="14">2주 (14일)</SelectItem>
                <SelectItem value="30">1개월 (30일)</SelectItem>
                <SelectItem value="never">무제한</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 만료 시간 표시 */}
          {expirationDays !== 'never' && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="text-muted-foreground">{expirationMap[expirationDays]}</p>
            </div>
          )}

          {/* 무제한 표시 */}
          {expirationDays === 'never' && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="text-muted-foreground">만료 기한 없이 항상 접근 가능합니다</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            닫기
          </Button>
          <Button onClick={handleShareComplete} disabled={isLoading}>
            {isLoading ? '생성 중...' : '공유 설정 완료'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
