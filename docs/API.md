# Invoice Web API 문서

모든 API 엔드포인트에 대한 상세한 설명, 요청/응답 형식, 그리고 사용 예제를 제공합니다.

## 📋 목차

- [기본 정보](#기본-정보)
- [인증](#인증)
- [인증 관련 엔드포인트](#인증-관련-엔드포인트)
- [견적서 관리 엔드포인트](#견적서-관리-엔드포인트)
- [공유 링크 엔드포인트](#공유-링크-엔드포인트)
- [에러 코드](#에러-코드)
- [타입 정의](#타입-정의)

---

## 기본 정보

### Base URL

```
개발 환경: http://localhost:5000
프로덕션: (배포 후 설정)
```

### Content-Type

모든 API 요청은 `application/json` 형식을 사용합니다.

```
Content-Type: application/json
```

### 인증 방식

모든 인증 필수 엔드포인트는 Bearer 토큰을 사용합니다.

```
Authorization: Bearer {access_token}
```

---

## 인증

### 로그인 후 토큰 저장

로그인 성공 후 반환되는 `token`은 `localStorage`에 저장되어 자동으로 모든 요청에 포함됩니다.

```javascript
// 로그인 후 토큰 저장
const { token, user } = await loginApi(email, password);
localStorage.setItem('auth_token', token);
```

### 토큰 갱신 (선택사항)

Refresh 토큰을 사용하여 Access 토큰을 갱신할 수 있습니다.

```javascript
const { token } = await refreshTokenApi(refreshToken);
localStorage.setItem('auth_token', token);
```

### CSRF 보호

`POST`, `PUT`, `DELETE` 요청에는 CSRF 토큰이 자동으로 추가됩니다.

```
X-CSRF-Token: {csrf_token}
```

---

## 인증 관련 엔드포인트

### 1. 로그인

**엔드포인트**: `POST /auth/login`

**설명**: 이메일과 비밀번호로 사용자를 인증하고 JWT 토큰을 받아옵니다.

**인증**: 불필요

**요청 바디**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답 (200 OK)**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "admin",
    "createdAt": "2026-01-21T00:00:00Z",
    "updatedAt": "2026-01-21T00:00:00Z"
  }
}
```

**사용 예제**:

```javascript
import { loginApi } from '@/lib/api-auth';

const response = await loginApi('user@example.com', 'password123');
console.log(response.token);
console.log(response.user);
```

**가능한 에러**:

- `400 Bad Request`: 이메일 또는 비밀번호가 없음
- `401 Unauthorized`: 이메일 또는 비밀번호 오류
- `429 Too Many Requests`: 너무 많은 로그인 시도

---

### 2. 로그아웃

**엔드포인트**: `POST /auth/logout`

**설명**: 사용자를 로그아웃합니다. 서버에서 토큰을 무효화합니다.

**인증**: 필수

**요청 바디**: (없음)

**응답 (200 OK)**:

```json
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

**사용 예제**:

```javascript
import { logoutApi } from '@/lib/api-auth';

await logoutApi();
// 로컬 스토리지 정리는 자동으로 진행됩니다
```

**가능한 에러**:

- `401 Unauthorized`: 인증 토큰이 없거나 만료됨

---

### 3. 현재 사용자 정보 조회

**엔드포인트**: `GET /auth/me`

**설명**: 인증된 사용자의 현재 정보를 조회합니다.

**인증**: 필수

**요청 바디**: (없음)

**응답 (200 OK)**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "홍길동",
  "role": "admin",
  "createdAt": "2026-01-21T00:00:00Z",
  "updatedAt": "2026-01-21T00:00:00Z"
}
```

**사용 예제**:

```javascript
import { getMeApi } from '@/lib/api-auth';

const user = await getMeApi();
console.log(user.email);
```

**가능한 에러**:

- `401 Unauthorized`: 인증 토큰이 없거나 만료됨

---

### 4. 회원가입

**엔드포인트**: `POST /auth/signup`

**설명**: 새로운 사용자 계정을 생성합니다.

**인증**: 불필요

**요청 바디**:

```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "김철수"
}
```

**응답 (201 Created)**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "newuser@example.com",
    "name": "김철수",
    "role": "admin",
    "createdAt": "2026-01-21T00:00:00Z",
    "updatedAt": "2026-01-21T00:00:00Z"
  }
}
```

**사용 예제**:

```javascript
import { signupApi } from '@/lib/api-auth';

const response = await signupApi('newuser@example.com', 'password123', 'Kim Chul');
console.log(response.user);
```

**가능한 에러**:

- `400 Bad Request`: 입력 형식 오류
- `409 Conflict`: 이미 가입된 이메일

---

### 5. 토큰 갱신 (선택사항)

**엔드포인트**: `POST /auth/refresh`

**설명**: Refresh 토큰을 사용하여 새로운 Access 토큰을 발급받습니다.

**인증**: 불필요 (Refresh 토큰 필수)

**요청 바디**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**응답 (200 OK)**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**사용 예제**:

```javascript
import { refreshTokenApi } from '@/lib/api-auth';

const { token } = await refreshTokenApi(refreshToken);
localStorage.setItem('auth_token', token);
```

**가능한 에러**:

- `401 Unauthorized`: Refresh 토큰이 만료되었음

---

## 견적서 관리 엔드포인트

### 1. 견적서 목록 조회

**엔드포인트**: `GET /invoices`

**설명**: 현재 사용자가 생성한 모든 견적서를 조회합니다. 페이지네이션을 지원합니다.

**인증**: 필수

**쿼리 파라미터**:

| 파라미터 | 타입 | 기본값 | 설명 |
| -------- | ---- | ------ | ---- |
| page | number | 1 | 페이지 번호 |
| limit | number | 10 | 페이지당 항목 수 |

**요청 예제**:

```
GET /invoices?page=1&limit=20
```

**응답 (200 OK)**:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "웹사이트 개발 견적서",
    "description": "반응형 웹사이트 개발",
    "createdBy": "550e8400-e29b-41d4-a716-446655440001",
    "clientName": "홍길동",
    "clientEmail": "client@example.com",
    "status": "sent",
    "totalAmount": 5000000,
    "items": [...],
    "createdAt": "2026-01-21T00:00:00Z",
    "updatedAt": "2026-01-21T00:00:00Z"
  }
]
```

**사용 예제**:

```javascript
import { getInvoicesApi } from '@/lib/api-invoice';

const invoices = await getInvoicesApi(1, 20);
console.log(invoices);
```

**가능한 에러**:

- `401 Unauthorized`: 인증 토큰이 없거나 만료됨
- `500 Internal Server Error`: 서버 오류

---

### 2. 견적서 상세 조회

**엔드포인트**: `GET /invoices/{id}`

**설명**: 특정 견적서의 상세 정보를 조회합니다.

**인증**: 필수

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
| -------- | ---- | ---- |
| id | string (UUID) | 견적서 ID |

**요청 예제**:

```
GET /invoices/550e8400-e29b-41d4-a716-446655440000
```

**응답 (200 OK)**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "웹사이트 개발 견적서",
  "description": "반응형 웹사이트 개발",
  "createdBy": "550e8400-e29b-41d4-a716-446655440001",
  "clientName": "홍길동",
  "clientEmail": "client@example.com",
  "status": "sent",
  "totalAmount": 5000000,
  "items": [
    {
      "id": "item-id-1",
      "invoiceId": "550e8400-e29b-41d4-a716-446655440000",
      "description": "시스템 설계 및 아키텍처",
      "quantity": 1,
      "unitPrice": 1000000,
      "subtotal": 1000000,
      "displayOrder": 1
    }
  ],
  "createdAt": "2026-01-21T00:00:00Z",
  "updatedAt": "2026-01-21T00:00:00Z"
}
```

**사용 예제**:

```javascript
import { getInvoiceApi } from '@/lib/api-invoice';

const invoice = await getInvoiceApi('550e8400-e29b-41d4-a716-446655440000');
console.log(invoice.title);
```

**가능한 에러**:

- `401 Unauthorized`: 인증 토큰이 없거나 만료됨
- `403 Forbidden`: 이 견적서에 접근할 권한이 없음
- `404 Not Found`: 견적서를 찾을 수 없음

---

### 3. 견적서 생성

**엔드포인트**: `POST /invoices`

**설명**: 새로운 견적서를 생성합니다. 생성자는 자동으로 현재 로그인한 사용자로 설정됩니다.

**인증**: 필수

**요청 바디**:

```json
{
  "title": "웹사이트 개발 견적서",
  "description": "반응형 웹사이트 개발",
  "clientName": "홍길동",
  "clientEmail": "client@example.com",
  "items": [
    {
      "description": "시스템 설계 및 아키텍처",
      "quantity": 1,
      "unitPrice": 1000000
    },
    {
      "description": "프론트엔드 개발",
      "quantity": 40,
      "unitPrice": 50000
    }
  ]
}
```

**응답 (201 Created)**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "웹사이트 개발 견적서",
  "description": "반응형 웹사이트 개발",
  "createdBy": "550e8400-e29b-41d4-a716-446655440001",
  "clientName": "홍길동",
  "clientEmail": "client@example.com",
  "status": "draft",
  "totalAmount": 3000000,
  "items": [...],
  "createdAt": "2026-01-21T00:00:00Z",
  "updatedAt": "2026-01-21T00:00:00Z"
}
```

**사용 예제**:

```javascript
import { createInvoiceApi } from '@/lib/api-invoice';

