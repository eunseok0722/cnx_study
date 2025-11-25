'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { DetailSwiper } from '@/components/detail/detail-swiper'
import { useAppStore } from '@/store'
import { DetailItem } from '@/types'

export default function PhotoDetailPage() {
  const params = useParams()
  const albumId = params.albumId as string
  const photoId = params.photoId as string
  
  const { getAlbumById, getAlbumPhotos, fetchAlbums, albums, setActivePlaylist, clearActivePlaylist } = useAppStore()
  const album = getAlbumById(albumId)
  const [photos, setPhotos] = useState<DetailItem[]>([])
  const [loading, setLoading] = useState(true)
  const [initialSlide, setInitialSlide] = useState(0)
  
  // 앨범에 재생목록이 있으면 플레이어 활성화, 없으면 비활성화
  useEffect(() => {
    if (album?.playlistId) {
      setActivePlaylist(album.playlistId, albumId)
    } else {
      // 재생목록이 없으면 플레이어 비활성화
      clearActivePlaylist()
    }
  }, [album?.playlistId, albumId, setActivePlaylist, clearActivePlaylist])

  useEffect(() => {
    const loadPhotos = async () => {
      if (albumId) {
        setLoading(true)
        try {
          // 앨범 목록이 없으면 먼저 로드
          if (albums.length === 0) {
            await fetchAlbums()
          }
          
          const fetchedPhotos = await getAlbumPhotos(albumId)
          setPhotos(fetchedPhotos)
          
          // photoId에 해당하는 인덱스 찾기
          const photoIndex = fetchedPhotos.findIndex(photo => photo.id === photoId)
          if (photoIndex !== -1) {
            setInitialSlide(photoIndex)
          }
        } catch (error) {
          console.error('Failed to load album photos:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    
    loadPhotos()
  }, [albumId, photoId, getAlbumPhotos, fetchAlbums, albums.length])

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
        initialSlide={initialSlide}
        albumId={albumId}
        itemsPerPage={15}
      />
    </>
  )
}

