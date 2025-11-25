'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { useAppStore } from '@/store'
import { DetailItem, GalleryItem } from '@/types'

export default function AlbumPhotosPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const albumId = params.albumId as string
  
  const { getAlbumById, getAlbumPhotos, fetchAlbums, albums } = useAppStore()
  const album = getAlbumById(albumId)
  const [photos, setPhotos] = useState<DetailItem[]>([])
  const [loading, setLoading] = useState(true)
  // URL 쿼리 파라미터에서 페이지 번호 읽기
  const pageParam = searchParams.get('page')
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [imageRatios, setImageRatios] = useState<Map<string, number>>(new Map())
  const itemsPerPage = 15

  // 쿼리 파라미터가 변경되면 페이지 업데이트
  useEffect(() => {
    const pageParam = searchParams.get('page')
    if (pageParam) {
      const page = parseInt(pageParam, 10)
      if (page !== currentPage && page >= 1) {
        setCurrentPage(page)
      }
    }
  }, [searchParams, currentPage])

  useEffect(() => {
    const loadData = async () => {
      if (albumId) {
        setLoading(true)
        try {
          // 앨범 목록이 없으면 먼저 로드
          if (albums.length === 0) {
            await fetchAlbums()
          }
          
          // 사진 데이터 로드
          const fetchedPhotos = await getAlbumPhotos(albumId)
          setPhotos(fetchedPhotos)
        } catch (error) {
          console.error('Failed to load album photos:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    
    loadData()
  }, [albumId, getAlbumPhotos, fetchAlbums, albums.length])

  // DetailItem을 GalleryItem으로 변환
  const galleryItems: GalleryItem[] = photos.map((photo) => ({
    id: photo.id,
    title: photo.title,
    thumbnail: photo.image,
    category: 'photos' as const,
    createdAt: album?.createdAt || '',
    subtitle: photo.description,
  }))

  // 페이지네이션 계산
  const totalPages = Math.ceil(galleryItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = galleryItems.slice(startIndex, endIndex)

  // 이전/다음 페이지의 이미지를 미리 로드하고 비율 저장
  useEffect(() => {
    if (galleryItems.length === 0) return

    const preloadImages = (items: GalleryItem[]) => {
      items.forEach((item) => {
        // 이미 비율이 저장된 이미지는 건너뛰기
        if (imageRatios.has(item.id)) return

        const img = new Image()
        img.onload = () => {
          // 이미지의 실제 비율 계산 (width / height)
          const aspectRatio = img.naturalWidth / img.naturalHeight
          setImageRatios((prev) => new Map(prev).set(item.id, aspectRatio))
        }
        img.onerror = () => {
          // 에러 발생 시 기본 비율(4/3) 사용
          setImageRatios((prev) => new Map(prev).set(item.id, 4/3))
        }
        img.src = item.thumbnail
      })
    }

    // 현재 페이지 이미지
    preloadImages(currentItems)

    // 이전 페이지 이미지 (있는 경우)
    if (currentPage > 1) {
      const prevStartIndex = (currentPage - 2) * itemsPerPage
      const prevEndIndex = prevStartIndex + itemsPerPage
      const prevItems = galleryItems.slice(prevStartIndex, prevEndIndex)
      preloadImages(prevItems)
    }

    // 다음 페이지 이미지 (있는 경우)
    if (currentPage < totalPages) {
      const nextStartIndex = currentPage * itemsPerPage
      const nextEndIndex = nextStartIndex + itemsPerPage
      const nextItems = galleryItems.slice(nextStartIndex, nextEndIndex)
      preloadImages(nextItems)
    }
  }, [currentPage, galleryItems, itemsPerPage, totalPages, currentItems, imageRatios])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemClick = (itemId: string) => {
    // /photos/[albumId]/[photoId]로 이동
    router.push(`/photos/${albumId}/${itemId}`)
  }

  // 앨범이 없거나 로딩이 완료되었는데 사진이 없는 경우
  if (!loading && (!album || !photos.length)) {
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
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          {/* 페이지 헤더 */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 font-mono">02</span>
                <h1 className="text-3xl font-bold">
                  {loading ? '로딩 중...' : album?.title || '앨범'}
                </h1>
              </div>
              {!loading && (
                <div className="text-sm text-gray-600">
                  총 {photos.length}장
                </div>
              )}
            </div>
          </div>

          {/* 갤러리 그리드 */}
          <GalleryGrid
            items={currentItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            category="photos"
            isLoading={loading}
            onItemClick={handleItemClick}
            imageRatios={imageRatios}
          />
        </div>
      </div>
    </>
  )
}
