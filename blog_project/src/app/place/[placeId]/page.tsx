'use client'

import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { DetailSwiper } from '@/components/detail/detail-swiper'
import { useAppStore } from '@/store'

export default function PlaceDetailPage() {
  const params = useParams()
  const placeId = params.placeId as string
  
  const { getPlaceById, getPlacePhotos } = useAppStore()
  const place = getPlaceById(placeId)
  const photos = getPlacePhotos(placeId)

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
      <DetailSwiper
        items={photos}
        title={place.title}
        createdAt={place.createdAt}
        totalCount={place.imageCount}
      />
    </>
  )
}
