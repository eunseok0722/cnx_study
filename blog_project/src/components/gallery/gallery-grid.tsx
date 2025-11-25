'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { GalleryItem } from '@/types'

interface GalleryGridProps {
  items: GalleryItem[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  category: 'photos' | 'place' | 'youtube'
  isLoading?: boolean
  onItemClick?: (itemId: string) => void // 커스텀 클릭 핸들러 (선택적)
  imageRatios?: Map<string, number> // 이미지 비율 정보 (선택적)
}

export function GalleryGrid({ 
  items, 
  currentPage, 
  totalPages, 
  onPageChange, 
  category,
  isLoading = false,
  onItemClick,
  imageRatios: externalImageRatios
}: GalleryGridProps) {
  const router = useRouter()
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [internalImageRatios, setInternalImageRatios] = useState<Map<string, number>>(new Map())
  
  // 외부에서 전달된 비율이 있으면 사용, 없으면 내부 상태 사용
  const imageRatios = externalImageRatios || internalImageRatios

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
      // 페이지 변경 시 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
      // 페이지 변경 시 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleItemClick = (itemId: string) => {
    // 커스텀 클릭 핸들러가 있으면 사용, 없으면 기본 동작
    if (onItemClick) {
      onItemClick(itemId)
    } else {
      // 기본 동작: ID에서 카테고리 접두사 제거하여 실제 ID 추출
      const actualId = itemId.replace(`${category}-`, '')
      
      if (category === 'youtube') {
        router.push(`/interests/${actualId}`)
      } else {
        router.push(`/${category}/${actualId}`)
      }
    }
  }

  // 이미지 로딩 상태 추적
  useEffect(() => {
    // 이미 로드된 이미지는 제외
    const itemsToLoad = items.filter((item) => !loadedImages.has(item.id))
    
    itemsToLoad.forEach((item) => {
      const img = new Image()
      img.onload = () => {
        // 외부에서 비율을 관리하지 않으면 내부에서도 비율 저장
        if (!externalImageRatios) {
          const aspectRatio = img.naturalWidth / img.naturalHeight
          setInternalImageRatios((prev) => new Map(prev).set(item.id, aspectRatio))
        }
        // 로딩 상태는 항상 업데이트
        setLoadedImages((prev) => new Set(prev).add(item.id))
      }
      img.onerror = () => {
        // 외부에서 비율을 관리하지 않으면 내부에서도 비율 저장
        if (!externalImageRatios) {
          setInternalImageRatios((prev) => new Map(prev).set(item.id, 4/3))
        }
        // 로딩 상태는 항상 업데이트
        setLoadedImages((prev) => new Set(prev).add(item.id))
      }
      img.src = item.thumbnail
    })
  }, [items, loadedImages, externalImageRatios])

  // 다양한 높이를 위한 랜덤 높이 배열 (실제 masonry 레이아웃과 유사하게)
  const skeletonHeights = [
    'h-48', 'h-56', 'h-64', 'h-52', 'h-60', 
    'h-44', 'h-52', 'h-56', 'h-48', 'h-64'
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Masonry 그리드 */}
      <div className="gallery-grid columns-1 md:columns-2 lg:columns-3">
        {isLoading || items.length === 0 ? (
          // 스켈레톤 카드
          Array.from({ length: 9 }).map((_, index) => {
            const height = skeletonHeights[index % skeletonHeights.length]
            return (
              <div key={`skeleton-${index}`} className="gallery-item">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Skeleton className={`w-full ${height}`} />
                    </div>
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })
        ) : (
          // 실제 카드
          items.map((item) => {
            const isImageLoaded = loadedImages.has(item.id)
            // 저장된 비율이 있으면 사용, 없으면 기본값(4/3) 사용
            const aspectRatio = imageRatios.get(item.id) || 4/3
            
            return (
              <div key={item.id} className="gallery-item">
                <Card 
                  className="overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => handleItemClick(item.id)}
                >
                  <CardContent className="p-0">
                    <div 
                      className="relative overflow-hidden" 
                      style={{ aspectRatio: aspectRatio }}
                    >
                      {!isImageLoaded && (
                        <Skeleton className="w-full h-full absolute inset-0" />
                      )}
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className={`w-full h-full object-cover transition-opacity duration-300 group-hover:scale-110 ${
                          isImageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        {item.subtitle || item.createdAt}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="page-nav">
        <div className="page-nav-left">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="text-sm"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="text-sm"
          >
            Next
          </Button>
        </div>
      
      </div>
    </div>
  )
}
