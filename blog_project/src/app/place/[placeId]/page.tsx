'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// 임시 데이터 (장소별 음식 사진들)
const mockPlacePhotos = {
  '1': [
    {
      id: '1-1',
      title: 'Traditional Ramen House',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&h=800&fit=crop',
      description: 'Authentic ramen with rich broth and fresh ingredients'
    },
    {
      id: '1-2',
      title: 'Ramen preparation',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&h=800&fit=crop',
      description: 'Chef carefully preparing the perfect bowl of ramen'
    },
    {
      id: '1-3',
      title: 'Ramen ingredients',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
      description: 'Fresh vegetables and premium noodles'
    },
    {
      id: '1-4',
      title: 'Ramen serving',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=800&fit=crop',
      description: 'Steaming hot ramen ready to be enjoyed'
    },
    {
      id: '1-5',
      title: 'Ramen interior',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&h=800&fit=crop',
      description: 'Cozy traditional ramen house atmosphere'
    }
  ],
  '2': [
    {
      id: '2-1',
      title: 'Kyoto Sushi Bar',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&h=800&fit=crop',
      description: 'Premium sushi prepared by master chef'
    },
    {
      id: '2-2',
      title: 'Sushi preparation',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
      description: 'Artistic sushi making process'
    },
    {
      id: '2-3',
      title: 'Sushi presentation',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=800&fit=crop',
      description: 'Beautifully arranged sushi platter'
    }
  ],
  '3': [
    {
      id: '3-1',
      title: 'Street Food Market',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
      description: 'Bustling street food market with various vendors'
    },
    {
      id: '3-2',
      title: 'Takoyaki stand',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=800&fit=crop',
      description: 'Fresh takoyaki being made on the spot'
    },
    {
      id: '3-3',
      title: 'Street food variety',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&h=800&fit=crop',
      description: 'Colorful array of street food options'
    }
  ]
}

// 장소 정보
const mockPlaces = {
  '1': {
    id: '1',
    title: 'Traditional Ramen House',
    createdAt: 'April, 2020',
    imageCount: 5
  },
  '2': {
    id: '2',
    title: 'Kyoto Sushi Bar',
    createdAt: 'March, 2020',
    imageCount: 3
  },
  '3': {
    id: '3',
    title: 'Street Food Market',
    createdAt: 'May, 2019',
    imageCount: 3
  }
}

export default function PlaceDetailPage() {
  const params = useParams()
  const placeId = params.placeId as string
  const [activeIndex, setActiveIndex] = useState(0)
  
  const place = mockPlaces[placeId as keyof typeof mockPlaces]
  const photos = mockPlacePhotos[placeId as keyof typeof mockPlacePhotos] || []

  if (!place || !photos.length) {
    return (
      <>
        <Header />
        <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">장소를 찾을 수 없습니다</h1>
            <p className="text-gray-600">요청하신 장소가 존재하지 않습니다.</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="pt-20 min-h-screen bg-black">
        {/* 장소 정보 헤더 */}
        <div className="absolute top-20 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-2xl font-bold">{place.title}</h1>
                <p className="text-gray-300">{place.createdAt}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">총 {place.imageCount}장</p>
              </div>
            </div>
          </div>
        </div>

        {/* Swiper 캐러셀 */}
        <div className="relative h-screen">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              el: '.swiper-pagination',
              type: 'fraction',
              formatFractionCurrent: (number) => number.toString().padStart(2, '0'),
              formatFractionTotal: (number) => number.toString().padStart(2, '0'),
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="h-full"
          >
            {photos.map((photo) => (
              <SwiperSlide key={photo.id}>
                <div className="relative h-full flex items-center justify-center">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-6">
                    <div className="container mx-auto">
                      <h2 className="text-white text-xl font-semibold mb-2">{photo.title}</h2>
                      <p className="text-gray-300">{photo.description}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 커스텀 네비게이션 버튼 */}
          <div className="absolute bottom-8 right-8 z-20 flex items-center space-x-4">
            <div className="swiper-pagination text-white text-lg font-mono"></div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="swiper-button-prev bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="swiper-button-next bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