const newInvoice = await createInvoiceApi({
  title: '웹사이트 개발 견적서',
  clientName: '홍길동',
  items: [
    { description: '시스템 설계', quantity: 1, unitPrice: 1000000 }
  ]
});
console.log(newInvoice.id);
```

**가능한 에러**:

- `400 Bad Request`: 입력 형식 오류 또는 필수 필드 누락
- `401 Unauthorized`: 인증 토큰이 없거나 만료됨
- `422 Unprocessable Entity`: 유효하지 않은 데이터

---

### 4. 견적서 수정

**엔드포인트**: `PUT /invoices/{id}`

**설명**: 기존 견적서를 수정합니다. 생성자만 수정 가능합니다.

**인증**: 필수

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
| -------- | ---- | ---- |
| id | string (UUID) | 견적서 ID |

**요청 바디** (모든 필드는 선택사항):

```json
{
  "title": "수정된 견적서 제목",
  "description": "수정된 설명",
  "clientName": "수정된 클라이언트 이름",
  "clientEmail": "updated@example.com",
  "items": [
    {
      "description": "수정된 항목",
      "quantity": 2,
      "unitPrice": 500000
    }
  ]
}
```

**응답 (200 OK)**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "수정된 견적서 제목",
  "description": "수정된 설명",
  ...
  "updatedAt": "2026-01-21T12:00:00Z"
}
```

