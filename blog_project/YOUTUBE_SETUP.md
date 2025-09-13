# YouTube Data v3 API 설정 가이드

YouTube Data v3 API를 사용하여 재생목록을 불러오는 기능을 사용하려면 다음 단계를 따라 설정해주세요.

## 1. Google Cloud Console에서 API 키 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리"로 이동
4. "YouTube Data API v3" 검색 후 활성화
5. "API 및 서비스" > "사용자 인증 정보"로 이동
6. "사용자 인증 정보 만들기" > "API 키" 선택
7. 생성된 API 키를 복사

## 2. YouTube 채널 ID 확인

1. [YouTube](https://www.youtube.com/)에 로그인
2. 채널 페이지로 이동
3. URL에서 채널 ID 확인 (예: `UCxxxxxxxxxxxxxxxxxxxxxx`)
   - 또는 채널 설정 > 고급 설정에서 채널 ID 확인

## 3. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```env
# YouTube Data v3 API
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=your_channel_id_here
```

## 4. API 키 제한 설정 (권장)

보안을 위해 API 키에 제한을 설정하는 것을 권장합니다:

1. Google Cloud Console에서 생성한 API 키 클릭
2. "애플리케이션 제한사항"에서 "HTTP 리퍼러" 선택
3. 도메인 추가 (예: `localhost:3000/*`, `yourdomain.com/*`)
4. "API 제한사항"에서 "YouTube Data API v3"만 선택

## 5. 재생목록 공개 설정

YouTube에서 재생목록이 공개로 설정되어 있는지 확인하세요:
1. YouTube Studio > 콘텐츠 > 재생목록
2. 각 재생목록의 공개 설정을 "공개" 또는 "링크가 있는 사용자"로 변경

## 6. 개발 서버 재시작

환경변수 설정 후 개발 서버를 재시작하세요:

```bash
npm run dev
```

## 문제 해결

### API 키 오류
- API 키가 올바르게 설정되었는지 확인
- YouTube Data API v3가 활성화되었는지 확인
- API 키 제한 설정이 올바른지 확인

### 재생목록이 표시되지 않음
- 채널 ID가 올바른지 확인
- 재생목록이 공개로 설정되어 있는지 확인
- 브라우저 개발자 도구의 네트워크 탭에서 API 응답 확인

### CORS 오류
- API 키 제한 설정에서 올바른 도메인이 추가되었는지 확인
- 개발 환경에서는 `localhost:3000/*` 추가

## 기능 설명

- **재생목록 목록**: `/youtube` 페이지에서 모든 공개 재생목록 확인
- **재생목록 상세**: 재생목록 클릭 시 비디오 목록과 플레이어 인터페이스
- **홈페이지 통합**: Recent Work에 YouTube 재생목록도 표시
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원

## API 사용량

YouTube Data API v3는 일일 할당량이 있습니다:
- 기본 할당량: 10,000 units/day
- 재생목록 목록 조회: 1 unit
- 재생목록 비디오 조회: 1 unit
- 비디오 상세 정보 조회: 1 unit

일반적인 사용에서는 할당량을 초과하지 않지만, 대량의 재생목록이 있는 경우 주의하세요.
