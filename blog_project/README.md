# 블로그 프로젝트

Google Photos API와 YouTube Data API를 활용한 사진 갤러리 및 음악 감상 블로그입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **APIs**: Google Photos Library API, YouTube Data API

## 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 확인:
```
http://localhost:3000
```

## 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # 전역 스타일
│   ├── layout.tsx      # 루트 레이아웃
│   └── page.tsx        # 메인 페이지
├── components/         # 재사용 가능한 컴포넌트
│   └── ui/            # shadcn/ui 컴포넌트
└── lib/               # 유틸리티 함수들
    └── utils.ts       # 유틸리티 함수
```

## 주요 기능

- 📸 **사진 갤러리**: Google Photos API 연동
- 🎵 **음악 플레이어**: YouTube Data API 연동
- 🎨 **반응형 디자인**: Tailwind CSS + shadcn/ui
- ⚡ **빠른 로딩**: Next.js 최적화

## 개발 환경

- **Node.js**: 18.0.0 이상
- **npm**: 9.0.0 이상
- **Next.js**: 14.x
- **TypeScript**: 5.x

## 다음 단계

1. Google Photos API 설정
2. YouTube Data API 설정
3. 환경 변수 구성
4. 페이지 구현

## 라이선스

MIT License
