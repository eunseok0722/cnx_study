# Albums & Places 데이터 설정 가이드

이 프로젝트는 JSON 파일 기반으로 앨범과 장소 데이터를 관리합니다. 이미지는 Cloudinary를 통해 호스팅할 수 있습니다.

## 1. 데이터 구조

프로젝트 루트의 `data/` 디렉토리에 다음 JSON 파일들이 있습니다:

- `albums.json` - Photos 앨범 목록
- `places.json` - Place 장소 목록
- `album-photos.json` - 각 앨범의 상세 사진 목록
- `place-photos.json` - 각 장소의 상세 사진 목록

## 2. JSON 파일 형식

### albums.json / places.json

```json
[
  {
    "id": "1",
    "title": "앨범 제목",
    "thumbnail": "https://res.cloudinary.com/your-cloud/image/upload/v123/thumbnail.jpg",
    "category": "photos",
    "createdAt": "2024-04-15",
    "imageCount": 24,
    "description": "앨범 설명"
  }
]
```

### album-photos.json / place-photos.json

```json
{
  "1": [
    {
      "id": "1",
      "title": "사진 제목",
      "description": "사진 설명",
      "image": "https://res.cloudinary.com/your-cloud/image/upload/v123/photo1.jpg"
    }
  ]
}
```

## 3. Cloudinary 설정 (선택사항)

### 3.1 Cloudinary 계정 생성

1. [Cloudinary](https://cloudinary.com/)에 가입
2. 대시보드에서 Cloud Name, API Key, API Secret 확인

### 3.2 이미지 업로드

Cloudinary 대시보드 또는 API를 통해 이미지를 업로드합니다.

**업로드 방법:**
- 웹 대시보드: Media Library > Upload
- API: [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference)

**업로드 후 URL 형식:**
```
https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.jpg
```

### 3.3 환경변수 설정 (선택사항)

`.env.local` 파일에 Cloudinary 정보를 추가할 수 있습니다 (향후 확장용):

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
```

### 3.4 Next.js 이미지 최적화 설정

`next.config.ts`에 Cloudinary 도메인이 이미 추가되어 있습니다:

```typescript
images: {
  domains: [
    'res.cloudinary.com',
    // ... 기타 도메인
  ]
}
```

## 4. 데이터 관리 방법

### 4.1 새 앨범 추가

1. `data/albums.json`에 새 앨범 객체 추가
2. `data/album-photos.json`에 해당 앨범 ID로 사진 배열 추가

### 4.2 이미지 URL 업데이트

JSON 파일의 `thumbnail` 또는 `image` 필드를 Cloudinary URL로 업데이트:

```json
{
  "thumbnail": "https://res.cloudinary.com/your-cloud/image/upload/v123/thumbnail.jpg"
}
```

### 4.3 이미지 최적화

Cloudinary URL에 변환 파라미터를 추가하여 이미지를 최적화할 수 있습니다:

```
https://res.cloudinary.com/your-cloud/image/upload/w_800,h_600,c_fill,q_auto/photo.jpg
```

**주요 파라미터:**
- `w_800` - 너비 800px
- `h_600` - 높이 600px
- `c_fill` - 크롭 방식
- `q_auto` - 자동 품질 최적화
- `f_auto` - 자동 포맷 (WebP 등)

## 5. 대안 이미지 호스팅

Cloudinary 외에도 다음 서비스를 사용할 수 있습니다:

### 5.1 Imgur
- 무료 플랜 제공
- API를 통한 업로드 가능
- URL 형식: `https://i.imgur.com/{image_id}.jpg`

### 5.2 AWS S3 + CloudFront
- 확장성 좋음
- CDN 제공
- 비용 발생 가능

### 5.3 Vercel Blob Storage
- Vercel 배포 시 통합 용이
- Next.js와 호환성 좋음

### 5.4 GitHub (raw.githubusercontent.com)
- 무료
- 버전 관리 가능
- 대용량 이미지에는 부적합

## 6. 개발 서버 실행

데이터를 업데이트한 후 개발 서버를 재시작하세요:

```bash
npm run dev
```

## 7. API 엔드포인트

프로젝트는 다음 API 엔드포인트를 제공합니다:

- `GET /api/albums` - 모든 앨범 목록
- `GET /api/places` - 모든 장소 목록
- `GET /api/albums/[albumId]/photos` - 특정 앨범의 사진 목록
- `GET /api/places/[placeId]/photos` - 특정 장소의 사진 목록

## 8. 문제 해결

### JSON 파일을 찾을 수 없음
- `data/` 디렉토리가 프로젝트 루트에 있는지 확인
- 파일 이름이 정확한지 확인 (albums.json, places.json 등)

### 이미지가 표시되지 않음
- 이미지 URL이 올바른지 확인
- `next.config.ts`에 이미지 도메인이 추가되어 있는지 확인
- CORS 설정 확인 (외부 이미지인 경우)

### API 에러 발생
- 개발 서버가 실행 중인지 확인
- 브라우저 콘솔에서 에러 메시지 확인
- API Route 파일이 올바른 위치에 있는지 확인

