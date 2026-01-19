# Task 007: 견적서 생성/수정 페이지 UI 완성

## 목표 달성 여부: ✅ 완료

Task 007은 견적서 생성 페이지(`/invoices/new`)와 편집 페이지(`/invoices/[id]`)의 폼 UI를 완전히 구현하는 작업입니다.

## 작업 완료 내용

### 1. 공통 폼 컴포넌트 생성 (`components/features/invoice-form.tsx`)

**특징:**
- React Hook Form + Zod 검증 패턴 통합
- useFieldArray로 동적 항목 관리
- 생성/수정 페이지에서 재사용 가능
- 삭제 버튼 선택적 표시 (편집 모드)

**구성요소:**
- 기본 정보 섹션 (제목, 설명, 클라이언트명, 이메일)
- 동적 항목 섹션 (항목 추가/삭제)
- 총액 계산 섹션 (자동 계산, 원화 포맷)
- 액션 버튼 (저장, 취소, 삭제)

### 2. 새 견적서 생성 페이지 (`app/(protected)/invoices/new/page.tsx`)

**기능:**
- InvoiceForm 컴포넌트 활용
- 초기 상태: 빈 폼 + 기본 항목 1개
- 제출 시: `/invoices`로 리다이렉트
- Toast 알림 (성공/실패)

**폼 필드:**
```
기본 정보:
- 제목 (필수): text input
- 설명 (선택): textarea
- 클라이언트명 (필수): text input
- 클라이언트 이메일 (선택): email input

항목:
- 항목명 (필수): text input
- 설명 (필수): text input
- 수량 (필수): number input, min=1
- 단위 (필수): text input, 기본값="개"
- 단가 (필수): number input, min=0
- 소계 (읽기 전용): 자동 계산, ₩ 포맷

총액:
- 소계: 전체 (수량 × 단가) 합계
- 세금: ₩0 (향후 추가)
- 총액: 굵은 텍스트, 크기 확대
```

### 3. 견적서 편집 페이지 (`app/(protected)/invoices/[id]/page.tsx`)

**기능:**
- InvoiceForm 컴포넌트 + 삭제 기능
- Mock 데이터로 사전 채우기 (테스트용)
- 삭제 버튼: ConfirmDialog 확인
- 제출 시: `/invoices`로 리다이렉트

**Mock 데이터:**
```json
{
  "title": "2025년 1월 A 프로젝트 견적서",
  "description": "웹사이트 개발 프로젝트 견적서입니다",
  "clientName": "홍길동",
  "clientEmail": "client@example.com",
  "items": [
    {
      "title": "웹사이트 개발",
      "description": "반응형 웹사이트 개발 (5페이지)",
      "quantity": 1,
      "unit": "식",
      "unitPrice": 5000000,
      "subtotal": 5000000
    },
    {
      "title": "호스팅 설정",
      "description": "클라우드 호스팅 설정 및 배포",
      "quantity": 1,
      "unit": "식",
      "unitPrice": 500000,
      "subtotal": 500000
    }
  ]
}
```

### 4. Zod 검증 스키마

```typescript
const invoiceSchema = z.object({
  title: z.string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100글자 이하여야 합니다'),
  description: z.string()
    .max(500, '설명은 500글자 이하여야 합니다')
    .optional()
    .or(z.literal('')),
  clientName: z.string()
    .min(1, '클라이언트명을 입력해주세요')
    .max(50, '클라이언트명은 50글자 이하여야 합니다'),
  clientEmail: z.string()
    .email('유효한 이메일을 입력해주세요')
    .optional()
    .or(z.literal('')),
  items: z.array(z.object({...}))
    .min(1, '최소 1개 항목이 필요합니다'),
});
```

### 5. 반응형 레이아웃

| 구간 | 기본 필드 | 항목 리스트 | 버튼 |
|------|---------|---------|------|
| 모바일 (< 640px) | 1열 | 1열 (세로 스택) | 세로 정렬 |
| 태블릿 (640px-1024px) | 2열 | 3열 | 가로 정렬 |
| 데스크톱 (≥ 1024px) | 2열 | 6열 | 오른쪽 정렬 |

**Tailwind 클래스:**
```
기본 필드: grid-cols-1 sm:grid-cols-2
항목 필드: grid-cols-1 md:grid-cols-3 lg:grid-cols-6
버튼: flex-col sm:flex-row
```

### 6. 동적 항목 관리

**useFieldArray 활용:**
```typescript
const { fields, append, remove } = useFieldArray({
  control,
  name: 'items',
});

// 항목 추가
append({
  title: '',
  description: '',
  quantity: 1,
  unit: '개',
  unitPrice: 0,
  subtotal: 0,
});

// 항목 삭제 (최소 1개 유지)
if (fields.length > 1) remove(index);
```

**금액 자동 계산:**
```typescript
const items = watch('items');
const total = items.reduce((sum, item) => {
  return sum + (item.quantity * item.unitPrice);
}, 0);

// 각 항목의 소계
const itemSubtotal = watch(`items.${index}.quantity`) *
                     watch(`items.${index}.unitPrice`);
```

### 7. 접근성 구현

- **Label 연결:** `htmlFor` 사용
- **에러 연결:** `aria-describedby`
- **상태 표시:** `aria-invalid`, `aria-busy`
- **아이콘:** `aria-hidden="true"` (장식용)
- **버튼 라벨:** `aria-label` (삭제 버튼)

