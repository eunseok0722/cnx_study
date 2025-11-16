'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { DetailSwiper } from '@/components/detail/detail-swiper'
import { useAppStore } from '@/store'
import { DetailItem } from '@/types'

export default function AlbumDetailPage() {
  const params = useParams()
  const albumId = params.albumId as string
  
  const { getAlbumById, getAlbumPhotos } = useAppStore()
  const album = getAlbumById(albumId)
  const [photos, setPhotos] = useState<DetailItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPhotos = async () => {
      if (albumId) {
        setLoading(true)
        try {
          const fetchedPhotos = await getAlbumPhotos(albumId)
          setPhotos(fetchedPhotos)
        } catch (error) {
          console.error('Failed to load album photos:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    
    loadPhotos()
  }, [albumId, getAlbumPhotos])

  if (loading) {
    return (
      <>
        <Header />
        <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </>
    )
  }

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
