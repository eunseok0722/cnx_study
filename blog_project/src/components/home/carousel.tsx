'use client'

import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { Card, CardContent } from '@/components/ui/card'

export interface CarouselItem {
  id: string
  title: string
  thumbnail: string
  category: 'photos' | 'place' | 'youtube'
  createdAt: string
  subtitle?: string
}

export interface CarouselProps {
  items: CarouselItem[]
  title?: string
  category?: 'photos' | 'place' | 'youtube'
  removeIdPrefix?: boolean
  className?: string
  showEmptyState?: boolean
}

export function Carousel({ 
  items, 
  title, 
  category, 
  removeIdPrefix = false,
  className = '',
  showEmptyState = true
}: CarouselProps) {
  const router = useRouter()

  // 빈 데이터 처리
  if (!items || items.length === 0) {
    if (!showEmptyState) {
      return null
    }
    return (
      <div className={title ? 'mb-16' : 'w-full'}>
        {title && (
          <h2 className="text-3xl font-bold mb-8 tracking-wide">{title.toUpperCase()}</h2>
        )}
        <div className="text-center text-gray-500 py-8">
          <p>표시할 항목이 없습니다.</p>
        </div>
      </div>
    )
  }

  const handleItemClick = (item: CarouselItem) => {
    // ID 처리: removeIdPrefix가 true면 접두사 제거
    let actualId = item.id
    if (removeIdPrefix) {
      const itemCategory = item.category
      actualId = item.id.replace(`${itemCategory}-`, '')
    }

    // category prop이 있으면 사용, 없으면 item.category 사용
    const targetCategory = category || item.category

    switch (targetCategory) {
      case 'photos':
        router.push(`/photos/${actualId}`)
        break
      case 'place':
        router.push(`/place/${actualId}`)
        break
      case 'youtube':
        router.push(`/interests/${actualId}`)
        break
    }
  }

  // 표시할 카테고리 결정: category prop이 있으면 사용, 없으면 각 item의 category 사용
  const getDisplayCategory = (item: CarouselItem) => {
    return category || item.category
  }

  return (
    <div className={title ? 'mb-16' : `w-full ${className}`}>
      {title && (
        <h2 className="text-3xl font-bold mb-8 tracking-wide">{title.toUpperCase()}</h2>
      )}
      <div className="w-full">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={true}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            }
          }}
          className={className || 'carousel-swiper'}
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.id}>
              <Card 
                className="overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => handleItemClick(item)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 font-mono">
                        /{(index + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {getDisplayCategory(item)}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-sm text-gray-600 mb-1">{item.subtitle}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {new Date(item.createdAt).getFullYear()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