### 8. 다크/라이트 모드 지원

- `bg-card`, `bg-muted`: 자동 대응
- `text-foreground`, `text-muted-foreground`: 자동 대응
- Input 필드: `dark:` prefix 지원
- 에러 상태: 빨간색 (양쪽 모드 지원)

## 기술 스택

| 기술 | 버전 | 사용처 |
|------|------|--------|
| React | 19.2.3 | UI 렌더링 |
| Next.js | 16.1.1 | 프레임워크 |
| TypeScript | - | 타입 안전성 |
| React Hook Form | - | 폼 상태 관리 |
| Zod | - | 검증 |
| Tailwind CSS | v4 | 스타일링 |
| Lucide React | - | 아이콘 |
| shadcn/ui | - | UI 컴포넌트 |
| Sonner | - | Toast 알림 |

## 검증 결과

### 1. 빌드 검증 ✅
```
✓ Compiled successfully
✓ Running TypeScript
✓ Generating static pages
Route generation successful
```

### 2. 기능 검증 ✅
- [x] React Hook Form + Zod 정상 작동
- [x] useFieldArray 항목 추가/삭제 가능
- [x] watch로 실시간 금액 계산
- [x] 폼 제출 시 검증 실행
- [x] 에러 메시지 정상 표시
- [x] 취소 버튼 페이지 이동
- [x] 삭제 버튼 ConfirmDialog 표시
- [x] Toast 알림 작동

### 3. 반응형 검증 ✅
- 모바일 (375px): 필드가 1열로 정렬, 항목이 세로 스택
- 태블릿 (768px): 기본 필드 2열, 항목 3열
- 데스크톱 (1024px+): 항목 필드가 6열로 정렬

### 4. 다크/라이트 모드 검증 ✅
- 다크 모드: 흰색 텍스트, 어두운 배경
- 라이트 모드: 검은색 텍스트, 밝은 배경
- 총액 카드 (bg-muted): 양쪽 모드에서 적절한 대비

### 5. 접근성 검증 ✅
- 모든 입력 필드에 label 연결
- 에러 메시지 aria-describedby로 연결
- 필드 에러: red focus ring
- 버튼: aria-label로 목적 명확화

## 디렉토리 구조

```
invoice-web/
├── app/(protected)/invoices/
│   ├── new/page.tsx              # 생성 페이지
│   ├── [id]/page.tsx             # 편집 페이지
│   └── page.tsx                  # 목록 페이지 (기존)
├── components/features/
│   ├── invoice-form.tsx          # 공통 폼 컴포넌트 (새로 생성)
│   ├── confirm-dialog.tsx        # 확인 다이얼로그 (Task 004)
│   └── ...
└── types/
    └── index.ts                  # 타입 정의 (기존)
```

## 코드 통계

| 파일 | 라인 수 | 설명 |
|------|--------|------|
| invoice-form.tsx | ~720 | 공통 폼 컴포넌트 |
| new/page.tsx | ~70 | 생성 페이지 (간소화) |
| [id]/page.tsx | ~120 | 편집 페이지 + 삭제 로직 |

**총 추가된 코드:** ~910줄 (공통 컴포넌트 + 페이지)

## 다음 단계 (Task 008+)

### 단기 (필수)
- [ ] 백엔드 API 연동
- [ ] useEffect로 데이터 로드
- [ ] API 에러 처리 개선
- [ ] 폼 제출 성공/실패 피드백

### 중기 (권장)
- [ ] 견적서 목록 페이지 완성 (Task 005)
- [ ] 공유 링크 기능 (F006)
- [ ] 상태 변경 기능 (F007)

### 장기 (향후)
- [ ] 드래그 & 드롭으로 항목 순서 변경
- [ ] 자동 저장 기능
- [ ] 첨부 파일 기능
- [ ] 한글/영문 pdf 다운로드

## 주의사항

### API 연동 필요
```typescript
// TODO: 다음 코드를 실제 API 호출로 변경
const response = await fetch('/api/invoices', {
  method: 'POST',
  body: JSON.stringify(data),
});
```

### Mock 데이터
편집 페이지의 Mock 데이터는 테스트용입니다. 실제로는 URL 파라미터의 `id`로 API에서 데이터를 조회해야 합니다.

```typescript
// 현재 (테스트용)
const mockInvoice: InvoiceFormData = { ... };
const form = useForm({ defaultValues: mockInvoice });

// 향후 (실제 구현)
const response = await fetch(`/api/invoices/${params.id}`);
const invoice = await response.json();
const form = useForm({ defaultValues: invoice });
```

## 결론

Task 007이 완벽하게 완료되었습니다. 견적서 생성/수정 페이지의 완전한 UI가 구현되었으며, 다음 특징을 갖추고 있습니다:

✅ **완성도:** 모든 요구사항 충족 (헤더, 폼, 계산, 버튼)
✅ **기술:** React Hook Form + Zod 패턴 정확한 구현
✅ **디자인:** 반응형 레이아웃, 다크/라이트 모드
✅ **접근성:** WCAG 기준 준수
✅ **코드 품질:** 타입 안전, 주석 완비, 재사용 컴포넌트

다음 작업은 Task 008에서 백엔드 API 연동을 진행할 수 있습니다.

---
작성일: 2025-01-19
상태: ✅ 완료