**사용 예제**:

```javascript
import { updateInvoiceApi } from '@/lib/api-invoice';

const updated = await updateInvoiceApi('550e8400-e29b-41d4-a716-446655440000', {
  title: '수정된 제목',
  clientName: '김철수'
});
console.log(updated);
```

**가능한 에러**:

- `400 Bad Request`: 입력 형식 오류
- `401 Unauthorized`: 인증 토큰이 없거나 만료됨
- `403 Forbidden`: 이 견적서를 수정할 권한이 없음
- `404 Not Found`: 견적서를 찾을 수 없음

---

### 5. 견적서 삭제

**엔드포인트**: `DELETE /invoices/{id}`

**설명**: 견적서를 삭제합니다. 생성자만 삭제 가능합니다.

**인증**: 필수

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
| -------- | ---- | ---- |
| id | string (UUID) | 견적서 ID |

**요청 바디**: (없음)

**응답 (204 No Content)**: (응답 바디 없음)

**사용 예제**:

```javascript
import { deleteInvoiceApi } from '@/lib/api-invoice';

await deleteInvoiceApi('550e8400-e29b-41d4-a716-446655440000');
console.log('삭제되었습니다.');
```

**가능한 에러**:

- `401 Unauthorized`: 인증 토큰이 없거나 만료됨
- `403 Forbidden`: 이 견적서를 삭제할 권한이 없음
- `404 Not Found`: 견적서를 찾을 수 없음

