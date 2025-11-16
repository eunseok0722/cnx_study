import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화 설정
  images: {
    domains: [
      'images.unsplash.com',
      'img.youtube.com',
      'i.ytimg.com',
      'res.cloudinary.com' // Cloudinary 이미지 호스팅
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 성능 최적화
  // experimental: {
  //   optimizeCss: true, // critters 모듈 오류로 인해 비활성화
  // },
  
  // 압축 설정
  compress: true,
  
  // 보안 헤더
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
