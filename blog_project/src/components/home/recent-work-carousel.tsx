'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { Card, CardContent } from '@/components/ui/card'

interface Album {
  id: string
  title: string
  thumbnail: string
  createdAt: string
  imageCount: number
}

interface RecentWorkCarouselProps {
  albums: Album[]
}

export function RecentWorkCarousel({ albums }: RecentWorkCarouselProps) {
  return (
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
          },
        }}
        className="recent-work-swiper"
      >
        {albums.map((album, index) => (
          <SwiperSlide key={album.id}>
            <Card className="overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={album.thumbnail}
                    alt={album.title}
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
                      {album.imageCount} photos
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">{album.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(album.createdAt).getFullYear()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