---

### 6. 견적서 상태 변경

**엔드포인트**: `PUT /invoices/{id}/status`

**설명**: 견적서의 상태를 변경합니다 (draft → sent → accepted/rejected).

**인증**: 필수

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
| -------- | ---- | ---- |
| id | string (UUID) | 견적서 ID |

**요청 바디**:

```json
{
  "status": "sent"
}
```

**상태 값**:

- `draft`: 작성 중
- `sent`: 발송됨
- `accepted`: 수락됨
- `rejected`: 거절됨

**응답 (200 OK)**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "sent",
  ...
  "updatedAt": "2026-01-21T12:00:00Z"
}
```

**사용 예제**:

```javascript
import { updateInvoiceStatusApi } from '@/lib/api-invoice';

const updated = await updateInvoiceStatusApi(
  '550e8400-e29b-41d4-a716-446655440000',
  'sent'
);
console.log(updated.status);
```

**가능한 에러**:

- `400 Bad Request`: 유효하지 않은 상태 값
- `401 Unauthorized`: 인증 토큰이 없거나 만료됨
- `403 Forbidden`: 이 견적서를 수정할 권한이 없음
- `404 Not Found`: 견적서를 찾을 수 없음

---

## 공유 링크 엔드포인트

### 1. 공유 링크 생성

**엔드포인트**: `POST /shares`

**설명**: 견적서를 공개적으로 공유할 수 있는 링크를 생성합니다.

**인증**: 필수

**요청 바디**:

```json
{
  "invoiceId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-02-21T00:00:00Z"
}
```

**응답 (201 Created)**:

```json
{
  "shareLink": {
    "id": "share-id-1",
    "invoiceId": "550e8400-e29b-41d4-a716-446655440000",
    "token": "abc123def456ghi789jkl...",
    "expiresAt": "2026-02-21T00:00:00Z",
    "createdAt": "2026-01-21T00:00:00Z"
  },
  "publicUrl": "https://example.com/share/abc123def456ghi789jkl..."
}
```

**사용 예제**:

```javascript
import { createShareLinkApi } from '@/lib/api-share';

const { shareLink, publicUrl } = await createShareLinkApi(
  '550e8400-e29b-41d4-a716-446655440000',
  new Date('2026-02-21')
);
console.log('공유 URL:', publicUrl);
```

**가능한 에러**:

- `401 Unauthorized`: 인증 토큰이 없거나 만료됨
- `403 Forbidden`: 이 견적서를 공유할 권한이 없음
- `404 Not Found`: 견적서를 찾을 수 없음

---

### 2. 공유 토큰 검증

**엔드포인트**: `POST /shares/validate`

**설명**: 공유 토큰의 유효성을 검증합니다.

**인증**: 불필요

**요청 바디**:

```json
{
  "token": "abc123def456ghi789jkl..."
}
```

**응답 (200 OK)**:

```json
{
  "valid": true
}
```

**사용 예제**:

```javascript
import { validateShareTokenApi } from '@/lib/api-share';

