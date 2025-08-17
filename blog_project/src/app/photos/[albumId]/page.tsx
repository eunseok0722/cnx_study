'use client'

import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { DetailSwiper } from '@/components/detail/detail-swiper'
import { useAppStore } from '@/store'

export default function AlbumDetailPage() {
  const params = useParams()
  const albumId = params.albumId as string
  
  const { getAlbumById, getAlbumPhotos } = useAppStore()
  const album = getAlbumById(albumId)
  const photos = getAlbumPhotos(albumId)

  if (!album || !photos.length) {
    return (
      <>
        <Header />
        <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">앨범을 찾을 수 없습니다</h1>
            <p className="text-gray-600">요청하신 앨범이 존재하지 않습니다.</p>
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
        title={album.title}
        createdAt={album.createdAt}
        totalCount={album.imageCount}
      />
    </>
  )
}