const isValid = await validateShareTokenApi('abc123def456ghi789jkl...');
console.log('유효한 토큰:', isValid);
```

**가능한 에러**:

- 토큰이 유효하지 않으면 `valid: false` 반환

---

### 3. 공유 견적서 목록 조회

**엔드포인트**: `GET /shares/{token}/invoices`

**설명**: 공유 토큰으로 공개 견적서 목록을 조회합니다.

**인증**: 불필요

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
| -------- | ---- | ---- |
| token | string | 공유 토큰 |

**요청 예제**:

```
GET /shares/abc123def456ghi789jkl.../invoices
```

**응답 (200 OK)**:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "웹사이트 개발 견적서",
    "description": "반응형 웹사이트 개발",
    "clientName": "홍길동",
    "clientEmail": "client@example.com",
    "status": "sent",
    "totalAmount": 5000000,
    "items": [...],
    "createdAt": "2026-01-21T00:00:00Z",
    "updatedAt": "2026-01-21T00:00:00Z"
  }
]
```

**사용 예제**:

```javascript
import { getSharedInvoicesApi } from '@/lib/api-share';

const invoices = await getSharedInvoicesApi('abc123def456ghi789jkl...');
console.log(invoices);
```

**가능한 에러**:

- `404 Not Found`: 공유 링크가 존재하지 않거나 만료됨

---

### 4. 공유 견적서 상세 조회

**엔드포인트**: `GET /shares/{token}/invoices/{id}`

**설명**: 공유 토큰과 견적서 ID로 공개 견적서를 조회합니다.

**인증**: 불필요

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
| -------- | ---- | ---- |
| token | string | 공유 토큰 |
| id | string (UUID) | 견적서 ID |

**요청 예제**:

```
GET /shares/abc123def456ghi789jkl.../invoices/550e8400-e29b-41d4-a716-446655440000
```

**응답 (200 OK)**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "웹사이트 개발 견적서",
  "description": "반응형 웹사이트 개발",
  "clientName": "홍길동",
  "clientEmail": "client@example.com",
  "status": "sent",
  "totalAmount": 5000000,
  "items": [...],
  "createdAt": "2026-01-21T00:00:00Z",
  "updatedAt": "2026-01-21T00:00:00Z"
}
```

**사용 예제**:

```javascript
import { getSharedInvoiceApi } from '@/lib/api-share';

const invoice = await getSharedInvoiceApi(
  'abc123def456ghi789jkl...',
  '550e8400-e29b-41d4-a716-446655440000'
);
console.log(invoice.title);
```

**가능한 에러**:

- `404 Not Found`: 공유 링크 또는 견적서를 찾을 수 없음
- `410 Gone`: 공유 링크가 만료됨

---

### 5. 공유 링크 삭제

**엔드포인트**: `DELETE /shares/{id}`

**설명**: 생성된 공유 링크를 삭제합니다.

**인증**: 필수

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
| -------- | ---- | ---- |
| id | string (UUID) | 공유 링크 ID |

**요청 바디**: (없음)

**응답 (204 No Content)**: (응답 바디 없음)

**사용 예제**:

```javascript
import { deleteShareLinkApi } from '@/lib/api-share';

await deleteShareLinkApi('share-id-1');
console.log('공유 링크가 삭제되었습니다.');
```

**가능한 에러**:

- `401 Unauthorized`: 인증 토큰이 없거나 만료됨
- `403 Forbidden`: 이 공유 링크를 삭제할 권한이 없음
- `404 Not Found`: 공유 링크를 찾을 수 없음

---

### 6. 사용자의 공유 링크 목록 조회

**엔드포인트**: `GET /shares/my`

**설명**: 현재 사용자가 생성한 모든 공유 링크를 조회합니다.

**인증**: 필수

**요청 바디**: (없음)

**응답 (200 OK)**:

```json
[
  {
    "id": "share-id-1",
    "invoiceId": "550e8400-e29b-41d4-a716-446655440000",
    "token": "abc123def456ghi789jkl...",
    "expiresAt": "2026-02-21T00:00:00Z",
    "createdAt": "2026-01-21T00:00:00Z"
  }
]
```

**사용 예제**:

```javascript
import { getMyShareLinksApi } from '@/lib/api-share';

const shares = await getMyShareLinksApi();
console.log(shares);
```

**가능한 에러**:

- `401 Unauthorized`: 인증 토큰이 없거나 만료됨

---

## 에러 코드

### HTTP 상태 코드

| 상태 코드 | 설명 | 예시 |
| -------- | ---- | ---- |
| 200 | 성공 (조회, 수정) | 요청이 성공적으로 처리됨 |
| 201 | 생성됨 | 견적서/공유 링크가 생성됨 |
| 204 | 내용 없음 | 삭제 성공, 응답 바디 없음 |
| 400 | 잘못된 요청 | 필수 필드 누락, 입력 형식 오류 |
| 401 | 인증 실패 | 토큰 없음, 토큰 만료 |
| 403 | 접근 거부 | 권한 부족, CSRF 검증 실패 |
| 404 | 찾을 수 없음 | 견적서/공유 링크 존재하지 않음 |
| 409 | 충돌 | 이미 가입된 이메일 |
| 410 | 사라짐 | 공유 링크 만료 |
| 422 | 처리 불가 | 유효하지 않은 데이터 |
| 429 | 요청 과다 | 너무 많은 로그인 시도 |
| 500 | 서버 오류 | 예기치 않은 서버 오류 |

### 에러 응답 형식

```json
{
  "success": false,
  "error": "에러 메시지",
  "details": {}
}
```

---

## 타입 정의

### User (사용자)

```typescript
interface User {
  id: string;           // UUID
  email: string;        // 이메일
  name: string;         // 사용자명
  role: 'admin' | 'client';  // 역할
  createdAt: Date;      // 생성 일시
  updatedAt: Date;      // 수정 일시
}
```

### Invoice (견적서)

```typescript
interface Invoice {
  id: string;           // UUID
  title: string;        // 제목
  description?: string; // 설명
  createdBy: string;    // 생성자 ID
  clientName: string;   // 클라이언트 이름
  clientEmail?: string; // 클라이언트 이메일
  status: 'draft' | 'sent' | 'accepted' | 'rejected';  // 상태
  totalAmount: number;  // 총액
  items: InvoiceItem[]; // 항목 배열
  createdAt: Date;      // 생성 일시
  updatedAt: Date;      // 수정 일시
}
```

### InvoiceItem (견적서 항목)

```typescript
interface InvoiceItem {
  id: string;           // UUID
  invoiceId: string;    // 견적서 ID
  description: string;  // 항목 설명
  quantity: number;     // 수량
  unitPrice: number;    // 단가
  subtotal: number;     // 소계
  displayOrder: number; // 표시 순서
}
```

### InvoiceShare (공유 링크)

```typescript
interface InvoiceShare {
  id: string;           // UUID
  invoiceId: string;    // 견적서 ID
  token: string;        // 공유 토큰 (UNIQUE)
  expiresAt?: Date;     // 만료 일시
  createdAt: Date;      // 생성 일시
}
```

---

## 추가 정보

### 페이지네이션

견적서 목록 조회 시 페이지네이션을 지원합니다.

```javascript
const invoices = await getInvoicesApi(page, limit);
// page: 1부터 시작, limit: 1 이상
```

### 요청 타임아웃

모든 요청은 기본 타임아웃이 10초로 설정되어 있습니다.

```javascript
const data = await apiFetch('/invoices', { timeout: 5000 });
```

### 네트워크 오류 처리

네트워크 오류 발생 시 자동으로 에러를 던집니다.

```javascript
try {
  const invoices = await getInvoicesApi();
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

---

**마지막 업데이트**: 2026년 1월 21일
**API 버전**: 1.0.0
